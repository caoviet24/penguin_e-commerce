import axiosJWT from '@/utils/axios.interceptor';

async function getByName(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/booth/get-by-name`, {
        params: query,
    });
    return res.data;
}


async function getDeleted(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/booth/get-deleted`, {
        params: query,
    });
    return res.data;
}

async function getActiving(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/booth/get-activing`, {
        params: query,
    });
    return res.data;
}

async function getActive(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/booth/get-active`, {
        params: query,
    });
    return res.data;
}

async function getInActive(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/booth/get-inactive`, {
        params: query,
    });
    return res.data;
}

async function getBanned(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/booth/get-banned`, {
        params: query,
    });
    return res.data;
}

async function getById(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/booth/get-by-id/${id}`);
    return res.data;
}

async function create(data: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/booth/create`, data);
    return res.data;
}

async function deleteById(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/booth/delete/${id}`);
    return res.data;
}

async function restore(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/booth/restore/${id}`);
    return res.data;
}

async function update(data: any) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/booth/update`, data);
    return res.data;
}

async function active(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/booth/active/${id}`);
    return res.data;
}

async function ban(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/booth/ban/${id}`);
    return res.data;
}

async function unban(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/booth/unban/${id}`);
    return res.data;
}

export const boothService = {
    getByName,
    getDeleted,
    getActiving,
    getActive,
    getInActive,
    getBanned,
    getById,
    create,
    deleteById,
    restore,
    update,
    active,
    ban,
    unban,
};
