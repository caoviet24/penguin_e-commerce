import { Post, ResponsePostData, StatisticalData2 } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";



const getStatisticalPost = async (start_day: string, end_day: string): Promise<StatisticalData2> => {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/get-statistical`, {
        params: {
            start_day,
            end_day
        }
    });
    return res.data;
}

const getPostWithPagination = async (page: number, limit: number): Promise<ResponsePostData> => {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/get-post-pagination`, {
        params: {
            page,
            limit
        }
    });
    return res.data;
}

const getPostById = async (post_id: string): Promise<Post> => {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/get-by-id/${post_id}`);
    return res.data;
}

async function createPost(data: any): Promise<any> {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/posts/create`, data);
    return res.data;
}

const deletePostById = async (post_id: string): Promise<Post> => {
    const res = await axiosJWT.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/delete/${post_id}`);
    return res.data;
}



export const postService = {
    getStatisticalPost,
    getPostById,
    getPostWithPagination,
    deletePostById,
    createPost
}