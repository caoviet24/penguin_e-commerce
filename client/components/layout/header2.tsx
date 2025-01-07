'use client';

import { BiSearchAlt2 } from 'react-icons/bi';
import Image from 'next/image';
import Link from 'next/link';
import { RiShoppingCartLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { LuUserRoundCheck } from "react-icons/lu";
import RenderWithCondition from '../RenderWithCondition/renderwithcondition';
import { useAppSelector } from '@/redux/store';

export default function Header2({ title }: { title: string }) {
    const { my_account } = useAppSelector(state => state.account);
    const { cart } = useAppSelector(state => state.cart);



    const [hotSearch, setHotSearch] = useState([
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
    ]);

    const [searchValue, setSearchValue] = useState('');
    const searchValueDebounce = useDebounce(searchValue, 500);

    useEffect(() => {



    }, [searchValueDebounce]);

    return (
        <header className="bg-purple-50 shadow-md flex items-center">
            <div className="container flex items-center justify-between py-8 px-6 mx-auto gap-5">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/penguin.png" alt="logo-main" width={50} height={50} />
                    <span className="text-2xl font-bold text-purple-800 mt-5">Penguin</span>
                </Link>
                <div className="w-[2px] h-8 bg-purple-800 mt-5"></div>
                <div className="relative flex-1 flex-col mt-5">
                    <p className="capitalize text-2xl">{title}</p>
                </div>
            </div>
        </header>

    );
}
