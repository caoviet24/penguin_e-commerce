import axiosJWT from '@/utils/axios.interceptor';

async function getWithPagination(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get-all`, {
        params: query,
    });
    return res.data;
}
async function getDeleted(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/category/get-deleted`, {
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

async function create(data: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/category/create`, data);
    return res.data;
}

async function update(data: any) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/category/update`, data);
    return res.data;
}


async function deleteById(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/category/delete/${id}`);
    return res.data;
}

async function restoreById(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/category/restore/${id}`);
    return res.data;
}

export const categoryService = {
    getWithPagination,
    getDeleted,
    getByName,
    getById,
    create,
    update,
    deleteById,
    restoreById,
};
