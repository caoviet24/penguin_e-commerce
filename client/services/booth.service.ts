import axiosJWT from "@/utils/axios.interceptor";
import delay from "@/utils/delay";

async function getByAccId(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/booth/get-by-acc-id/${id}`);
    return res.data;
}

async function getById(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/booth/get-by-id/${id}`);
    return res.data;
}

async function create(data: any) {
    await delay(2000);
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/booth/create`, data);
    return res.data;   
}

async function update(data: any) {
    await delay(2000);
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/booth/update`, data);
    return res.data;
}

export const boothService = {
    getByAccId,
    getById,
    create,
    update
}