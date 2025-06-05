import { IOverView, IStatisticalData, StatisticalDto } from '@/types';
import axiosJWT from '@/utils/axios.interceptor';

interface IStatisticalByUser {
    seller_id: string;
    period: string; // today, week, month, year, custom
    start_date?: string;
    end_date?: string;
}

export const statisticalBySellerService = {
    getOverView: async (seller_id: string): Promise<IOverView> => {
        const response = await axiosJWT.get(`/statistical/overview-seller/${seller_id}`);
        return response.data;
    },

    getStatistical: async (data: IStatisticalByUser): Promise<StatisticalDto[]> => {
        const response = await axiosJWT.get('/statistical/statistics-by-seller', { params: data });
        return response.data;
    },

    getStatisticalData: async (seller_id: string, period: string = 'week'): Promise<IStatisticalData[]> => {
        const response = await axiosJWT.get(`/statistical/data-seller/${seller_id}?period=${period}`);
        return response.data;
    }
};


export const statisticalByAdminService = {
    getOverView: async (): Promise<IOverView> => {
        const response = await axiosJWT.get('/statistical/overview-admin');
        return response.data;
    }
}