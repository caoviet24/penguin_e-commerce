'use client';
import React, { useEffect, useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { billService } from '@/services/bill.service';
import useLocationStorage from '@/hooks/useLocationStorage';
import { IOrderItem, IVoucher } from '@/types';
import { getPaymentInfo, IPaymentInfoResult } from './action';
import { PaymentStatus } from '@/types/enum';
import handleTimeVn from '@/utils/handleTimeVn';

// Add CSS animation class
import '@/app/globals.css';

export default function PaymentResultPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [shouldCallApi, setShouldCallApi] = useState(false);
    const [orderCode, setOrderCode] = useState<number | null>(null);
    const [isGetPaymentInfoPending, startGetPaymentTransaction] = useTransition();
    const [result, setResult] = useState<IPaymentInfoResult | null>(null);

    const { storedValue: storedValueTempBill } = useLocationStorage({
        key: 'temp-bill',
        initialValue: {},
    });

    const { storedValue: storeValueInfoShipping } = useLocationStorage({
        key: 'info-shipping',
        initialValue: {},
    });

    // Check if page was reloaded to prevent duplicate API calls
    useEffect(() => {
        const isReload =
            (window.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload';

        if (!isReload) {
            setShouldCallApi(true);
        }
    }, []);

    // Get order code from URL parameters
    useEffect(() => {
        const code = searchParams.get('orderCode');
        if (code) setOrderCode(Number(code));
    }, [searchParams]);

    // Fetch payment information
    useEffect(() => {
        if (!orderCode) return;

        startGetPaymentTransaction(async () => {
            try {
                const res = await getPaymentInfo(orderCode);
                if (res) setResult(res);
            } catch (error) {
                console.error('Error fetching payment info:', error);
            }
        });
    }, [orderCode]);

    // Create bill when payment is successful
    useEffect(() => {
        if (result?.status !== PaymentStatus.SUCCESS || !shouldCallApi) return;

        const createBill = async () => {
            const { seller_id, list_bill_detail, list_voucher } = storedValueTempBill;
            const { full_name, phone, address } = storeValueInfoShipping;

            const formData = {
                seller_id,
                total: result.amount,
                pay_method: 'Thanh toán qua ngân hàng',
                name_receiver: full_name,
                phone_receiver: phone,
                address_receiver: address,
                list_bill_detail: list_bill_detail.map((item: IOrderItem) => ({
                    product_detail_id: item.product_detail_id,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                })),
                list_voucher: list_voucher.map((voucher: IVoucher) => ({
                    voucher_id: voucher.id,
                })),
            };

            await billService.createBill(formData);
        };

        createBill();
    }, [result, shouldCallApi, storedValueTempBill, storeValueInfoShipping]);

    if (isGetPaymentInfoPending) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="flex flex-col justify-center items-center h-60">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang xử lý thanh toán...</p>
                </div>
            </div>
        );
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case PaymentStatus.SUCCESS: return "Thanh toán thành công";
            case PaymentStatus.CANCELLED: return "Đã hủy thanh toán";
            case PaymentStatus.PENDING: return "Đang chờ xử lý";
            case PaymentStatus.EXPIRED: return "Đã hết hạn "
            default: return "";
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 text-white relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        {/* Background pattern */}
                        <div className="absolute w-20 h-20 rounded-full bg-white top-10 left-10"></div>
                        <div className="absolute w-16 h-16 rounded-full bg-white bottom-10 right-10"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-center tracking-wide">Kết quả thanh toán</h1>
                </div>

                <div className="p-8">
                    {result ? (
                        <>
                            <div className="flex justify-center mb-8">
                                {result.status === PaymentStatus.SUCCESS ? (
                                    <div className="flex flex-col items-center animate-fadeIn">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-green-100 mb-4">
                                            <FaCheckCircle className="text-green-500 text-6xl" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-green-600">Thanh toán thành công</h2>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center animate-fadeIn">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-red-100 mb-4">
                                            <FaTimesCircle className="text-red-500 text-6xl" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-red-600">Thanh toán thất bại</h2>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                {result.status === PaymentStatus.SUCCESS && (
                                    <div className="text-center mb-4">
                                        <p className="text-sm text-gray-500">Cảm ơn bạn đã mua hàng tại Penguin E-commerce!</p>
                                    </div>
                                )}
                                
                                {[
                                    { label: "Mã đơn hàng:", value: result.orderCode, highlight: true },
                                    { label: "Số tiền thanh toán:", value: `${result.amount?.toLocaleString("vi-VN")} VNĐ`, highlight: result.status === PaymentStatus.SUCCESS },
                                    { label: "Ngày tạo:", value: handleTimeVn(result.createdAt) },
                                    { label: "Mã giao dịch:", value: result.id },
                                    { label: "Trạng thái:", value: getStatusText(result.status), highlight: true }
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100 last:border-0">
                                        <p className="text-gray-600 sm:w-1/3">{item.label}</p>
                                        <p className={`font-medium sm:w-2/3 ${item.highlight ? 'text-purple-700' : ''}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <FaTimesCircle className="text-red-500 text-4xl" />
                            </div>
                            <h2 className="text-xl font-bold text-red-500 mb-2">Không tìm thấy thông tin thanh toán</h2>
                            <p className="text-gray-600">Không có thông tin giao dịch được tìm thấy.</p>
                        </div>
                    )}

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/purchase')}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-8 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Xem đơn hàng
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-white border border-gray-300 text-gray-700 py-3 px-8 rounded-lg font-medium transition-all duration-300 hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Quay lại trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
