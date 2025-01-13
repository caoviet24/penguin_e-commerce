import axiosJWT from "@/utils/axios.interceptor";

async function getWithPagination(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/account/get-with-pagination`, { params: query });
    return res.data;
}

async function getBanned(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/account/get-banned`, { params: query });
    return res.data;
}

async function getDeleted(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/account/get-deleted`, { params: query });
    return res.data;
}

async function getById(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/account/get-by-id/${id}`);
    return res.data; 
}

async function deleteById(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/account/delete/${id}`);
    return res.data;
}


async function updateById(data: any) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/account/update`, data);
    return res.data;
}

async function restoreById(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/account/restore/${id}`);
    return res.data;
}

async function banById(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/account/ban/${id}`);
    return res.data;
}


async function unBanById(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/account/unban/${id}`);
    return res.data;
}



export const accountService = {
    getWithPagination,
    getBanned,
    getDeleted,
    getById,
    deleteById,
    updateById,
    restoreById,
    banById,
    unBanById
}