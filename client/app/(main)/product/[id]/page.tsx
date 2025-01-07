"use client"
import { IBooth, IProduct, IProductDetail } from '@/types';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { FaFacebookMessenger, FaStar } from "react-icons/fa";
import { Avatar, bottomNavigationActionClasses, Divider } from '@mui/material';
import { BiCart, BiMinus, BiPlus } from 'react-icons/bi';
import { productService } from '@/services/product.service';
import { boothService } from '@/services/booth.service';
import { CiShop } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify';
import useHookMutation from '@/hooks/useHookMutation';
import { orderItemService } from '@/services/orderItem.service';
import { useAppDispatch } from '@/redux/store';
import { setAddToCart } from '@/redux/slices/cart.slice';

export default function AccountId({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = React.use(params);
    const [quantity, setQuantity] = useState<number>(1);
    const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
    const [productDetailActive, setProductDetailActive] = useState<IProductDetail>();
    const [colorActive, setColorActive] = useState<string | null>(null);
    const [sizeActive, setSizeActive] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        seller_id: '',
        product_detail_id: '',
        quantity: 0,
        size: '',
        color: ''
    });
    const dispatch = useAppDispatch();

    const handleOnChangeColor = (prod: IProductDetail) => {
        setColorActive(prod.id);
        setProductDetailActive(prod);
        setSizeActive(null);
        setFormData({
            ...formData,
            product_detail_id: prod.id,
            color: prod.color
        })
    }

    const handleOnChangeQuantity = (value: number, type: string) => {
        if (type === 'plus') {
            setQuantity(value + 1);
        }
        if (type == 'minus') {
            setQuantity(value - 1);

        }
        if (type == 'input') {
            setQuantity(value);
        }
        setFormData({
            ...formData,
            quantity: value
        })
    }

    const handleOnChangeSize = (size: string) => {
        setSizeActive(size);
        setFormData({
            ...formData,
            size: size
        })
    }



    const { data: productData, isSuccess } = useQuery<IProduct>({
        queryKey: ['product', slug],
        queryFn: () => productService.getProductById(slug),
        enabled: !!slug
    });

    const { data: boothData } = useQuery<IBooth>({
        queryKey: ['booth', productData?.booth_id],
        queryFn: () => boothService.getById(productData?.booth_id!),
        enabled: !!slug && !!productData?.booth_id
    });

    const addToCartMutaion = useHookMutation(data => {
        return orderItemService.addToCart(data);
    })


    const handleAddToCart = () => {


        addToCartMutaion.mutate(formData, {
            onSuccess: (data) => {
                toast.success('Thêm sản phẩm thành công!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light"
                });

                dispatch(setAddToCart(data));

            }
        });

    }



    useEffect(() => {
        if (isSuccess) {
            setProductDetailActive(productData?.list_product_detail[0]);
            setFormData({
                ...formData,
                seller_id: productData.booth_id
            })
        }

        if (productData?.list_product_detail) {
            const randomDays = Math.floor(Math.random() * 5) + 1;
            const date = new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000);
            setDeliveryDate(date.toLocaleDateString("vi-VN").slice(0, 3))
        }
    }, [productData, isSuccess]);

    const totalSale = useMemo(() => {
        if (!productData?.list_product_detail) return 0;
        return productData.list_product_detail.reduce((prev, prod) => prev + prod.sale_quantity, 0);
    }, [productData?.list_product_detail]);



    return (
        <div className='container mx-auto mt-10 mb-10 p-4 flex flex-col gap-4'>
            <div className="flex gap-4 bg-white w-full p-4">
                <div className='w-2/5 flex flex-col'>
                    {productDetailActive?.image ? (
                        <Image
                            className='border border-solid border-gray-100 shadow-sm'
                            src={productDetailActive.image} alt="product"
                            width={500} height={500}
                        />
                    ) : (
                        <p>....</p>
                    )}

                    <div className='flex gap-2 mt-5 border border-solid border-gray-100 p-2'>
                        {productData?.list_product_detail.map((prod) => (
                            <Image
                                key={prod.id}
                                onMouseMove={() => setProductDetailActive(prod)}
                                className='hover:border-2 hover:border-red-500 hover:border-solid cursor-pointer'
                                src={prod.image}
                                alt="product" width={100} height={100}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <div className='flex flex-row gap-2'>
                        <p className='bg-red-500 text-nowrap h-6 text-white text-xs p-1 font-semibold'>Yêu Thích</p>
                        <p className='uppercase text-lg'>{productData?.product_desc}</p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <p className="underline">4.0</p>
                        <div className='flex items-center'>
                            <FaStar color='yellow' />
                            <FaStar color='yellow' />
                            <FaStar color='yellow' />
                            <FaStar color='yellow' />
                            <FaStar color='gray' />
                        </div>
                        <div>|</div>
                        <div className='flex gap-2 items-center'>
                            <p className="underline">{totalSale}</p>
                            <p>lượt bán</p>
                        </div>
                    </div>

                    {
                        productDetailActive &&
                            productDetailActive?.promotional_price > 0 ?
                            <div className='flex flex-row gap-2 items-center'>
                                <p className='text-3xl line-through opacity-75 font-light'>{productDetailActive?.sale_price.toLocaleString()}đ</p>
                                <p className='text-red-500 text-4xl'>{(productDetailActive?.sale_price - productDetailActive?.promotional_price).toLocaleString()}đ</p>
                            </div>
                            :
                            <p className='text-red-500 text-4xl'>{productDetailActive?.sale_price.toLocaleString()}đ</p>
                    }
                    <div className='flex items-center'>
                        <p className='w-1/5 opacity-60 capitalize'>Vận chuyển</p>
                        <div className='flex items-center flex-1 gap-2'>
                            <Image src="/images/freeship.avif" alt="freeship" width={30} height={30} />
                            <p>Dự kiển vận chuyển trong ngày</p>
                            <p>{deliveryDate || "Đang tính toán..."}</p>
                        </div>
                    </div>

                    <div className='flex items-center'>
                        <p className='w-1/5 opacity-60 capitalize'>An tâm mua sắm cùng Penguin</p>
                        <div className='flex items-center flex-1 gap-2'>
                            <Image src="/images/shield.svg" alt="secure" width={30} height={30} />
                            <p>Đổi trả hàng trong 15 ngày</p>
                        </div>
                    </div>

                    <div className='flex items-center'>
                        <p className='w-1/5 opacity-60 capitalize'>Màu sắc</p>
                        <div className='flex items-center flex-1 gap-2'>
                            {productData?.list_product_detail.map((prod) => (
                                <button
                                    key={prod.id}
                                    className={`flex gap-2 border border-solid border-gray-100 px-4 py-2 relative ${colorActive === prod.id && 'border-red-500'}`}
                                    onClick={() => handleOnChangeColor(prod)}
                                >
                                    <Image src={prod.image} alt="product" width={24} height={24} />
                                    <span>
                                        {prod.color}
                                    </span>
                                    {colorActive === prod.id
                                        &&
                                        <Image className='absolute right-0 bottom-0 z-10' src="/images/check.webp" alt="check" width={16} height={16} />
                                    }
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <p className='w-1/5 opacity-60 capitalize'>Size</p>
                        <div className='flex gap-4'>
                            {productDetailActive && productDetailActive.size.split(',').map((size) => (
                                <button key={size}
                                    className={`border border-solid px-4 py-2  border-gray-100 relative ${sizeActive === size && 'border-red-500'}`}
                                    onClick={() => handleOnChangeSize(size)}>
                                    {size}
                                    {sizeActive === size
                                        &&
                                        <Image className='absolute right-0 bottom-0 z-10' src="/images/check.webp" alt="check" width={16} height={16} />
                                    }
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='flex items-center'>
                        <p className='w-1/5 opacity-60 capitalize'>Số lượng</p>
                        <div className='flex border border-solid border-gray-200 items-center'>
                            <button className='p-2 w-9' onClick={() => handleOnChangeQuantity(quantity, 'minus')}>
                                <BiMinus />
                            </button>
                            <input
                                type="text"
                                className='w-9 p-2 text-center border-l border-r border-solid border-gray-200'
                                onChange={(e) => handleOnChangeQuantity(Number(e.target.value), 'input')}
                                value={quantity}
                            />
                            <button className='p-2 w-9' onClick={() => quantity > 0 && handleOnChangeQuantity(quantity, 'plus')}>
                                <BiPlus />
                            </button>
                        </div>
                    </div>

                    <div className='flex gap-4'>
                        <button onClick={handleAddToCart} className='bg-orange-200 text-orange-500 border border-solid border-orange-500 p-2 flex items-center gap-2'>
                            <BiCart size={30} />
                            <span>Thêm vào giỏ hàng</span>
                        </button>
                        <button className='bg-red-500 text-white p-2 min-w-56'>
                            Mua ngay
                        </button>

                    </div>

                </div>


            </div>
            <div className="flex gap-4 bg-white w-full p-4">
                <div className='flex'>
                    <Avatar src={boothData?.booth_avatar} alt="booth" sx={{ width: 100, height: 100 }} />
                    <div className='flex flex-col gap-1 justify-center'>
                        <p className="capitalize">{boothData?.booth_name}</p>
                        <p className='text-sm opacity-70'>Hoạt động 1 giờ trước</p>
                        <div className='flex gap-2'>
                            <button className='bg-orange-200 text-orange-500 border border-solid border-orange-500 py-1 px-2 flex items-center gap-2'>
                                <FaFacebookMessenger size={20} />
                                <span>Chat ngay</span>
                            </button>
                            <button className='flex items-center gap-2 border border-solid border-gray-200 py-1 px-2'>
                                <CiShop size={20} />
                                <span>Xem shop</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div>|</div>
                <div>
                    <div className='flex items-center gap-4'>
                        <p className='w-20'>Ngày tạo:</p>
                        <p className='text-orange-500'>{boothData && new Date(boothData?.created_at)?.toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <p className='w-20'>Sản phẩm:</p>
                        <p className='text-orange-500'>100 sản phẩm</p>
                    </div>

                </div>

            </div>
            <div className="flex flex-col gap-4 bg-white w-full p-4">
                <h2 className='text-xl'>Đánh giá sản phẩm</h2>
                <Divider />
                <div className='min-h-56'>
                    <div className='h-full w-full flex flex-col items-center justify-center'>
                        <Image src="/images/no-rating.png" alt="1" width={100} height={100} />
                        <span>
                            Chưa có đánh giá sản phẩm
                        </span>
                    </div>
                </div>
            </div>
            <ToastContainer />

        </div>
    );
}
