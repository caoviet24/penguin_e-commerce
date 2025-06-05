import { ISaleBill, ResponseData } from '@/types';
import axiosJWT from '@/utils/axios.interceptor';

async function getAllByBuyerId({ buyer_id, status }: { buyer_id: string; status: string }): Promise<ISaleBill[]> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/sale-bill/get-all-by-buyer-id`, {
        params: { buyer_id, status },
    });
    return res.data;
}

async function getAllBySellerId({
    page_number = 1,
    page_size = 10,
    seller_id,
    status,
}: {
    page_number?: number;
    page_size?: number;
    seller_id: string;
    status: string;
}) : Promise<ResponseData<ISaleBill[]>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/sale-bill/get-all-by-seller-id`, {
        params: { page_number, page_size, seller_id, status },
    });
    return res.data;
}

interface IBillDetailsData {
    product_detail_id: string;
    quantity: number;
    size: string;
    color: string;
}

interface IVoucherData {
    voucher_id: string;
}
export interface ICreateBillPayload {
    seller_id: string;
    total_bill: number;
    pay_method: string;
    list_bill_detail: IBillDetailsData[];
    list_voucher?: IVoucherData[];
    address_delivery_id: string;
    list_order_item: string[];
}

async function create(data: ICreateBillPayload) {
    const res = await axiosJWT.post(`/sale-bill/create`, data);
    return res.data;
}

async function updateStatus({ id, status }: { id: string; status: string }) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/sale-bill/update-status`, { id, status });
    return res.data;
}

export const billService = {
    getAllByBuyerId,
    getAllBySellerId,
    create,
    updateStatus,
};
