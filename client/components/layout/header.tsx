'use client';

import { BiSearchAlt2 } from 'react-icons/bi';
import Image from 'next/image';
import Link from 'next/link';
import { RiShoppingCartLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { LuUserRoundCheck } from 'react-icons/lu';
import RenderWithCondition from '../RenderWithCondition/renderwithcondition';
import { useAppSelector } from '@/redux/store';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/product.service';
import { useQuery } from '@tanstack/react-query';
import { IProduct } from '@/types';
import { Avatar } from '@mui/material';
import { useUser } from '@/hooks/useAuth';

export default function Header() {
    const { user } = useUser();
    const { cart } = useAppSelector((state) => state.cart);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear();
        Cookie.remove('access_token');
        Cookie.remove('refresh_token');
        router.push('/sign-in');
    };

    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState<IProduct[]>([]);
    const {
        isSuccess: isFetchByNameSuccess,
        data: ProductByNameData,
        refetch: refetchByName,
    } = useQuery({
        queryKey: ['products-by-name'],
        queryFn: () =>
            productService.getByDesc({
                page_number: 1,
                page_size: 20,
                product_desc: searchValue,
            }),
        enabled: searchValue !== '',
    });
    const searchValueDebouce = useDebounce(searchValue, 500);

    useEffect(() => {
        if (searchValueDebouce.trim()) {
            refetchByName();
        }
    }, [searchValueDebouce, refetchByName]);

    useEffect(() => {
        if (isFetchByNameSuccess && ProductByNameData) {
            setSearchResult(ProductByNameData.data);
        }
    }, [isFetchByNameSuccess, ProductByNameData]);

    return (
        <header className="bg-purple-50 shadow-md flex items-center">
            <div className="container flex items-center justify-between py-8 px-6 mx-auto gap-5">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/penguin.png" alt="logo-main" width={50} height={50} />
                    <span className="text-2xl font-bold text-purple-800 mt-4">Penguin</span>
                </Link>
                <div className="relative flex-1 flex-col mt-4">
                    <div className="relative">
                        <input
                            className="w-full bg-white text-gray-700 text-sm border border-gray-300 rounded-md pl-3 pr-28 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-purple-500 hover:border-gray-400 shadow-sm focus:shadow-md"
                            placeholder="Nhập từ khóa tìm kiếm...."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <button className="absolute top-1 right-1 flex items-center rounded bg-purple-600 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-md focus:bg-purple-500 focus:shadow-none active:bg-purple-500 hover:bg-purple-500 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                            <BiSearchAlt2 size={20} />
                            <span className="ml-1">Tìm kiếm</span>
                        </button>
                    </div>
                    <RenderWithCondition condition={!!searchValue}>
                        <div className="flex flex-col justify-between gap-2 mt-2 bg-white max-h-[410px] w-full shadow-xl border border-solid border-gray-300 absolute top-full left-0 z-50">
                            <p className="text-sm py-1 px-2">Tìm kiếm sản phẩm</p>
                            {searchResult.map((item, index) => (
                                <Link
                                    key={index}
                                    className="flex items-center justify-between hover:bg-black-01 p-2 transition"
                                    href={`product/${item.id}`}
                                    onClick={() => {
                                        setSearchValue('');
                                        setSearchResult([]);
                                    }}
                                >
                                    <p className="text-black text-sm  ">{item.product_desc}</p>
                                    <Avatar
                                        className="mr-4 !h-[30px] !w-[30px]"
                                        src={item.list_product_detail[0].image}
                                        alt={item.list_product_detail[0].product_name}
                                    />
                                </Link>
                            ))}
                        </div>
                    </RenderWithCondition>

                    <div className="absolute top-full left-0 z-10 w-full">
                        <ul className="flex justify-between gap-2 mt-2">
                            {[
                                'Quần bò ống đứng',
                                'Áo thun',
                                'Áo khoác',
                                'iphone 15 pro max',
                                'macbook pro 2022',
                                'Giày thể thao',
                                'tất cổ ngắn',
                                'Quần lửng',
                                'Quần short',
                                'Ốp điện thoại',
                                'Balo du lịch',
                                'Khăn quàng cổ',
                            ].map((item, index) => (
                                <Link href="/" key={index}>
                                    <p className="text-gray-600 text-xs hover:text-purple-600 transition">{item}</p>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex items-center gap-5 mt-4">
                    <div className="relative group">
                        <Link href="/cart">
                            <RiShoppingCartLine size={30} />
                        </Link>
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            {cart.length}
                        </span>
                        <div className="absolute right-0 top-full text-sm text-gray-600 bg-white min-w-[400px] p-2 max-h-96  rounded shadow  hidden  z-40 group-hover:block">
                            <p className="text-sm py-2 font-bold text-gray-800 border-b border-gray-300">Giỏ hàng</p>
                            <div className="overflow-y-auto max-h-72">
                                {cart.length > 0 ? (
                                    cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center gap-2 p-2 border-b border-solid border-gray-300 last:border-none"
                                        >
                                            <Image
                                                src={item.product_detail.image}
                                                alt={item.product_detail.product_name}
                                                width={50}
                                                height={50}
                                                className="rounded"
                                            />
                                            <p className="flex-1 text-gray-700 truncate">
                                                {item.product_detail.product_name}
                                            </p>
                                            <p className="text-red-500">
                                                {item.product_detail.sale_price.toLocaleString()}đ
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full w-full flex flex-col items-center justify-center gap-2">
                                        <Image
                                            src="/images/no-rating.png"
                                            alt="iphone-13-pro-max"
                                            width={100}
                                            height={100}
                                        />
                                        <p>Giỏ hàng trống</p>
                                    </div>
                                )}
                            </div>
                            <Link
                                href="/cart"
                                className="bg-purple-500 text-white font-medium px-4 py-2 rounded transition float-right mt-1 mr-5"
                            >
                                Xem giỏ hàng
                            </Link>
                        </div>
                    </div>

                    {user ? (
                        <div className="relative group z-50">
                            <Link href={`/account/${user.id}`}>
                                <LuUserRoundCheck size={30} />
                            </Link>
                            <div className="absolute top-full flex-col left-0 bg-white p-2 rounded shadow hidden min-w-64 group-hover:flex">
                                <Link
                                    className="p-2 hover:bg-purple-500 hover:text-white transition"
                                    href={`/account/${user.id}`}
                                >
                                    Tài khoản
                                </Link>
                                <Link className="p-2 hover:bg-purple-500 hover:text-white transition" href="/purchase">
                                    Đơn hàng
                                </Link>
                                <Link
                                    className="p-2 hover:bg-purple-500 hover:text-white transition"
                                    href="/shop/register"
                                >
                                    Trở thành người bán hàng
                                </Link>
                                <button onClick={handleLogout} className="w-full text-start">
                                    <p className="p-2 hover:bg-purple-500 hover:text-white transition">Đăng xuất</p>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="./sign-in"
                            className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded transition w-auto"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
