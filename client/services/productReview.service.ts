import axiosJWT from "@/utils/axios.interceptor";


async function getByProductId(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product-review/get-by-product-id/${id}`);
    return res.data;
}

async function create(data: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/product-review/create`, data);
    return res.data;
}

export const productReviewService = {
    getByProductId,
    create
}