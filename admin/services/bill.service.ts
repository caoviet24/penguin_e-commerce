import axiosJWT from "@/utils/axios.interceptor";



async function getStatusWaitByBuyerId(data: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/sale-bill/get-status-wait-by-buyer-id`, {
        params: data
    });
    return res.data; 
}


async function createBill(data: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/sale-bill/create`, data);
    return res.data; 
}

export const billService = {
    createBill,
    getStatusWaitByBuyerId
}