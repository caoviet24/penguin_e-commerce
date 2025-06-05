import axiosJWT from '@/utils/axios.interceptor';

async function getByBillId(bill_id: string) {
    const res = await axiosJWT.get(`/back-bill/get-by-bill-id/${bill_id}`);
    return res.data;
}

export interface ICreateBackBillPayload {
    bill_id: string;
    reason_back: string;
    video: string;
    image: string;
    booth_id: string;
}

async function create(data: ICreateBackBillPayload) {
    const res = await axiosJWT.post(`/back-bill/create`, data);
    return res.data;
}

export interface IUpdateBackBillPayload {
    id: string;
    reason_back?: string;
    video?: string;
    image?: string;
    reply_content?: string;
    reply_image?: string;
    reply_video?: string;
}

async function update(data: IUpdateBackBillPayload) {
    const res = await axiosJWT.put(`/back-bill/update`, data);
    return res.data;
}

export const backBillService = {
    getByBillId,
    create,
    update,
};
