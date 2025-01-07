import axiosJWT from "@/utils/axios.interceptor";

async function getById(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/account/get-by-id/${id}`);
    return res.data; 
}


export const accountService = {
    getById
}