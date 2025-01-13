import axiosJWT from "@/utils/axios.interceptor";


async function create(data: any) {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/product-detail/create`, data);
    return res.data; 
}

async function update(data: any) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/product-detail/update`, data);
    return res.data; 
}

async function updateQuantity(data: any) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product-detail/update-quantity`, data);
    return res.data; 
}

async function deleteSoft(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/product-detail/delete-soft/${id}`);
    return res.data; 
}

async function restore(id: string) {
    const res = await axiosJWT.put(`${process.env.NEXT_PUBLIC_API_URL}/product-detail/restore/${id}`);
    return res.data; 
}


export const productDetailService = {
    create,
    update,
    updateQuantity,
    deleteSoft,
    restore
}