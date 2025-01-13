"use client";

import Loader from '@/components/Loader/loader';
import useHookMutation from '@/hooks/useHookMutation';
import { productDetailService } from '@/services/productdetail.service';
import { IProductDetail } from '@/types'
import { getUrlImage } from '@/utils/getUrlImage';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlinePicture } from 'react-icons/ai';
import { BiPlusMedical } from 'react-icons/bi';

interface IProps {
    productDetail?: IProductDetail,
    onSuccess?: (data: IProductDetail) => void
}

interface IProductDetailPayload {
    product_detail_id: string;
    product_name: string;
    image: string;
    sale_price: number;
    promotional_price: number;
    stock_quantity: number;
    color: string;
    sizes: string[];
}


export default function ProductDetail({ productDetail, onSuccess }: IProps) {

    const [payload, setPayload] = React.useState<IProductDetailPayload>({
        product_detail_id: "",
        product_name: "",
        image: "",
        sale_price: 0,
        promotional_price: 0,
        stock_quantity: 0,
        color: "",
        sizes: []
    });

    const [size, setSize] = React.useState<string>("");
    const [imagePreview, setImagePreview] = useState("");
    const inputImageRef = useRef<HTMLInputElement>(null);

    const handleGetImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPayload({ ...payload, image: "" });
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            const url = await getUrlImage(file);
            if (url) {
                setPayload({ ...payload, image: url });
                setImagePreview("");
            }
        }
    };

    const handleOnChangeProductDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPayload((prev) => ({ ...prev, [name]: value }));
    }

 
    const updateProductDetailMutation = useHookMutation((data: IProductDetailPayload) => {
        return productDetailService.update(data);
    })
    const handleUpdateProductDetail = () => {
        updateProductDetailMutation.mutate(payload, {
            onSuccess: (data) => {
                onSuccess && onSuccess(data);
            }
        })
    }

    useEffect(() => {
        setPayload({
            product_detail_id: productDetail?.id || "",
            product_name: productDetail?.product_name || "",
            image: productDetail?.image || "",
            sale_price: productDetail?.sale_price || 0,
            promotional_price: productDetail?.promotional_price || 0,
            stock_quantity: productDetail?.stock_quantity || 0,
            color: productDetail?.color || "",
            sizes: productDetail?.size.split(',') || []
        })
    }, [productDetail]);


    return (
        <div className="w-[600px] p-5 rounded-lg bg-white">
            <p className="text-2xl pb-3">Thông tin sản phẩm {productDetail?.product_name}</p>
            <div>
                <label htmlFor="product_name" className="block mb-2 text-sm font-medium text-gray-900 ">
                    Tên sản phẩm
                </label>
                <input
                    value={payload.product_name}
                    onChange={handleOnChangeProductDetail}
                    placeholder="Tên sản phẩm"
                    type="text"
                    id="product_name"
                    name="product_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
            </div>
            <div className="flex  justify-between gap-5 mt-3">
                <div className="flex-1">
                    <label htmlFor="sale_price" className="block mb-2 text-sm font-medium text-gray-900 ">
                        Giá bán
                    </label>
                    <input
                        value={payload.sale_price}
                        onChange={handleOnChangeProductDetail}
                        type="number"
                        id="sale_price"
                        name="sale_price"
                        placeholder="0"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="promotional_price" className="block mb-2 text-sm font-medium text-gray-900 ">
                        Giá khuyến mại
                    </label>
                    <input
                        type="number"
                        value={payload.promotional_price}
                        onChange={handleOnChangeProductDetail}
                        id="promotional_price"
                        placeholder="0"
                        name="promotional_price"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                </div>
            </div>

            <div className="flex  justify-between gap-5 mt-3">
                <div className="flex-1">
                    <label htmlFor="color" className="block mb-2 text-sm font-medium text-gray-900 ">
                        Màu sắc
                    </label>
                    <input
                        value={payload.color}
                        onChange={handleOnChangeProductDetail}
                        placeholder="Màu sắc"
                        type="text"
                        id="color"
                        name="color"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="stock_quantity" className="block mb-2 text-sm font-medium text-gray-900 ">
                        Số lượng có sẵn
                    </label>
                    <input
                        type="text"
                        id="stock_quantity"
                        name="stock_quantity"
                        value={payload.stock_quantity}
                        onChange={handleOnChangeProductDetail}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-3 mt-3 bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex flex-row items-center gap-2">
                    <label htmlFor="product_name" className="block w-[80px] text-sm font-semibold text-gray-700">
                        {" "}
                        Kích cỡ
                    </label>
                    <div className="flex flex-wrap gap-2 flex-1">
                        {payload.sizes.length > 0 &&
                            payload.sizes.map((s, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 bg-gray-300 text-gray-700 px-3 py-1 rounded-full shadow-sm"
                                >
                                    <span className="text-sm font-medium">{s}</span>
                                    <button
                                        onClick={() =>
                                            setPayload((prev) => ({
                                                ...prev,
                                                sizes: prev.sizes.filter((_, index) => index !== idx),
                                            }))
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        onChange={(e) => setSize(e.target.value)}
                        value={size}
                        name="color"
                        className="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                        placeholder="Thêm kích cỡ..."
                    />
                    <button
                        onClick={() => {
                            setPayload({ ...payload, sizes: [...payload.sizes, size] });
                            setSize("");
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center gap-1"
                    >
                        <BiPlusMedical size={16} />
                        Thêm
                    </button>
                </div>
            </div>

            <div
                className="mt-4"
                onClick={() => {
                    if (inputImageRef.current) {
                        inputImageRef.current.click();
                    }
                }}
            >
                <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                    Ảnh sản phẩm
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    {!imagePreview && !payload.image && (
                        <div className="text-center flex flex-col items-center justify-between">
                            <AiOutlinePicture size={50} className="text-gray-500" />
                            <div className="mt-4 flex text-sm/6 text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        onChange={handleGetImage}
                                        ref={inputImageRef}
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    )}

                    {imagePreview && (
                        <div className="relative">
                            <Image src={imagePreview} width={120} height={120} alt="preview" className="blur-[2px]" />
                            <Loader size="sm" />
                        </div>
                    )}

                    {payload.image && <Image src={payload.image} width={120} height={120} alt="product" />}
                </div>
            </div>

            <div className="flex justify-end">
                <button onClick={handleUpdateProductDetail} className="bg-blue-500 text-white rounded-lg px-5 py-2 mt-5">Sửa</button>
            </div>
        </div>
    )
}
