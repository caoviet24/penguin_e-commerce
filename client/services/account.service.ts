import { IAccount, ResponseData } from '@/types';
import axiosJWT from '@/utils/axios.interceptor';

async function getAll({
    page_number,
    page_size,
    search,
    role,
    is_deleted,
    is_banned,
}: {
    page_number?: number;
    page_size?: number;
    search?: string;
    role?: string;
    is_deleted?: boolean;
    is_banned?: boolean;
}): Promise<ResponseData<IAccount[]>> {
    const res = await axiosJWT.get(`/account/get-all`, {
        params: {
            page_number,
            page_size,
            search,
            role,
            is_deleted,
            is_banned,
        },
    });
    return res.data;
}

async function getById(id: string): Promise<IAccount> {
    const res = await axiosJWT.get(`/account/get-by-id/${id}`);
    return res.data;
}

async function updateAccount(id: string, data: Partial<IAccount>): Promise<IAccount> {
    const res = await axiosJWT.put(`/account/update/${id}`, data);
    return res.data;
}

export const accountService = {
    getAll,
    getById,
    updateAccount,
};
