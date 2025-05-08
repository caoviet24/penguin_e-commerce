import axiosJWT from "@/utils/axios.interceptor"


export interface PaymentPayLoad {
    amount: number
    description: string
};

export const paymentService = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async create(data: PaymentPayLoad) {
        const res = await axiosJWT.post(`${process.env.NEXT_PUBLIC_API_URL}/payment/create`, data)
        return res.data
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getCallBack(data : any) {
        const res = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_URL}/payment/callback`, {
            params: data
        })

        console.log('payment',data);
        
        return res.data
    },
}