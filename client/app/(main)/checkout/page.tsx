'use client';

import React, { useEffect, useMemo, useTransition } from 'react';
import { useAppSelector } from '@/redux/store';
import { FaLocationDot } from 'react-icons/fa6';
import { Divider, Modal } from '@mui/material';
import useLocationStorage from '@/hooks/useLocationStorage';
import { BiCart, BiPlus } from 'react-icons/bi';
import { locationVNService } from '@/services/locationVN.service';
import { IOrderItem, IVoucher } from '@/types';
import Image from 'next/image';
import useHookMutation from '@/hooks/useHookMutation';
import { billService } from '@/services/bill.service';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { orderItemService } from '@/services/orderItem.service';
import { useDispatch } from 'react-redux';
import { setDeleteToCart } from '@/redux/slices/cart.slice';
import { createPayment, IFormPaymetData } from './action';

export default function CheckOut() {
    const { my_account } = useAppSelector((state) => state.account);
    const [info, setInfo] = React.useState({
        full_name: '',
        phone: '',
        address: '',
    });
    const [openAlert, setOpenAlert] = React.useState(false);

    const shipFee = React.useState(Math.floor(Math.random() * (50 - 25 + 1) + 25) * 1000)[0];
    const [payActive, setPayActive] = React.useState({
        idx: 0,
        method: 'Thanh toán khi nhận hàng',
    });



    const [openAddressModal, setOpenAddressModal] = React.useState(false);
    const [openNewAddressModal, setOpenNewAddressModal] = React.useState(false);
    const [idxAddress, setIdxAddress] = React.useState(0);


    const router = useRouter();
    const dispatch = useDispatch();

    const {
        storedValue: storedValueLocation,
        setValue: setValueLocation,
        // removeValue is omitted as it's not used
    } = useLocationStorage({
        key: 'location',
        initialValue: [],
    });

    const {
        storedValue: storedValueTempBill,
        // setValue is omitted as it's not used
        removeValue: removeValueTempBill,
    } = useLocationStorage({
        key: 'temp-bill',
        initialValue: {},
    });

    const { setValue: setValueInfoShipping } = useLocationStorage({
        key: 'info-shipping',
        initialValue: info,
    });

    const [cities, setCities] = React.useState<{ code: string; name: string }[]>([]);
    const [districts, setDistricts] = React.useState<{ province_code: string; code: string; name: string }[]>([]);
    const [wards, setWards] = React.useState<{ district_code: string; code: string; name: string }[]>([]);

    useEffect(() => {
        async function a() {
            const data = await locationVNService.getCities();
            if (data) {
                setCities(data);
            }
        }
        a();
    }, []);

    const handleOnChangeCity = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = e.target.value;

        const city = cities.find((city) => city.code == cityId);
        setInfo({
            ...info,
            address: `${city?.name}-`,
        });

        const data = await locationVNService.getDistricts();
        if (data) {
            setDistricts(data.filter((district: { province_code: string }) => district.province_code == cityId));
        }
    };

    const handleOnChangeDistrict = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const data = await locationVNService.getWards();
        if (data) {
            setWards(data.filter((ward: { district_code: string }) => ward.district_code == e.target.value));
            const district = districts.find((district) => district.code == e.target.value);
            setInfo({
                ...info,
                address: `${info.address} ${district?.name}-`,
            });
        }
    };

    const handleOnChangeWard = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ward = wards.find((ward) => ward.code == e.target.value);
        setInfo({
            ...info,
            address: `${info.address} ${ward?.name}-`,
        });
    };

    const handleOnChangeNewAddress = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInfo((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    interface IAddress {
        full_name: string;
        phone: string;
        address: string;
    }

    const handleDeleteAddress = (address: IAddress) => {
        const idx = storedValueLocation.findIndex(
            (item: IAddress) =>
                item.full_name === address.full_name &&
                item.phone === address.phone &&
                item.address === address.address,
        );

        if (idx !== -1) {
            storedValueLocation.splice(idx, 1);
            setValueLocation(storedValueLocation);
        }
    };

    const handleConfirmAddress = () => {
        setInfo(storedValueLocation[idxAddress]);
        setOpenAddressModal(false);
    };

    useEffect(() => {
        setInfo({
            full_name: my_account.user.full_name,
            phone: my_account?.user.phone,
            address: my_account?.user.address,
        });
    }, [my_account]);

    const totalBill = useMemo(() => {
        return storedValueTempBill.list_voucher?.reduce((total: number, voucher: IVoucher) => {
            if (voucher.voucher_type === 'freeship') {
                if (voucher.type_discount === 'percent') {
                    return total + (shipFee - shipFee * (voucher.discount / 100));
                } else {
                    return total + (shipFee - voucher.discount);
                }
            }
            return total;
        }, storedValueTempBill.total);
    }, [storedValueTempBill, shipFee]);

    const createBillMutation = useHookMutation((data) => {
        return billService.createBill(data);
    });

    const deleteOrderItemMutation = useHookMutation((id: string) => {
        return orderItemService.deleteOrderItem(id);
    });
    const handleCreateBill = () => {
        if (!info) {
            toast.error('Vui lòng chọn địa chỉ giao hàng!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
            });
            return;
        }

        if (payActive.idx === -1) {
            toast.error('Vui lòng chọn phương thức thanh toán!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
            });
            return;
        }

        if (payActive.idx === 1 && payActive.method.includes('Thanh toán qua ngân hàng')) {
            setOpenAlert(true);
            return;
        }

        const { seller_id, list_bill_detail, list_voucher } = storedValueTempBill;
        createBillMutation.mutate(
            {
                seller_id,
                total: totalBill,
                pay_method: payActive.method,
                name_receiver: info.full_name,
                phone_receiver: info.phone,
                address_receiver: info.address,
                list_bill_detail: list_bill_detail.map((item: IOrderItem) => ({
                    product_detail_id: item.product_detail_id,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                })),
                list_voucher: list_voucher.map((voucher: IVoucher) => ({
                    voucher_id: voucher.id,
                })),
            },
            {
                onSuccess: async () => {
                    await deleteOrderItemMutation.mutate(
                        storedValueTempBill.list_bill_detail.map((item: IOrderItem) => item.id),
                        {
                            onSuccess: () => {
                                storedValueTempBill.list_bill_detail.forEach((item: IOrderItem) => {
                                    dispatch(
                                        setDeleteToCart({
                                            id: item.product_detail_id,
                                        }),
                                    );
                                });

                                router.push(`/purchase`);
                                removeValueTempBill();
                            },
                            onError: () => {
                                toast.error('Đã có lỗi xảy ra!', {
                                    position: 'top-right',
                                    autoClose: 3000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: 0,
                                });
                            },
                        },
                    );
                },
                onError: () => {
                    toast.error('Đã có lỗi xảy ra!', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: 0,
                    });
                },
            },
        );
    };


    const [isGetUrlPayPending, startPaymentTransition] = useTransition();



    const handlePayBank = async () => {
        setValueInfoShipping(info);

        const formData: IFormPaymetData = {
            amount: 2000,
            description: `Hóa đơn ${Math.floor(Math.random() * 100000)}`,
            items: storedValueTempBill.list_bill_detail.map((item: IOrderItem) => ({
                name: item.product_detail.product_name,
                price: item.product_detail.promotional_price > 0 ? item.product_detail.promotional_price : item.product_detail.sale_price,
                quantity: item.quantity,
            })),
            returnUrl: process.env.NEXT_PUBLIC_RETURN_PAYMENT_URL || '',
            cancelUrl: process.env.NEXT_PUBLIC_CANCEL_PAYMENT_URL || '',
        }
        console.log(formData);

        startPaymentTransition(async () => {
            try {
                if (formData) {

                    const result = await createPayment(formData);
                    if (result) {
                        const { checkoutUrl } = result;
                        if (checkoutUrl) {
                            window.open(checkoutUrl);
                        }
                    }
                }
            } catch (error) {
                console.error('Error creating payment:', error);
            }
        });

        // createPaymentMutation.mutate(
        //     {
        //         amount: totalBill,
        //         description: `Thanh toán đơn hàng ${Math.floor(Math.random() * 100000000)}`,
        //     },
        //     {
        //         onSuccess: (data: { paymentUrl?: string }) => {
        //             if (data?.paymentUrl) {
        //                 window.open(data.paymentUrl);
        //             }
        //         },
        //     },
        // );
    };

    return (
        <div className="container mx-auto mt-5 px-4 md:px-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 w-full"></div>
                <div className="p-6">
                    <div className="flex items-center gap-2 text-purple-600 mb-4">
                        <FaLocationDot size={24} />
                        <h2 className="text-xl font-bold">Thông tin nhận hàng</h2>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500">Thông tin khách hàng</p>
                                <p className="font-medium text-lg">{info.full_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Số điện thoại</p>
                                <p className="font-medium text-lg">{info.phone}</p>
                            </div>
                        </div>
                        <div className="mt-3">
                            <p className="text-gray-500">Địa chỉ giao hàng</p>
                            <p className="font-medium text-lg">{info.address}</p>
                        </div>
                        <button
                            onClick={() => setOpenAddressModal(true)}
                            className="mt-3 flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors font-medium"
                        >
                            <span>Thay đổi địa chỉ</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 mb-10 bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-100 p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Thông tin đơn hàng</h2>
                    <p className="text-gray-500 text-sm">Kiểm tra lại thông tin sản phẩm trước khi đặt hàng</p>
                </div>

                <div className="hidden md:flex justify-between items-center bg-gray-50 px-6 py-3 border-y border-gray-100">
                    <div className="w-2/5">
                        <p className="font-medium text-gray-700">Sản phẩm</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 flex-1 text-center">
                        <p className="font-medium text-gray-700">Đơn giá</p>
                        <p className="font-medium text-gray-700">Số lượng</p>
                        <p className="font-medium text-gray-700">Thành tiền</p>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {storedValueTempBill.list_bill_detail?.map((item: IOrderItem) => (
                        <div key={item.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div className="md:w-2/5 flex items-start gap-4">
                                    <div className="relative">
                                        <Image
                                            src={item.product_detail.image}
                                            alt={item.product_detail.product_name}
                                            width={90}
                                            height={90}
                                            className="rounded-md border border-gray-200 object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1 line-clamp-2">
                                            {item.product_detail.product_name}
                                        </p>
                                        <div className="flex flex-wrap gap-x-4 text-sm text-gray-500">
                                            <p>
                                                Size: <span className="font-medium">{item.size}</span>
                                            </p>
                                            <p>
                                                Màu: <span className="font-medium">{item.color}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 flex-1 md:text-center">
                                    <div className="flex justify-between md:block">
                                        <span className="md:hidden font-medium text-gray-500">Đơn giá:</span>
                                        <div>
                                            <p className="line-through text-gray-400 text-sm">
                                                {item.product_detail.sale_price.toLocaleString()}đ
                                            </p>
                                            {item.product_detail.promotional_price > 0 && (
                                                <p className="text-red-500 font-medium">
                                                    {item.product_detail.promotional_price.toLocaleString()}đ
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between md:block">
                                        <span className="md:hidden font-medium text-gray-500">Số lượng:</span>
                                        <p className="font-medium">{item.quantity}</p>
                                    </div>

                                    <div className="flex justify-between md:block">
                                        <span className="md:hidden font-medium text-gray-500">Thành tiền:</span>
                                        <p className="font-medium text-red-500">
                                            {(
                                                item.quantity *
                                                (item.product_detail.promotional_price > 0
                                                    ? item.product_detail.promotional_price
                                                    : item.product_detail.sale_price)
                                            ).toLocaleString()}
                                            đ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-4">Phương thức thanh toán</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {['Thanh toán khi nhận hàng', 'Thanh toán qua ngân hàng', 'Pengin Wallet'].map((p, idx) => (
                                <button
                                    key={idx}
                                    className={`flex items-center justify-center gap-2 border border-solid px-4 py-3 rounded-md relative transition-all ${payActive.idx === idx
                                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                                        : 'border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50/30'
                                        }`}
                                    onClick={() => setPayActive({ idx: idx, method: p })}
                                >
                                    <span className="font-medium">{p}</span>
                                    {payActive.idx === idx && (
                                        <div className="absolute right-3 flex items-center justify-center w-5 h-5 bg-purple-600 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                                className="w-3 h-3"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <p className="text-gray-600">Tổng tiền hàng:</p>
                                <p className="font-medium">
                                    {storedValueTempBill.list_bill_detail
                                        ?.reduce(
                                            (total: number, item: IOrderItem) =>
                                                total +
                                                item.quantity *
                                                (item.product_detail.promotional_price > 0
                                                    ? item.product_detail.promotional_price
                                                    : item.product_detail.sale_price),
                                            0,
                                        )
                                        .toLocaleString()}
                                    đ
                                </p>
                            </div>

                            <div className="flex justify-between">
                                <p className="text-gray-600">Phí vận chuyển:</p>
                                <p className="font-medium">{shipFee.toLocaleString()}đ</p>
                            </div>

                            {storedValueTempBill.list_voucher?.map((voucher: IVoucher) => (
                                <div key={voucher.id} className="flex justify-between">
                                    <p className="text-gray-600">
                                        {voucher.voucher_type === 'freeship'
                                            ? 'Giảm tiền giao hàng:'
                                            : 'Giảm giá đơn hàng:'}
                                    </p>
                                    <p className="font-medium text-green-600">
                                        -{' '}
                                        {voucher.type_discount === 'percent'
                                            ? `${voucher.discount}%`
                                            : `${voucher.discount.toLocaleString()}đ`}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-dashed-gray my-4"></div>

                        <div className="flex justify-between items-center">
                            <p className="text-lg font-bold">Tổng thanh toán:</p>
                            <p className="text-2xl md:text-3xl font-bold text-red-600">
                                {totalBill?.toLocaleString()}đ
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleCreateBill}
                            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 py-3 px-8 text-center text-lg font-medium text-white transition-all shadow hover:shadow-lg hover:from-purple-700 hover:to-purple-800 active:shadow-inner disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            <BiCart size={22} />
                            <span>Đặt hàng</span>
                        </button>
                    </div>
                </div>
            </div>

            <Modal open={openAddressModal} className="flex items-center justify-center">
                <div className="bg-white p-6 w-full max-w-[600px] rounded-lg shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Địa chỉ của tôi</h3>
                        <button
                            onClick={() => setOpenAddressModal(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <Divider />

                    <div className="mt-4 max-h-[300px] overflow-y-auto">
                        {storedValueLocation.length > 0 ? (
                            <div className="space-y-3">
                                {storedValueLocation.map((address: IAddress, index: number) => (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${idxAddress === index
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIdxAddress(index)}
                                    >
                                        <input
                                            type="radio"
                                            className="w-4 h-4 mt-1 cursor-pointer border-2 border-purple-500 text-purple-600 focus:ring-purple-500"
                                            name="address"
                                            value={index}
                                            checked={idxAddress === index}
                                            onChange={() => setIdxAddress(index)}
                                        />
                                        <div className="flex-1">
                                            <div className="flex flex-wrap gap-x-2 mb-1">
                                                <p className="font-medium">{address.full_name}</p>
                                                <p className="text-gray-600">|</p>
                                                <p className="text-gray-600">{address.phone}</p>
                                            </div>
                                            <p className="text-gray-600 text-sm">{address.address}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="text-purple-600 text-sm hover:text-purple-800">
                                                Cập nhật
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAddress(address);
                                                }}
                                                className="text-red-500 text-sm hover:text-red-700"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                <p>Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</p>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setOpenNewAddressModal(true);
                                setOpenAddressModal(false);
                            }}
                            className="flex items-center justify-center gap-2 w-full mt-4 border border-dashed border-purple-400 bg-purple-50 hover:bg-purple-100 rounded-lg px-4 py-3 text-purple-700 font-medium transition-colors"
                        >
                            <BiPlus size={20} />
                            Thêm địa chỉ mới
                        </button>
                    </div>

                    <div className="flex justify-end mt-6 gap-3">
                        <button
                            onClick={() => setOpenAddressModal(false)}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={handleConfirmAddress}
                            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal open={openNewAddressModal} className="flex items-center justify-center">
                <div className="bg-white p-6 w-full max-w-[600px] rounded-lg shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Thêm địa chỉ mới</h3>
                        <button
                            onClick={() => setOpenNewAddressModal(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <Divider />

                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên người nhận</label>
                            <input
                                onChange={handleOnChangeNewAddress}
                                name="full_name"
                                value={info.full_name}
                                className="w-full border border-gray-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="Nhập tên người nhận"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                value={info.phone}
                                onChange={handleOnChangeNewAddress}
                                name="phone"
                                className="w-full border border-gray-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <div>
                                    <select
                                        onChange={handleOnChangeCity}
                                        className="w-full border border-gray-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Chọn tỉnh/thành phố</option>
                                        {cities.map((city) => (
                                            <option key={city.code} value={city.code}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        onChange={handleOnChangeDistrict}
                                        className="w-full border border-gray-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Chọn quận/huyện</option>
                                        {districts &&
                                            districts.map((district) => (
                                                <option key={district.code} value={district.code}>
                                                    {district.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        onChange={handleOnChangeWard}
                                        className="w-full border border-gray-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Chọn phường/xã</option>
                                        {wards &&
                                            wards.map((ward) => (
                                                <option key={ward.code} value={ward.code}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <textarea
                                cols={2}
                                rows={3}
                                onChange={handleOnChangeNewAddress}
                                name="address"
                                className="w-full border border-gray-300 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                placeholder="Địa chỉ cụ thể (số nhà, đường, tòa nhà...)"
                                value={info.address}
                            />
                        </div>
                    </div>

                    <button className="flex items-center gap-2 mt-4 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <FaLocationDot size={18} className="text-purple-600" />
                        <span>Lấy vị trí hiện tại của tôi</span>
                    </button>

                    <div className="flex justify-end mt-6 gap-3">
                        <button
                            onClick={() => setOpenNewAddressModal(false)}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={() => {
                                setValueLocation([...storedValueLocation, info]);
                                setOpenNewAddressModal(false);
                            }}
                            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal open={openAlert} className="flex items-center justify-center">
                <div>
                    <div className="bg-white p-6 w-full max-w-[600px] rounded-lg shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Thông báo</h3>
                            <button
                                onClick={() => setOpenAlert(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <Divider />

                        <div className="mt-4 text-center">
                            <p className="text-lg font-medium text-gray-700">
                                Chọn xác nhận để chuyển sang trang thanh toán
                            </p>
                        </div>

                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                onClick={handlePayBank}
                                className="px-6 py-2 rounded-lg border bg-blue-500 text-white border-gray-300  hover:bg-blue-300 transition-colors"
                            >
                                {isGetUrlPayPending ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                            <button
                                onClick={() => setOpenAlert(false)}
                                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <ToastContainer />
        </div>
    );
}
