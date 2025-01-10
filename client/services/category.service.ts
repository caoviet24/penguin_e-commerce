import axiosJWT from '@/utils/axios.interceptor';

async function getWithPagination(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get-all`, {
        params: query,
    });
    return res.data;
}

async function getByName(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get-by-name`, {
        params: query,
    });
    return res.data;
}

async function getById(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get-by-id/${id}`);
    return res.data;
}


export const categoryService = {
    getWithPagination,
    getByName,
    getById,
};
