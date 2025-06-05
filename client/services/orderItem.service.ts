import { IOrderItem } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";

async function getByUserId(userId: string) : Promise<IOrderItem[]> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/order-item/get-by-user-id/${userId}`);
    return res.data; 
}

export interface ICreateOrderItemPayload {
    booth_id: string;
    product_detail_id: string;
    quantity: number;
    size: string;
    color: string;
}

async function addToCart(data: ICreateOrderItemPayload) {
    const res = await axiosJWT.post(`/order-item/create`, data);
    return res.data; 
}

async function remove(orderItemId: string) {
    const res = await axiosJWT.delete(`${process.env.NEXT_PUBLIC_API_URL}/order-item/delete/${orderItemId}`);
    return res.data; 
}


export const orderItemService = {
    getByUserId,
    addToCart,
    remove
}
