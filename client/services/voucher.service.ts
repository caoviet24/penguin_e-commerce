import axiosJWT from "@/utils/axios.interceptor";

async function getAllActive(page_number: number, page_size: number) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/voucher/get-active`, {
        params: {
            page_number,
            page_size
        }
    });
    return res.data;
}

export const voucherService = {
    getAllActive
}