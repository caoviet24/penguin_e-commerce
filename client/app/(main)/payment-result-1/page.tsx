'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { billService } from '@/services/bill.service';
import useLocationStorage from '@/hooks/useLocationStorage';
import { IOrderItem, IVoucher } from '@/types';

interface PaymentResult {
    success: boolean;
    paymentMethod: string;
    orderDescription: string;
    orderId: string;
    paymentId: string;
    transactionId: string;
    vnPayResponseCode: string;
    token?: string;
}

interface PaymentPayload {
    vnp_Amount: string;
    vnp_BankCode: string;
    vnp_BankTranNo: string;
    vnp_CardType: string;
    vnp_OrderInfo: string;
    vnp_PayDate: string;
    vnp_TmnCode: string | null;
    vnp_TransactionNo: string;
    vnp_TransactionStatus: string;
    vnp_TxnRef: string;
    vnp_SecureHash: string;
    success?: boolean;
    orderId?: string;
    orderDescription?: string;
    paymentMethod?: string;
    transactionId?: string;
    vnp_ResponseCode?: string;
}

export default function PaymentResultPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [payLoad, setPayLoad] = useState<PaymentPayload | null>(null);
    const [shouldCallApi, setShouldCallApi] = useState(false);

    const { storedValue: storedValueTempBill } = useLocationStorage({
        key: 'temp-bill',
        initialValue: {},
    });

    const { storedValue: storeValueInfoShipping } = useLocationStorage({
        key: 'info-shipping',
        initialValue: {},
    });
    useEffect(() => {
        const isReload =
            (window.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload';

        if (!isReload) {
            setShouldCallApi(true);
        }
    }, []);

    useEffect(() => {
        const vnp_Amount = searchParams.get('vnp_Amount') || '0';
        const vnp_BankCode = searchParams.get('vnp_BankCode') || '';
        const vnp_BankTranNo = searchParams.get('vnp_BankTranNo') || '';
        const vnp_CardType = searchParams.get('vnp_CardType') || '';
        const vnp_OrderInfo = searchParams.get('vnp_OrderInfo') || '';
        const vnp_PayDate = searchParams.get('vnp_PayDate') || '';
        const vnp_TmnCode = searchParams.get('vnp_TmnCode');
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode') || '';
        const vnp_TransactionNo = searchParams.get('vnp_TransactionNo') || '';
        const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus') || '';
        const vnp_TxnRef = searchParams.get('vnp_TxnRef') || '';
        const vnp_SecureHash = searchParams.get('vnp_SecureHash') || '';

        setPayLoad({
            vnp_Amount,
            vnp_BankCode,
            vnp_BankTranNo,
            vnp_CardType,
            vnp_OrderInfo,
            vnp_PayDate,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
            vnp_TxnRef,
            vnp_SecureHash,
            vnp_ResponseCode,
        });
    }, [searchParams]);

    const { data, isLoading, isSuccess } = useQuery<PaymentResult>({
        queryKey: ['paymentResult', payLoad],
        queryFn: () => paymentService.getCallBack(payLoad),
        enabled: !!payLoad && shouldCallApi,
    });

    const createBillMutation = useMutation({
        mutationKey: ['createBill'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: (data: any) => billService.createBill(data),
    });

    useEffect(() => {
        if (isSuccess && data) {
            const { success } = data;

            const { seller_id, list_bill_detail, list_voucher } = storedValueTempBill;
            const { full_name, phone, address } = storeValueInfoShipping;
            if (success) {
                createBillMutation.mutate({
                    seller_id,
                    total: parseFloat(searchParams.get('vnp_Amount')?.slice(0, -2) || '0'),
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
                });
            }
        }
    }, [isSuccess, data]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <h1 className="text-2xl font-bold text-center">Kết quả thanh toán</h1>
                </div>

                <div className="p-6">
                    {data ? (
                        <>
                            <div className="flex justify-center mb-6">
                                {data.success ? (
                                    <FaCheckCircle className="text-green-500 text-6xl" />
                                ) : (
                                    <FaTimesCircle className="text-red-500 text-6xl" />
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-center mb-4">
                                {data.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
                            </h2>

                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-2">
                                    <p className="text-gray-600">Mã đơn hàng:</p>
                                    <p className="font-medium">{data.orderId}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <p className="text-gray-600">Số tiền thanh toán:</p>
                                    <p className="font-medium">
                                        {parseFloat(
                                            searchParams.get('vnp_Amount')?.slice(0, -2) || '0',
                                        ).toLocaleString()}{' '}
                                        VNĐ
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <p className="text-gray-600">Mô tả:</p>
                                    <p className="font-medium">{data.orderDescription}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <p className="text-gray-600">Phương thức thanh toán:</p>
                                    <p className="font-medium">{data.paymentMethod}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <p className="text-gray-600">Mã giao dịch:</p>
                                    <p className="font-medium">{data.transactionId}</p>
                                </div>

                                {!data.success && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <p className="text-gray-600">Mã lỗi:</p>
                                        <p className="font-medium text-red-500">{data.vnPayResponseCode}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <h2 className="text-xl font-bold text-red-500 mb-2">Không tìm thấy thông tin thanh toán</h2>
                            <p className="text-gray-600">Không có thông tin giao dịch được tìm thấy.</p>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/purchase')}
                            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                        >
                            Xem đơn hàng
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
