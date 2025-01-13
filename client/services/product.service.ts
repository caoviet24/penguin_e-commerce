import { IProduct, ResponseData } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";


async function getPagination(page_number: number, page_size: number) : Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-active`, {
        params: {
            page_number,
            page_size
        }
    });
    return res.data;
}

async function getActiveByBoothId(query: any) : Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-active-by-booth-id`, {
        params: query
    });
    return res.data;
}

async function getInActiveByBoothId(query: any) : Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-inactive-by-booth-id`, {
        params: query
    });
    return res.data;
}

async function getDeletedByBoothId(query: any) : Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-deleted-by-booth-id`, {
        params: query
    });
    return res.data;
}

async function getById(id: string) : Promise<IProduct> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-by-id/${id}`);
    return res.data;
}


async function getByDesc(query: any) : Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-by-desc`, {
        params: query
    });
    return res.data;
}



async function create(payload: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/product/create`, payload);
    return res.data;
}

async function deleteSoft(id: string) : Promise<IProduct> {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/product/delete-soft/${id}`);
    return res.data;
}

async function restore(id: string) : Promise<IProduct> {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/product/restore/${id}`);
    return res.data;
}



export const productService = {
    getPagination,
    getActiveByBoothId,
    getInActiveByBoothId,
    getDeletedByBoothId,
    getByDesc,
    getById,
    create,
    deleteSoft,
    restore
}
