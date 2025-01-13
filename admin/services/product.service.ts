import { IProduct, ResponseData } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";

async function getActive(query: any) : Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-active`, {
        params: query
    });
    return res.data;
}

async function getInActive(query: any) : Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-inactive`, {
        params: query
    });
    return res.data;
}

async function getDeleted(query: any) : Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-deleted`, {
        params: query
    });
    return res.data;
}

async function getByDesc(query: any) : Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-by-desc`, {
        params: query
    });
    return res.data;
}


async function getById(id: string) : Promise<IProduct> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-by-id/${id}`);
    return res.data;
}


async function create(data: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/product/create`, data);
    return res.data;
}

async function active(id: string) : Promise<IProduct> {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/product/active/${id}`);
    return res.data;
}


async function inActive(id: string) : Promise<IProduct> {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/product/inactive/${id}`);
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
    getActive,
    getInActive,
    getDeleted,
    getByDesc,
    getById,
    create,
    active,
    inActive,
    deleteSoft,
    restore
}
