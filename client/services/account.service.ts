import axiosJWT from "@/utils/axios.interceptor";
import { IUser } from "@/types";

async function getById(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/account/get-by-id/${id}`);
    return res.data;
}

async function updateUserProfile(userId: string, userData: Partial<IUser>) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/account/update-profile/${userId}`, userData);
    return res.data;
}

export const accountService = {
    getById,
    updateUserProfile
}