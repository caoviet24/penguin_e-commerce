"use client";

import React, { useEffect, useMemo } from 'react';
import { useAppSelector } from '@/redux/store';
import { FaLocationDot } from "react-icons/fa6";
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


export default function CheckOut() {
    const { my_account } = useAppSelector(state => state.account);
    const [info, setInfo] = React.useState({
        full_name: '',
        phone: '',
        address: '',
    });
    const [shipFee, setShipFee] = React.useState(Math.floor((Math.random() * (50 - 25 + 1)) + 25) * 1000);
    const [payActive, setPayActive] = React.useState({
        idx: 0,
        method: "Thanh toán khi nhận hàng",
    });

    const [openAddressModal, setOpenAddressModal] = React.useState(false);
    const [openNewAddressModal, setOpenNewAddressModal] = React.useState(false);
    const [idxAddress, setIdxAddress] = React.useState(0);

    const router = useRouter();
    const dispatch = useDispatch();

    const {
        storedValue: storedValueLocation,
        setValue: setValueLocation,
        removeValue: removeValueLocation
    } = useLocationStorage({
        key: 'location',
        initialValue: [],
    });

    const {
        storedValue: storedValueTempBill,
        setValue: setValueTempBill,
        removeValue: removeValueTempBill
    } = useLocationStorage({
        key: 'temp-bill',
        initialValue: {},
    })

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

        let city = cities.find(city => city.code == cityId);
        setInfo({
            ...info,
            address: `${city?.name}-`
        })

        const data = await locationVNService.getDistricts();
        if (data) {
            setDistricts(data.filter((district: any) => district.province_code == cityId));
        }

    }


    const handleOnChangeDistrict = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const data = await locationVNService.getWards();
        if (data) {
            setWards(data.filter((ward: any) => ward.district_code == e.target.value));
            let district = districts.find(district => district.code == e.target.value);
            setInfo({
                ...info,
                address: `${info.address} ${district?.name}-`
            })
        }
    }

    const handleOnChangeWard = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let ward = wards.find(ward => ward.code == e.target.value);
        setInfo({
            ...info,
            address: `${info.address} ${ward?.name}-`
        })
    }

    const handleOnChangeNewAddress = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInfo(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleDeleteAddress = (address: any) => {

        const idx = storedValueLocation.findIndex((item: any) =>
            item.full_name === address.full_name &&
            item.phone === address.phone &&
            item.address === address.address
        );

        if (idx !== -1) {
            storedValueLocation.splice(idx, 1);
            setValueLocation(storedValueLocation);
        }

    }

    const handleConfirmAddress = () => {
        setInfo(storedValueLocation[idxAddress]);
        setOpenAddressModal(false);
    }


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
        }, storedValueTempBill.total)


    }, [storedValueTempBill, shipFee]);


    const createBillMutation = useHookMutation((data) => {
        return billService.createBill(data);
    });

    const deleteOrderItemMutation = useHookMutation((id: string) => {
        return orderItemService.deleteOrderItem(id);
    })
    const handleCreateBill = () => {

        let { seller_id, list_bill_detail, list_voucher } = storedValueTempBill;
        createBillMutation.mutate({
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
                color: item.color
            })),
            list_voucher: list_voucher.map((voucher: IVoucher) => ({
                voucher_id: voucher.id
            }))
        }, {
            onSuccess: async (data) => {
                await deleteOrderItemMutation.mutate(storedValueTempBill.list_bill_detail.map((item: IOrderItem) => item.id), {
                    onSuccess: (data) => {
                        storedValueTempBill.list_bill_detail.forEach((item: IOrderItem) => {
                            dispatch(setDeleteToCart({
                                id: item.product_detail_id
                            }));
                        })

                        router.push(`/purchase`);
                        removeValueTempBill();
                    },
                    onError: (error) => {
                        toast.error('Đã có lỗi xảy ra!', {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: 0,
                        });
                    }
                });
            },
            onError: (error) => {
                toast.error('Đã có lỗi xảy ra!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: 0,
                });
            }
        })
    }



    return (
        <div className='container mt-5'>
            <div className='bg-white'>
                <div style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px)',
                    backgroundPositionX: '-30px',
                    backgroundSize: '116px 3px',
                    height: '3px',
                    width: '100%',
                }}></div>
                <div className='p-5'>
                    <div className='flex items-center gap-1 text-orange-500'>
                        <FaLocationDot size={24} />
                        <p className='text-lg font-semibold'>Thông tin nhận hàng</p>
                    </div>
                    <div className='flex flex-col gap-2 mt-2'>
                        <p className='font-semibold'>Thông tin khách hàng:
                            <span className='text-lg ml-2'>{info.full_name}</span>
                        </p>
                        <p className='font-semibold'>Số điện thoại:
                            <span className='text-lg ml-2'>{info.phone}</span>
                        </p>
                        <p className='font-semibold'>Địa chỉ:
                            <span className='text-lg ml-2'>{info.address}</span>
                        </p>
                        <button onClick={() => setOpenAddressModal(true)} className='max-w-[120px] text-start text-red-500 hover:underline'>Thay đổi</button>
                    </div>
                </div>
            </div>


            <div className='mb-10 bg-white'>
                <div className='flex justify-between items-center mt-4 px-2 py-4 rounded-md capitalize'>
                    <div className='w-2/5 flex items-center gap-2 px-7'>
                        <p>Sản phẩm</p>
                    </div>
                    <div className='grid grid-cols-3 gap-2 flex-1 text-center capitalize'>
                        <p>Đơn giá</p>
                        <p>Số lượng</p>
                        <p>Thành tiền</p>
                    </div>
                </div>
                <div>
                    {storedValueTempBill.list_bill_detail?.map((item: IOrderItem) => (
                        <div key={item.id} className='flex justify-between items-center p-2 rounded-md'>
                            <div className='w-2/5 flex items-center justify-between px-5 gap-2'>
                                <div className='flex items-center gap-2'>
                                    <Image src={item.product_detail.image} alt={item.product_detail.product_name} width={100} height={100} />
                                </div>
                                <p>{item.product_detail.product_name}</p>
                                <div>
                                    <p>Size: {item.size}</p>
                                    <p>Màu: {item.color}</p>
                                </div>
                            </div>
                            <div className='grid grid-cols-3 gap-2 flex-1 text-center'>
                                <div>
                                    <p className="line-through">{item.product_detail.sale_price.toLocaleString()}đ</p>
                                    {
                                        item.product_detail.promotional_price > 0 &&
                                        <p className='text-red-500'>{(item.product_detail.promotional_price).toLocaleString()}đ</p>
                                    }
                                </div>
                                <p>{item.quantity}</p>
                                <p>{(item.quantity * (item.product_detail.promotional_price > 0 ? item.product_detail.promotional_price : item.product_detail.sale_price)).toLocaleString()}đ</p>

                            </div>
                        </div>
                    ))}
                </div>
                <div className='bg-[#FBFDFE] border-t border-b border-gray-300 p p-5'>
                    <div className='flex flex-row items-center gap-10 py-2'>
                        <p className='text-lg font-bold capitalize'>Phương thức thanh toán</p>
                        <div className='flex flex-row items-center gap-2'>
                            {["Thanh toán khi nhận hàng", "Thanh toán qua ngân hàng", "Pengin Wallet"].map((p, idx) => (
                                <button
                                    key={idx}
                                    className={`flex gap-2 border border-solid border-gray-500 text-gray-500 px-4 py-2 rounded-sm relative ${payActive.idx === idx && 'border-red-500 text-black'}`}
                                    onClick={() => setPayActive({ idx: idx, method: p })}
                                >
                                    <span> {p}</span>
                                    {payActive.idx === idx && <Image className='absolute right-0 bottom-0 z-10' src="/images/check.webp" alt="check" width={16} height={16} />}
                                </button>
                            ))}
                        </div>
                    </div>



                    <div className='flex flex-col text-end text-lg py-2'>
                        <p>Giá gốc:
                            <span className="opacity-85 text-red-500"> {storedValueTempBill.list_bill_detail?.reduce((total: number, item: IOrderItem) =>
                                total + item.quantity * (item.product_detail.promotional_price > 0 ? item.product_detail.promotional_price : item.product_detail.sale_price
                                ), 0).toLocaleString()}đ
                            </span>
                        </p>
                        <p >Phí vận chuyển:
                            <span className="opacity-85 text-red-500"> {shipFee.toLocaleString()}đ</span>
                        </p>
                        {storedValueTempBill.list_voucher?.map((voucher: IVoucher) => (
                            <div key={voucher.id}>
                                {voucher.voucher_type === 'freeship' ?
                                    voucher.type_discount === 'percent' ?
                                        <p>Giảm tiền giao hàng :
                                            <span className="opacity-85 text-red-500"> {voucher.discount}%</span>
                                        </p>
                                        :
                                        <p>Giảm tiền giao hàng:
                                            <span className="opacity-85 text-red-500"> {voucher.discount.toLocaleString()}đ</span>
                                        </p>
                                    :
                                    voucher.type_discount === 'percent' ?
                                        <p>Giảm giá đơn hàng:
                                            <span className="opacity-85 text-red-500"> {voucher.discount}%</span>
                                        </p>
                                        :
                                        <p>Giảm giá đơn hàng:
                                            <span className="opacity-85 text-red-500"> {voucher.discount.toLocaleString()}đ</span>
                                        </p>
                                }
                            </div>
                        ))}

                        <p className="font-bold border-t border-gray-300 pt-5 mt-5">
                            Tổng cộng:
                            <span className="text-red-500 text-4xl">
                                {totalBill?.toLocaleString()}đ
                            </span>
                        </p>

                    </div>

                    <div className='flex justify-end mt-4'>
                        <button onClick={handleCreateBill} className="flex items-center rounded bg-purple-600 py-2 px-10 border border-transparent text-center text-lg text-white transition-all shadow-sm hover:shadow-md focus:bg-purple-500 focus:shadow-none active:bg-purple-500 hover:bg-purple-500 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                            <BiCart size={25} />
                            <span className="ml-1">Đặt hàng</span>
                        </button>
                    </div>

                </div>

            </div>

            <Modal
                open={openAddressModal}
                className='flex items-center justify-center'
            >
                <div className='bg-white p-5 w-[500px]'>
                    <h3 className='text-lg pb-1'>Địa chỉ của tôi</h3>
                    <Divider />
                    <div className='mt-2'>
                        {storedValueLocation.map((address: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    className="w-3 h-3 cursor-pointer appearance-none rounded-full border-2 border-gray-300 checked:bg-orange-500 checked:border-orange-500 focus:outline-none"
                                    name='address'
                                    value={index}
                                    checked={idxAddress === index}
                                    onChange={() => setIdxAddress(index)}
                                />
                                <div className="flex-1 px-2">
                                    <p>{address.full_name} | {address.phone}</p>
                                    <p>{address.address}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <button className="text-orange-500 text-sm hover:underline">Cập nhật</button>
                                    <button onClick={() => handleDeleteAddress(address)} className="text-red-500 text-sm hover:underline">Xóa</button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => {
                                setOpenNewAddressModal(true);
                                setOpenAddressModal(false);
                            }}
                            className='flex items-center gap-1 text-gray-400 mt-2 border border-gray-400 px-4 py-2'>
                            <BiPlus size={20} />
                            Thêm địa chỉ mới
                        </button>
                    </div>
                    <div className='flex justify-end mt-5 gap-2'>
                        <button
                            onClick={() => setOpenAddressModal(false)}
                            className='border border-gray-400 px-4 py-1 text-gray-400'>
                            Đóng
                        </button>
                        <button
                            onClick={handleConfirmAddress}
                            className='bg-orange-500 border border-orange-500 px-4 py-1 text-white'>
                            Xác nhận
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={openNewAddressModal}
                className='flex items-center justify-center'
            >
                <div className='bg-white p-5 w-[500px]'>
                    <h3 className='text-lg pb-1'>Thêm địa chỉ mới</h3>
                    <Divider />
                    <div className='mt-2 flex flex-col gap-2'>
                        <input
                            onChange={handleOnChangeNewAddress}
                            name='full_name'
                            value={info.full_name}
                            className='border border-solid border-gray-300 py-2 px-2 rounded-lg'
                            placeholder='Tên người nhận' />
                        <div className='flex justify-between'>
                            <select onChange={handleOnChangeCity} className='border border-solid border-gray-300 py-2 px-2 rounded-lg w-1/2'>
                                {cities.map((city) => (
                                    <option key={city.code} value={city.code}>{city.name}</option>
                                ))}
                            </select>
                            <select onChange={handleOnChangeDistrict} className='border border-solid border-gray-300 py-2 px-2 rounded-lg w-1/2'>
                                {districts && districts.map((district) => (
                                    <option key={district.code} value={district.code}>{district.name}</option>
                                ))}
                            </select>
                            <select onChange={handleOnChangeWard} className='border border-solid border-gray-300 py-2 px-2 rounded-lg w-1/2'>
                                {wards && wards.map((ward) => (
                                    <option key={ward.code} value={ward.code}>{ward.name}</option>
                                ))}
                            </select>
                        </div>
                        <textarea cols={2} rows={3} onChange={handleOnChangeNewAddress} name='address' className='border border-solid border-gray-300 py-2 px-2 rounded-lg' placeholder='Địa chỉ cụ thể' value={info.address} />

                        <input
                            value={info.phone}
                            onChange={handleOnChangeNewAddress}
                            name='phone'
                            className='border border-solidborder-gray-300 py-2 px-2 rounded-lg'
                            placeholder='Số điện thoại' />
                    </div>

                    <button className='flex flex-row items-center gap-1 text-gray-500 mt-2 border border-gray-400 px-4 py-2'>
                        <FaLocationDot size={24} />
                        Lấy vị trí của tôi
                    </button>
                    <div className='flex justify-end mt-5 gap-2'>
                        <button onClick={() => setOpenNewAddressModal(false)} className='border border-gray-400 px-4 py-1 text-gray-400'>Đóng</button>
                        <button onClick={() => {
                            setValueLocation([...storedValueLocation, info]);
                            setOpenNewAddressModal(false);
                        }}
                            className='bg-orange-500 border border-orange-500 px-4 py-1 text-white'>Xác nhận</button>
                    </div>
                </div>
            </Modal>

            <ToastContainer />

        </div>
    )
}
