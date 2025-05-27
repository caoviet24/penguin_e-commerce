
"use client"

import useHookMutation from '@/hooks/useHookMutation';
import { voucherService } from '@/services/voucher.service';
import { IVoucher } from '@/types';
import React, { useState } from 'react'
import { BiPlusMedical } from 'react-icons/bi';

interface IProps {
    onSuccess: (data: IVoucher) => void,
    onClose: () => void
}

interface IPayLoad {
    voucher_type: string;
    voucher_name: string;
    apply_for: string;
    after_expiry_date: number;
    option_expiry_date: string;
    quantity_remain: number;
    discount: number;
    type_discount: string;
}


export default function CreateVoucher({ onSuccess, onClose }: IProps) {

    const [payLoad, setPayLoad] = useState<IPayLoad>({
        voucher_type: '',
        voucher_name: '',
        apply_for: '',
        after_expiry_date: 0,
        option_expiry_date: '',
        quantity_remain: 0,
        discount: 0,
        type_discount: ''
    });

    const handleOnChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setPayLoad((prevPayLoad) => ({
            ...prevPayLoad,
            [name]: value
        }));
    };


    const createVoucherMutation = useHookMutation((data: any) => {
        return voucherService.create(data);
    });

    const handleCreateVoucher = () => {
        createVoucherMutation.mutate(payLoad, {
            onSuccess: (data) => {
                onSuccess(data);
            }
        });
    }


    return (
        <div className='w-[600px] p-5 rounded-lg bg-white'>
            <p className='text-2xl pb-3'>Voucher</p>
            <div className='flex flex-col gap-5'>
                <select
                    value={payLoad.voucher_type || 'freeship'}
                    onChange={(e) => setPayLoad({ ...payLoad, voucher_type: e.target.value })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="freeship">Miễn phí giao hàng</option>
                    <option value="discount">Giảm giá</option>
                </select>
                <div className='flex justify-center items-center gap-5'>
                    <div className='flex-1'>
                        <label htmlFor="voucher_name" className="block mb-2 text-sm font-medium text-gray-900 ">Tên phiếu giảm giá</label>
                        <input
                            type="text"
                            id="voucher_name"
                            name='voucher_name'
                            value={payLoad.voucher_name}
                            placeholder='Aa..'
                            onChange={handleOnChangeValue}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>
                    <div className='flex-1'>
                        <label htmlFor="category_name" className="block mb-2 text-sm font-medium text-gray-900 ">Áp dụng</label>
                        <select
                            value={payLoad.apply_for || 'all'}
                            onChange={(e) => setPayLoad({ ...payLoad, apply_for: e.target.value })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="all">Tất cả</option>
                            <option value="shop">Cửa hàng</option>
                            <option value="category">Danh mục</option>
                            <option value="product">Sản phẩm</option>
                            <option value="account">Tài khoản</option>
                        </select>
                    </div>
                </div>

                <div className='flex justify-center items-center gap-5'>
                    <div className='flex-1'>
                        <label htmlFor="after_expiry_date" className="block mb-2 text-sm font-medium text-gray-900 ">Thời hạn</label>
                        <input
                            type="number"
                            id="after_expiry_date"
                            name='after_expiry_date'
                            value={payLoad.after_expiry_date}
                            onChange={handleOnChangeValue}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>
                    <div className='flex-1'>
                        <label htmlFor="category_name" className="block mb-2 text-sm font-medium text-gray-900 ">Loại thời hạn</label>
                        <select
                            value={payLoad.option_expiry_date}
                            onChange={(e) => setPayLoad({ ...payLoad, option_expiry_date: e.target.value })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="hour">Giờ</option>
                            <option value="day">Ngày</option>
                            <option value="week">Tuần</option>
                            <option value="month">Tháng</option>
                            <option>Tự chọn</option>
                        </select>
                    </div>
                </div>

                <div className='flex justify-center items-center gap-5'>
                    <div className='flex-1'>
                        <label htmlFor="discount" className="block mb-2 text-sm font-medium text-gray-900 ">Giảm giá</label>
                        <input
                            type="number"
                            id="discount"
                            name='discount'
                            value={payLoad.discount}
                            onChange={handleOnChangeValue}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>
                    <div className='flex-1'>
                        <label htmlFor="category_name" className="block mb-2 text-sm font-medium text-gray-900 ">Loại giảm giá</label>
                        <select
                            value={payLoad.type_discount || 'percent'}
                            onChange={(e) => setPayLoad({ ...payLoad, type_discount: e.target.value })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="percent">%</option>
                            <option value="amount">VNĐ</option>
                        </select>
                    </div>
                </div>
            </div>



            <div className='flex justify-end'>
                <button onClick={handleCreateVoucher} className='bg-blue-500 text-white rounded-lg px-5 py-2 mt-5 flex items-center gap-2 hover:bg-blue-300'>
                    <BiPlusMedical />
                    Thêm
                </button>
            </div>

        </div>
    )
}
