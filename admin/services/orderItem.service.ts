import axiosJWT from "@/utils/axios.interceptor";

async function getOrderItemByUserId(userId: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/order-item/get-by-buyer-id`, {
        params: {
            buyer_id: userId
        }
    });
    return res.data; 
}

async function addToCart(data: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/order-item/create`, data);
    return res.data; 
}

async function deleteOrderItem(orderItemId: string) {
    const res = await axiosJWT.delete(`${process.env.NEXT_PUBLIC_API_URL}/order-item/delete/${orderItemId}`);
    return res.data; 
}


export const orderItemService = {
    getOrderItemByUserId,
    addToCart,
    deleteOrderItem
}
