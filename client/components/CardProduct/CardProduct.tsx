/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useMemo } from 'react';
import { IProduct } from '@/types';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaHeart, FaEye } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';

export default function CardProduct({ product }: { product: IProduct }) {
    const percent = useMemo(() => {
        const priceSale = product.list_product_detail[0]?.sale_price;
        const promotionalPrice = product.list_product_detail[0]?.promotional_price;
        if (priceSale === 0) return 0;
        return Math.ceil(((priceSale - promotionalPrice) / priceSale) * 100);
    }, [product]);

    const handleOnClickProduct = () => {
        redirect(`/product/${product.id}`);
    };

    const randomSold = Math.floor(Math.random() * 1000);
    const rating = (4.0 + Math.random() * 1.0).toFixed(1);

    return (
        <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
            {/* Image Container */}
            <div 
                onClick={handleOnClickProduct}
                className="relative w-full h-40 sm:h-48 overflow-hidden cursor-pointer"
            >
                {/* Product Image */}
                <Image
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    src={product.list_product_detail[0].image}
                    alt="product"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Center Button - Appears on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <button 
                        onClick={handleOnClickProduct}
                        className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    >
                        <FaEye className="w-4 h-4" />
                        Xem chi tiết
                    </button>
                </div>
                
                {/* Discount Badge */}
                {percent > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 text-xs">
                        -{percent}%
                    </Badge>
                )}
                
                {/* Hot Badge */}
                {percent === 0 && (
                    <div className="absolute top-2 left-2">
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-2 py-1 text-xs animate-pulse">
                            🔥 HOT
                        </Badge>
                    </div>
                )}

                {/* Heart Icon */}
                <button className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <FaHeart className="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors" />
                </button>

                {/* Voucher and Freeship Icons */}
                <div className="absolute bottom-2 left-2 flex gap-1">
                    <img 
                        src="/images/voucher.avif" 
                        alt="voucher" 
                        className="h-4 w-auto drop-shadow-md" 
                    />
                    <img 
                        src="/images/freeship.avif" 
                        alt="freeship" 
                        className="h-4 w-auto drop-shadow-md" 
                    />
                </div>
            </div>
            
            {/* Content Section - Compact */}
            <div className="p-3 space-y-2">
                {/* Product Title */}
                <h3 
                    onClick={handleOnClickProduct}
                    className="text-sm text-gray-800 font-medium line-clamp-2 leading-tight cursor-pointer hover:text-blue-600 transition-colors duration-200"
                >
                    {product.product_desc}
                </h3>
                
                {/* Price Section */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-500">
                        {(
                            product.list_product_detail[0].sale_price - product.list_product_detail[0].promotional_price
                        ).toLocaleString()}₫
                    </span>
                    {percent > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                            {product.list_product_detail[0].sale_price.toLocaleString()}₫
                        </span>
                    )}
                </div>
                
                {/* Rating and Sales */}
                <div className='flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-1'>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <FaStar 
                                    key={i}
                                    className={`w-2.5 h-2.5 ${
                                        i < Math.floor(Number(rating)) 
                                            ? 'text-yellow-400' 
                                            : 'text-gray-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-gray-600 ml-1">({rating})</span>
                    </div>
                    <span className='text-gray-500'>
                        {randomSold.toLocaleString()} đã bán
                    </span>
                </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>
    );
}
