import { IDeliveryAddress } from "@/types";
import axiosJWT from "@/utils/axios.interceptor";


async function getByUserId(userId: string) : Promise<IDeliveryAddress[]> {
    const res = await axiosJWT.get(`/delivery-address/get-by-user-id/${userId}`);
    return res.data; 
}

export interface ICreateDeliveryAddressPayload {
    address: string;
    phone: string;
    full_name: string;
}

async function create(data: ICreateDeliveryAddressPayload) {
    const res = await axiosJWT.post(`/delivery-address/create`, data);
    return res.data; 
}


export interface IUpdateDeliveryAddressPayload {
    id: string;
    address: string;
    phone: string;
    full_name: string;
}

async function update(data: IUpdateDeliveryAddressPayload) {
    const res = await axiosJWT.put(`/delivery-address/update`, data);
    return res.data; 
}

async function remove(id: string) {
    const res = await axiosJWT.delete(`/delivery-address/delete/${id}`);
    return res.data; 
}

export const deliveryAddressService = {
    getByUserId,
    create,
    update,
    remove
};