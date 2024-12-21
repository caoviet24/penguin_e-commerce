import { ResponseVideoData, StatisticalData2, Video } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";



const getStatisticalVideo = async (start_day: string, end_day: string): Promise<StatisticalData2> => {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/videos/get-statistical`, {
        params: {
            start_day,
            end_day
        }
    });
    return res.data;
}

const getVideoWithPagination = async (page: number, limit: number): Promise<ResponseVideoData> => {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/videos/get-video-pagination`, {
        params: {
            page,
            limit
        }
    });
    return res.data;
}
const getVideoById = async (video_id: string): Promise<Video> => {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/videos/get-by-id/${video_id}`);
    return res.data;
}

async function createVideo(data: any) : Promise<any> {
    const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/videos/create`, data);
    return res.data;
}

const deleteVideoById = async (video_id: string): Promise<Video> => {
    const res = await axiosJWT.delete(`${process.env.NEXT_PUBLIC_API_URL}/videos/delete/${video_id}`);
    return res.data;
}



export const videoService = {
    getStatisticalVideo,
    getVideoById,
    getVideoWithPagination,
    createVideo,
    deleteVideoById
}