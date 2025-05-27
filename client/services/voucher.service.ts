import { IVoucher } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";

async function getAll() : Promise<IVoucher[]> {
    const res = await axiosJWT.get(`/voucher/get-all`);
    return res.data;
}

export const voucherService = {
    getAll,
}