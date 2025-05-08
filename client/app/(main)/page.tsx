'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import Carousel from 'react-material-ui-carousel';
import { FaStar } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import Cookie from 'js-cookie';
import { identityService } from '@/services/identities.service';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setMyAcount } from '@/redux/slices/account.slice';
import { productService } from '@/services/product.service';
import CardProduct from '@/components/CardProduct/CardProduct';
import { Divider } from '@mui/material';
import Link from 'next/link';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { orderItemService } from '@/services/orderItem.service';
import { setCarts } from '@/redux/slices/cart.slice';

export default function Home() {
    const { my_account } = useAppSelector((state) => state.account);
    const dispatch = useAppDispatch();

    const [a] = useState([
        '/images/slider/1.avif',
        '/images/slider/2.avif',
        '/images/slider/3.avif',
        '/images/slider/4.avif',
        '/images/slider/5.avif',
    ]);

    const { data: authData, isSuccess: isFetchAuthSuccess } = useQuery({
        queryKey: ['auth-me'],
        queryFn: identityService.authMe,
        enabled: !!Cookie.get('access_token'),
    });

    const { data: productData } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getPagination(1, 70),
    });

    const { data: orderItemData, isSuccess: isFetchOrderItemSuccess } = useQuery({
        queryKey: ['order-items', my_account?.id],
        queryFn: () => orderItemService.getOrderItemByUserId(my_account?.id),
        enabled: !!my_account?.id,
    });

    useEffect(() => {
        if (isFetchAuthSuccess) {
            dispatch(setMyAcount(authData));
        }

        if (isFetchOrderItemSuccess) {
            dispatch(setCarts(orderItemData));
        }
    }, [isFetchAuthSuccess, isFetchOrderItemSuccess]);

    return (
        <div className="container flex flex-col justify-between mx-auto mt-5 mb-10">
            <div className="flex w-full flex-1 gap-2 bg-white p-5">
                <Carousel>
                    {a.map((slider, index) => (
                        <div key={index} className="h-[390px] w-full">
                            <img src={slider} className="h-full w-full" />
                        </div>
                    ))}
                </Carousel>

                <div className="flex flex-col h-full w-[350px]">
                    <div className="flex flex-row">
                        <Image src="/images/penguin.png" alt="logo-main" width={50} height={50} />
                        <span className="text-2xl font-bold text-purple-800 mt-4">TRY PENGUIN APP</span>
                    </div>
                    <div className="relative w-full flex-1">
                        <Image
                            className="absolute top-0 left-0 right-0 bottom-0 -z-10"
                            src="/images/frame.png"
                            alt="logo-main"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <p className="flex mt-2 ml-2 items-center gap-2">
                            <FaStar color="yellow" />
                            <span className="mt-1 text-sm text-white"> 5.0 rated</span>
                        </p>
                        <div className="flex flex-col mx-10 gap-2 mt-5">
                            <p className="uppercase text-sm text-nowrap text-white font-bold w-10/12">
                                Get penguin app and start shoping
                            </p>
                            <div className="flex items-center gap-2">
                                <Image src="/images/freeship.avif" alt="free-ship" width={50} height={50} />
                                <span className="text-white uppercase font-bold text-lg">Free shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src="/images/voucher.avif" alt="logo-main" width={50} height={50} />
                                <span className="text-white uppercase font-bold text-lg text-wrap">Big vouchers</span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-8 bg-white p-1">
                        <div className="flex mt-2">
                            <Image src="/images/qr.avif" alt="logo-main" width={120} height={120} />
                            <div className="flex flex-col justify-center gap-2 ml-2">
                                <div className="flex items-center gap-2 border-2 border-solid border-gray-300 px-2 py-1 rounded-full">
                                    <Image src="/images/iphone.png" alt="logo-main" width={25} height={25} />
                                    <span>App store</span>
                                </div>
                                <div className="flex items-center gap-2 border-2 border-solid border-gray-300 px-2 py-1 rounded-full">
                                    <Image src="/images/ch-play.jpeg" alt="logo-main" width={25} height={25} />
                                    <span>Google play</span>
                                </div>
                            </div>
                        </div>
                        <div>Download the app now by scanning the QR code</div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between bg-white mt-2 p-5">
                <div className="flex items-center flex-col justify-center text-center">
                    <Image src="/images/choice.png" alt="1" width={40} height={40} />
                    <span>
                        Hàng chọn <br /> Giá hời
                    </span>
                </div>
                <div className="flex items-center flex-col justify-center text-center">
                    <Image src="/images/vnd.png" alt="1" width={40} height={40} />
                    <span>Mã giảm giá</span>
                </div>
                <div className="flex items-center flex-col justify-center text-center">
                    <Image src="/images/freeship.avif" alt="1" width={40} height={40} />
                    <span>
                        Giao hàng
                        <br />
                        Miễn phí
                    </span>
                </div>
                <div className="flex items-center flex-col justify-center text-center">
                    <Image src="/images/voucher.avif" alt="1" width={40} height={40} />
                    <span>
                        Voucher giảm giá <br /> siêu lớn
                    </span>
                </div>
                <div className="flex items-center flex-col justify-center text-center">
                    <Image src="/images/hours.png" alt="1" width={40} height={40} />
                    <span>
                        Khung giờ <br /> Săn sale
                    </span>
                </div>
                <div className="flex items-center flex-col justify-center text-center">
                    <Image src="/images/global.png" alt="1" width={40} height={40} />
                    <span>Hãng quốc tế</span>
                </div>
                <div className="flex items-center flex-col justify-center text-center">
                    <Image src="/images/global.png" alt="1" width={40} height={40} />
                    <span>
                        Nạp thẻ, Dịch vụ <br /> - Xem phim
                    </span>
                </div>
            </div>

            <div className="flex flex-col mt-10 p-5 bg-white">
                <h2 className="text-xl py-2">Dành cho bạn</h2>
                <Divider />
                <div className="grid grid-cols-6 gap-2 mt-4">
                    {productData && productData.data.map((pro) => <CardProduct product={pro} key={pro.id} />)}
                </div>
            </div>
            <Link
                className="block w-48 text-center px-10 py-2 bg-gray-200 mx-auto mt-5 transition-all hover:scale-105"
                href="/product"
            >
                Xem tất cả
            </Link>
        </div>
    );
}
