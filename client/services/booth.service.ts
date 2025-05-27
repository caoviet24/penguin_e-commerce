import { IBooth, ResponseData } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";
import delay from "@/utils/delay";

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



async function getByAccId(id: string) : Promise<IBooth> {
    const res = await axiosJWT.get(`/booth/get-by-acc-id/${id}`);
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

async function update(id: string, data: Partial<IBooth>): Promise<IBooth> {
    await delay(2000);
    const res = await axiosJWT.put(`/booth/update/${id}`, data);
    return res.data;
}

export const boothService = {
    getAll,
    getByAccId,
    getById,
    create,
    update
}