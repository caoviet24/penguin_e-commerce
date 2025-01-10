import { IProduct, ResponseData } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";


async function getProductPagination(page_number: number, page_size: number) : Promise<ResponseData<IProduct>> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/list-product`, {
        params: {
            page_number,
            page_size
        }
    });
    return res.data;
}

async function getProductById(id: string) : Promise<IProduct> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product/get-by-id/${id}`);
    return res.data;
}


export const productService = {
    getProductPagination,
    getProductById
}
