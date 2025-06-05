import axiosJWT from "@/utils/axios.interceptor";

export interface ICreateProductDetailPayload {
    product_id?: string;
    product_name: string;
    image: string;
    sale_price: number;
    promotional_price: number;
    stock_quantity: number;
    color: string;
    sizes: string[];
}

async function create(data: ICreateProductDetailPayload) {
    const res = await axiosJWT.post(`/product-detail/create`, data);
    return res.data;
}

export interface IUpdateProductDetailPayload {
    id: string,
    product_name: string,
    image: string,
    sale_price: number,
    promotional_price: number,
    stock_quantity: number,
    color: string,
    sizes: string[]
}
async function update(data: IUpdateProductDetailPayload) {
    const res = await axiosJWT.put(`/product-detail/update`, data);
    return res.data;
}


async function deleteSoft(id: string) {
    const res = await axiosJWT.put(`/product-detail/delete-soft/${id}`);
    return res.data;
}

async function restore(id: string) {
    const res = await axiosJWT.put(`/product-detail/restore/${id}`);
    return res.data;
}

export const productDetailService = {
    create,
    update,
    deleteSoft,
    restore,
};
