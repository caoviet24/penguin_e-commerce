import axiosJWT from "@/utils/axios.interceptor";

async function getByCgId(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/category-detail/get-by-category-id/${id}`);
    return res.data;
}

async function create(data: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/category-detail/create`, data);
    return res.data;
}

async function delete2ById(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/category-detail/delete-2/${id}`);
    return res.data;
}

async function restore(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/category-detail/restore/${id}`);
    return res.data;
}

async function deleteById(id: string) {
    const res = await axiosJWT.delete(`${process.env.NEXT_PUBLIC_API_URL}/category-detail/delete/${id}`);
    return res.data;
}



export const categoryDetailService = {
    getByCgId,
    create,
    delete2ById,
    deleteById,
    restore
}