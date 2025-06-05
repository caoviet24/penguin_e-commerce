import { ICategory, ResponseData } from '@/types';
import axiosJWT from '@/utils/axios.interceptor';
import delay from '@/utils/delay';

async function getAll({
    search,
    is_deleted ,
}: {
    search?: string;
    is_deleted?: boolean;
}): Promise<ICategory[]> {
    const res = await axiosJWT.get(`/category/get-all`, {
        params: {
            search,
            is_deleted,
        },
    });
    return res.data;
}

async function getWithPagination({
    page_number,
    page_size,
    search,
    is_deleted,
}: {
    page_number?: number;
    page_size?: number;
    search?: string;
    is_deleted?: boolean;
}): Promise<ResponseData<ICategory[]>> {
    const res = await axiosJWT.get(`/category/get-with-pagination`, {
        params: {
            page_number,
            page_size,
            search,
            is_deleted,
        },
    });
    return res.data;
}


async function getById(id: string): Promise<ICategory> {
    const res = await axiosJWT.get(`/category/get-by-id/${id}`);
    return res.data;
}

async function create(data: Partial<ICategory>) {
    await delay(1000);
    const res = await axiosJWT.post(`/category/create`, data);
    return res.data;
}

async function update(id: string, data: Partial<ICategory>): Promise<ICategory> {
    await delay(1000);
    const res = await axiosJWT.put(`/category/update/${id}`, data);
    return res.data;
}

async function deleteCategory(id: string) {
    const res = await axiosJWT.delete(`/category/delete/${id}`);
    return res.data;
}

async function restoreCategory(id: string) {
    const res = await axiosJWT.put(`/category/restore/${id}`);
    return res.data;
}

export const categoryService = {
    getAll,
    getWithPagination,
    getById,
    create,
    update,
    deleteCategory,
    restoreCategory,
};
