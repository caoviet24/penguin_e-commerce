import { IBooth, ResponseData } from '@/types';
import axiosJWT from '@/utils/axios.interceptor';

async function getAll({
    page_number,
    page_size,
    search,
    is_active,
    is_deleted,
    is_banned,
}: {
    page_number?: number;
    page_size?: number;
    search?: string;
    is_active?: boolean;
    is_deleted?: boolean;
    is_banned?: boolean;
}): Promise<ResponseData<IBooth[]>> {
    const res = await axiosJWT.get(`/booth/get-all`, {
        params: {
            page_number,
            page_size,
            search,
            is_active,
            is_deleted,
            is_banned,
        },
    });
    return res.data;
}

async function getByAccId(id: string): Promise<IBooth> {
    const res = await axiosJWT.get(`/booth/get-by-user-id/${id}`);
    return res.data;
}

async function getById(id: string): Promise<IBooth> {
    const res = await axiosJWT.get(`/booth/get-by-id/${id}`);
    return res.data;
}

export interface ICreateBoothPayload {
    name: string;
    description: string;
    avatar: string;
}

async function create(data: ICreateBoothPayload): Promise<IBooth> {
    const res = await axiosJWT.post(`/booth/create`, data);
    return res.data;
}

export interface IUpdateBoothPayload {
    id: string;
    name?: string;
    description?: string;
    avatar?: string;
}
async function update(data: IUpdateBoothPayload): Promise<IBooth> {
    const res = await axiosJWT.put(`/booth/update`, data);
    return res.data;
}

async function active(id: string): Promise<IBooth> {
    const res = await axiosJWT.put(`/booth/active/${id}`);
    return res.data;
}

async function inactive(id: string): Promise<IBooth> {
    const res = await axiosJWT.put(`/booth/inactive/${id}`);
    return res.data;
}

async function ban(id: string): Promise<IBooth> {
    const res = await axiosJWT.put(`/booth/ban/${id}`);
    return res.data;
}

async function unban(id: string): Promise<IBooth> {
    const res = await axiosJWT.put(`/booth/unban/${id}`);
    return res.data;
}

async function deleteSoft(id: string): Promise<IBooth> {
    const res = await axiosJWT.put(`/booth/delete/${id}`);
    return res.data;
}

async function restore(id: string): Promise<IBooth> {
    const res = await axiosJWT.put(`/booth/restore/${id}`);
    return res.data;
}

export const boothService = {
    getAll,
    getByAccId,
    getById,
    create,
    update,
    active,
    inactive,
    ban,
    unban,
    deleteSoft,
    restore,
};
