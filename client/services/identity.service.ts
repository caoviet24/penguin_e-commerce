import axios from "axios";



async function login(username: string, password: string) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/accounts/login`, {
        username,
        password
    });
    return res.data;
}

export const identityService = {
    login,
}



