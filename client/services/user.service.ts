import { User, ResponseUserData} from "@/types";
import axiosJWT from "@/utils/axios.interceptor";


const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const getUserWithPagination = async (page: number, limit: number): Promise<ResponseUserData> => {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/get-accounts`, {
        params: {
            page,
            limit
        }
    });
    return res.data;
}


async function getUserById(acc_id: string): Promise<User> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/get-by-id/${acc_id}`);
    return res.data;
}

async function getUserOnline(): Promise<any> {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/get-online`);
    return res.data;
}


async function editUser(acc_id: string, data: User): Promise<User> {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/accounts/update/${acc_id}`, data);
    return res.data;
}

async function deleteUser(acc_id: string): Promise<User> {
    const res = await axiosJWT.delete(`${process.env.NEXT_PUBLIC_API_URL}/accounts/delete-by-id/${acc_id}`);
    return res.data;
}




export const userService = {
    getUserWithPagination,
    getUserOnline,
    getUserById,
    editUser,
    deleteUser,
}
