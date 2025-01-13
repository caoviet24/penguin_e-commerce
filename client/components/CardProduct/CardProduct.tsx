"use client"
import React, { useMemo } from 'react'
import { IProduct } from '@/types'
import { redirect } from 'next/navigation';

export default function CardProduct({ product }: { product: IProduct }) {


    const percent = useMemo(() => {
        const priceSale = product.list_product_detail[0].sale_price;
        const promotionalPrice = product.list_product_detail[0].promotional_price;
        if (priceSale === 0) return 0;
        return (Math.ceil((priceSale - promotionalPrice) / priceSale * 100));
    }, [product]);

    const handleOnClickProduct = () => {
        redirect(`/product/${product.id}`);
    }



    return (
        <div onClick={handleOnClickProduct} className="h-auto bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <div className="relative w-full h-48">
                <img
                    src="/images/frame-product.png"
                    alt="frame"
                    className="absolute top-0 left-0 w-full h-full z-30"
                />
                <img
                    src={product.list_product_detail[0].image}
                    alt="product"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5/6 h-5/6 rounded-lg z-20"
                />
                {percent > 0 && <span className='text-white text-sm absolute top-[18px] right-[13px] font-bold z-30'> - {percent}%</span>}
                {percent == 0 && <img src="/images/hot.png" alt="hot" className=" absolute top-4 right-1.5 text-lg font-bold z-30 h-6 object-cover" />}

                <div className='flex flex-row gap-1 absolute bottom-4 left-3 z-30 h-6'>
                    <img src="/images/voucher.avif" alt="voucher" className='h-full' />
                    <img src="/images/freeship.avif" alt="freeship" />
                </div>
            </div>
            <div className="px-4 py-3">
                <p className="text-base text-gray-800 line-clamp-2">
                    {product.product_desc}
                </p>

            </div>



        </div>
    )
}
