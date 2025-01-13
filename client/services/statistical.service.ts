import axiosJWT from '@/utils/axios.interceptor';

interface IStatisticalBySeller {
    mode: 'day' | 'week' | 'month' | 'year' | 'range';
    seller_id: string;
}
async function bySeller(query: IStatisticalBySeller) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/statistical/by-seller`, {
        params: query,
    });
    return res.data;
}


async function getTotalBySeller(id: string) {
    const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/statistical/total-by-seller/${id}`);
    return res.data;
}


export const statisticalService = {
    bySeller,
    getTotalBySeller,
};
