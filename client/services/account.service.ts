import { Account, ResponseAccountData, StatisticalData2 } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";
import axios from "axios";


const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const getAccountWithPagination = async (page: number, limit: number): Promise<ResponseAccountData> => {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/get-accounts`, {
        params: {
            page,
            limit
        }
    });
    return res.data;
}



const getStatisticalAccount = async (start_day: string, end_day: string): Promise<StatisticalData2> => {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/get-statistical`, {
        params: {
            start_day,
            end_day
        }
    });
    return res.data;
}

async function getAccountById(acc_id: string): Promise<Account> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/get-by-id/${acc_id}`);
    return res.data;
}

async function getAccountOnline(): Promise<any> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/get-online`);
    return res.data;
}

async function createAccount(data: any): Promise<any> {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/accounts/register`, data);
    return res.data;
}

async function editAccount(acc_id: string, data: Account): Promise<Account> {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/accounts/update/${acc_id}`, data);
    return res.data;
}

async function deleteAccount(acc_id: string): Promise<Account> {
    const res = await axiosJWT.delete(`${process.env.NEXT_PUBLIC_API_URL}/accounts/delete-by-id/${acc_id}`);
    return res.data;
}




export const accountService = {
    getAccountWithPagination,
    getStatisticalAccount,
    getAccountOnline,
    getAccountById,
    createAccount,
    editAccount,
    deleteAccount,
}
