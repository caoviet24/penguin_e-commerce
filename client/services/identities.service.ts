import { IAccount } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";
import delay from "@/utils/delay";
import axios from "axios";


async function authMe() : Promise<IAccount> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);
    return res.data;
}

async function login(username: string, password: string) {
    await delay(2000);
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/account/login`, {
        username,
        password
    });
    return res.data;
}



async function register(username: string, password: string) {
    await delay(2000);
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/account/register`, {
        username,
        password
    });
    return res.data;
}

export const identityService = {
    login,
    register,
    authMe
}



