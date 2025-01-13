import axiosJWT from '@/utils/axios.interceptor';

async function getActive(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/voucher/get-active`, {
        params: query,
    });
    return res.data;
}

async function getInActive(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/voucher/get-inactive`, {
        params: query,
    });
    return res.data;
}

async function getDeleted(query: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/voucher/get-deleted`, {
        params: query,
    });
    return res.data;
}

async function create(data: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/voucher/create`, data);
    return res.data;
}

async function update(data: any) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/voucher/update`, data);
    return res.data;
}



async function active(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/voucher/active/${id}`);
    return res.data;
}
async function inActive(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/voucher/inactive${id}`);
    return res.data;
}

async function deleteSoft(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/voucher/delete-soft/${id}`);
    return res.data;
}

async function restore(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/voucher/restore/${id}`);
    return res.data;
}

export const voucherService = {
    getActive,
    getInActive,
    getDeleted,
    create,
    update,
    active,
    inActive,
    deleteSoft,
    restore,
};
