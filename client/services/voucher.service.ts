import { IVoucher, ResponseData } from '@/types';
import axiosJWT from '@/utils/axios.interceptor';

async function getAll(): Promise<IVoucher[]> {
    const res = await axiosJWT.get(`/voucher/get-all`);
    return res.data;
}

async function getWithPagination({
    page_number,
    page_size,
    search,
    type,
    status,
    is_deleted,
}: {
    page_number: number;
    page_size: number;
    search?: string;
    type?: string;
    status?: string;
    is_deleted?: boolean;
}): Promise<ResponseData<IVoucher[]>> {
    const res = await axiosJWT.get(`/voucher/get-with-pagination`, {
        params: {
            page_number,
            page_size,
            search,
            type,
            status,
            is_deleted,
        },
    });
    return res.data;
}

async function getById(id: string): Promise<IVoucher> {
    const res = await axiosJWT.get(`/voucher/get-by-id/${id}`);
    return res.data;
}

async function create(data: Partial<IVoucher>): Promise<IVoucher> {
    const res = await axiosJWT.post(`/voucher/create`, data);
    return res.data;
}

async function update( data: Partial<IVoucher>): Promise<IVoucher> {
    const res = await axiosJWT.put(`/voucher/update/${data.id}`, data);
    return res.data;
}

async function deleteSoft(id: string): Promise<IVoucher> {
    const res = await axiosJWT.put(`/voucher/delete-soft/${id}`);
    return res.data;
}

async function restore(id: string): Promise<IVoucher> {
    const res = await axiosJWT.put(`/voucher/restore/${id}`);
    return res.data;
}

export const voucherService = {
    getAll,
    getWithPagination,
    getById,
    create,
    update,
    deleteSoft,
    restore,
};
