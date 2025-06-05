'use client';

import React, { useMemo } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import useLocationStorage from '@/hooks/useLocationStorage';
import { BiCart } from 'react-icons/bi';
import { IOrderItem, IVoucher } from '@/types';
import Image from 'next/image';
import { billService, ICreateBillPayload } from '@/services/bill.service';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { IFormPaymentData, paymentService } from '@/services/payment.service';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import DeliveryAddressTableDialog from './DeliveryAddressTableDialog';
import { useUser } from '@/hooks/useAuth';
import { Check } from 'lucide-react';

export default function CheckOut() {
    const { user } = useUser();
    const [info, setInfo] = React.useState({
        full_name: user?.full_name || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });
    const [openAlert, setOpenAlert] = React.useState(false);

    const shipFee = React.useState(Math.floor(Math.random() * (50 - 25 + 1) + 25) * 1000)[0];
    const [payActive, setPayActive] = React.useState({
        idx: 0,
        method: 'COD',
    });

    const [openAddressDialog, setOpenAddressDialog] = React.useState(false);

    const router = useRouter();

    const {
        storedValue: storedValueTempBill,
        setValue: setValueTempBill,
        removeValue: removeValueTempBill,
    } = useLocationStorage({
        key: 'temp-bill',
        initialValue: {},
    });

    const { setValue: setValueInfoShipping } = useLocationStorage({
        key: 'info-shipping',
        initialValue: info,
    });

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

    const createBillMutation = useMutation({
        mutationKey: ['createBill'],
        mutationFn: (data: ICreateBillPayload) => billService.create(data),
    });

    const createPaymentMutation = useMutation({
        mutationKey: ['createPayment'],
        mutationFn: (data: IFormPaymentData) => paymentService.create(data),
    });

    const handleCreateBill = () => {
        if (!info.address || !info.full_name || !info.phone) {
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

        if (payActive.idx === 1 && payActive.method.includes('BANK TRANSFER')) {
            setOpenAlert(true);
            return;
        }

        const { seller_id, list_bill_detail, list_voucher, address_delivery_id, list_order_item } = storedValueTempBill;
        createBillMutation.mutate(
            {
                seller_id,
                total_bill: totalBill,
                pay_method: payActive.method,
                address_delivery_id,
                list_bill_detail: list_bill_detail.map((item: IOrderItem) => ({
                    product_detail_id: item.product_detail_id,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                })),
                list_voucher: list_voucher.map((voucher: IVoucher) => ({
                    voucher_id: voucher.id,
                })),
                list_order_item: list_order_item,
            },
            {
                onSuccess: async () => {
                    removeValueTempBill();
                    router.push('/purchase');
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

    const handlePayBank = async () => {
        setValueInfoShipping(info);

        createPaymentMutation.mutate(
            {
                amount: 2000,
                description: `Hóa đơn ${Math.floor(Math.random() * 100000)}`,
                items: storedValueTempBill.list_bill_detail.map((item: IOrderItem) => ({
                    name: item.product_detail.product_name,
                    price:
                        item.product_detail.promotional_price > 0
                            ? item.product_detail.promotional_price
                            : item.product_detail.sale_price,

                    quantity: item.quantity,
                })),
            },
            {
                onSuccess: (data) => {
                    if (data) {
                        router.push(data.checkoutUrl);
                    } else {
                        toast.error('Không thể tạo liên kết thanh toán!', {
                            position: 'top-right',
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: 0,
                        });
                    }
                },
                onError: () => {
                    toast.error('Đã có lỗi xảy ra khi tạo liên kết thanh toán!', {
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
                            onClick={() => setOpenAddressDialog(true)}
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
                            {[
                                {
                                    name: 'Thanh toán khi nhận hàng',
                                    method: 'COD',
                                },
                                {
                                    name: 'Thanh toán qua ngân hàng',
                                    method: 'BANK TRANSFER',
                                },
                                {
                                    name: 'Pengin Wallet',
                                    method: 'WALLET',
                                },
                            ].map((p, idx) => (
                                <button
                                    key={idx}
                                    className={`flex items-center justify-center gap-2 border border-solid px-4 py-3 rounded-md relative transition-all ${
                                        payActive.idx === idx
                                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                                            : 'border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50/30'
                                    }`}
                                    onClick={() => setPayActive({ idx: idx, method: p.method })}
                                >
                                    <span className="font-medium">{p.name}</span>
                                    {payActive.idx === idx && (
                                        <div className="absolute right-3 flex items-center justify-center w-5 h-5 bg-purple-600 rounded-full">
                                            <Check className="text-white" />
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

            <DeliveryAddressTableDialog
                open={openAddressDialog}
                onOpenChange={setOpenAddressDialog}
                userId={user?.id || ''}
                onSelect={(address) => {
                    setOpenAddressDialog(false);
                    setInfo({
                        full_name: address.full_name,
                        phone: address.phone,
                        address: address.address,
                    });
                    setValueTempBill({
                        ...storedValueTempBill,
                        address_delivery_id: address.id,
                    });
                }}
                selectedAddress={{
                    full_name: info.full_name,
                    phone: info.phone,
                    address: info.address,
                }}
            />

            <Dialog open={openAlert} onOpenChange={setOpenAlert}>
                <DialogTitle>
                  
                        <span className="text-lg font-bold">Xác nhận thanh toán</span>
                </DialogTitle>
                <DialogContent>
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
                        <Separator />

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
                                {createPaymentMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                            <button
                                onClick={() => setOpenAlert(false)}
                                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
