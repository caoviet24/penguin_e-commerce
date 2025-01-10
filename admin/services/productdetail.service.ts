import axiosJWT from "@/utils/axios.interceptor";


async function getProductDetailById(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/product-detail/get-by-id/${id}`);
    return res.data;
    
}