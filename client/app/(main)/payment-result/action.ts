import { IOrderItem, IVoucher } from '@/types';
import axiosJWT from '@/utils/axios.interceptor';

export interface IPaymentInfoResult {
    id: string;
    orderCode: number;
    amount: number;
    amountPaid: number;
    amountRemaining: number;
    status: string;
    createdAt: Date;
}

export async function getPaymentInfo(orderCode: number): Promise<IPaymentInfoResult> {
    const res = await axiosJWT(`${process.env.NEXT_PUBLIC_API_URL}/payment/get-info`, {
        params: {
            orderCode,
        },
    });
    return res.data;
}



interface ICreateBillPayLoad {
    seller_id: string;
    total: number;
    pay_method: string;
    name_receiver: string;
    phone_receiver: string;
    address_receiver: string;
    list_bill_detail: IOrderItem[];
    list_voucher: IVoucher[];
}

export async function createBill(formData: ICreateBillPayLoad) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/bill/create`, formData);
    return res.data;
}
