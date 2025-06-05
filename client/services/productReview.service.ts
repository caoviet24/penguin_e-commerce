import { IProductReview, ResponseData } from '@/types';
import axiosJWT from '@/utils/axios.interceptor';

async function getByProductId({
    product_id,
    page_size,
    page_number,
}: {
    product_id: string;
    page_size?: number;
    page_number?: number;
}): Promise<ResponseData<IProductReview>> {
    const res = await axiosJWT.get(`/product-review/get-by-product-id`, {
        params: {
            product_id,
            page_size,
            page_number,
        },
    });
    return res.data;
}

export interface ICreateProductReviewPayload {
    bill_id: string; 
    comment: string;
    rating: number;
    product_id: string;
    review_medias: ICreateReviewMedia[];
}

export interface ICreateReviewMedia {
    media_type: string; // 'image' | 'video'
    media_url: string;
}

async function create(data: ICreateProductReviewPayload) {
    const res = await axiosJWT.post(`/product-review/create`, data);
    return res.data;
}

async function deleteReview(id: string) {
    const res = await axiosJWT.delete(`/product-review/delete/${id}`);
    return res.data;
}

export const productReviewService = {
    getByProductId,
    create,
    deleteReview,
};
