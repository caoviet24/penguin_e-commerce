import axiosJWT from "@/utils/axios.interceptor";

async function getStatusWaitByBuyerId(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/sale-bill/get-by-buyer-id-and-status`, {
        params: query
    });
    return res.data; 
}

async function getStatusWaitBySellerId(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/sale-bill/get-by-seller-id-and-status`, {
        params: query
    });
    return res.data; 
}

async function createBill(data: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/sale-bill/create`, data);
    return res.data; 
}

async function updateStatus(data: any) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/sale-bill/update-status`, data);
    return res.data; 
}


export const billService = {
    getStatusWaitByBuyerId,
    getStatusWaitBySellerId,
    createBill,
    updateStatus
}