import { IProduct, ResponseData } from '@/types';
import axiosJWT from '@/utils/axios.interceptor';

async function getAll({
    page_number = 1,
    page_size = 10,
    search = undefined,
    booth_id = undefined,
    category_detail_id = undefined,
    status = undefined,
    is_active = true,
    is_deleted = false,
    min_price = -1,
    max_price = -1,
}: {
    page_number: number;
    page_size: number;
    search?: string;
    booth_id?: string;
    category_detail_id?: string;
    status?: string;
    is_active?: boolean;
    is_deleted?: boolean;
    min_price?: number | undefined;
    max_price?: number | undefined;
}): Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`/product/get-all`, {
        params: {
            page_number,
            page_size,
            search: search || undefined,
            status: status || undefined,
            is_active: is_active || undefined,
            is_deleted: is_deleted || undefined,
            booth_id: booth_id || undefined,
            category_detail_id: category_detail_id || undefined,
            min_price: min_price > 0 ? min_price : undefined,
            max_price: max_price > 0 ? max_price : undefined,
        },
    });
    return res.data;
}

async function getById(id: string): Promise<IProduct> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-by-id/${id}`);
    return res.data;
}

export interface ICreateProductPayload {
    booth_id: string;
    product_desc: string;
    category_detail_id: string;
    list_product_detail: [
        {
            product_name: string;
            image: string;
            sale_price: number;
            promotional_price: number;
            stock_quantity: number;
            color: string;
            sizes: string[]; 
        },
    ];
}

async function create(payload: ICreateProductPayload) {
    const res = await axiosJWT.post(`/product/create`, payload);
    return res.data;
}

async function deleteSoft(id: string): Promise<IProduct> {
    const res = await axiosJWT.put(`/product/delete-soft/${id}`);
    return res.data;
}

async function restore(id: string): Promise<IProduct> {
    const res = await axiosJWT.put(`/product/restore/${id}`);
    return res.data;
}

export const productService = {
    getAll,
    getById,
    create,
    deleteSoft,
    restore,
};
