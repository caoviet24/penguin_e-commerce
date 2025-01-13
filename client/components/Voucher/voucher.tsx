

import { IVoucher } from '@/types'
import handleTimeVn from '@/utils/handleTimeVn'
import Image from 'next/image'
import React from 'react'

export default function Voucher({
    voucher,
    onChecked,
}: {
    voucher: IVoucher;
    onChecked: (id: string) => void;
}) {
    return (
        <>
            {voucher.voucher_type === 'discount' ? (
                <div className='flex justify-between border border-solid border-gray-300 mt-1'>
                    <div className='bg-violet-500 w-1/4 flex flex-col items-center'>
                        <Image src="/images/penguin.png" alt='ew' width={60} height={0} />
                        <p className='uppercase text-white font-bold'>Giảm giá</p>
                    </div>
                    <div className='flex-1 px-2 flex flex-col justify-center'>
                        {voucher.type_discount === 'percent' ?
                            <p>Giảm {voucher.discount}%</p>
                            :
                            <p>Giảm ₫{voucher.discount.toLocaleString()}đ</p>
                        }
                        <p className='text-sm'>Mã: {voucher.voucher_code}</p>
                        <p className='text-xs text-red-500'>HSD: {handleTimeVn(voucher.expiry_date)}</p>
                    </div>
                    <div className='flex justify-center items-center w-[60px]'>
                        <input
                            onChange={() => onChecked(voucher.id)}
                            type='radio'
                            name='discount'
                            value={voucher.id}
                        />
                    </div>
                </div>
            ) : (
                <div className='flex justify-between border border-solid border-gray-300 mt-1'>
                    <div className='bg-green-500 w-1/4 flex flex-col items-center'>
                        <Image src="/images/penguin.png" alt='ew' width={60} height={60} />
                        <p className='uppercase text-white font-bold'>Freeship</p>
                    </div>
                    <div className='flex-1 px-2 flex flex-col justify-center'>
                    {voucher.type_discount === 'percent' ?
                            <p>Giảm {voucher.discount}%</p>
                            :
                            <p>Giảm ₫{voucher.discount.toLocaleString()}đ</p>
                        }
                        <p className='text-sm'>Mã: {voucher.voucher_code}</p>
                        <p className='text-xs text-red-500'>HSD: {handleTimeVn(voucher.expiry_date)}</p>
                    </div>
                    <div className='flex justify-center items-center w-[60px]'>
                        <input
                            onChange={() => onChecked(voucher.id)}
                            type='radio'
                            name='freeship'
                            value={voucher.id}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
