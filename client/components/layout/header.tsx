'use client';

import { BiCartAlt, BiSearchAlt2 } from 'react-icons/bi';
import Image from 'next/image';
import Link from 'next/link';
import { RiShoppingCartLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { Popover } from '@mui/material';
import useDebounce from '@/hooks/useDebounce';
import { set } from 'react-hook-form';
import RenderWithCondition from '../RenderWithCondition/renderwithcondition';

export default function Header() {
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
        <header className="bg-purple-50 shadow-md h-52 flex items-center">
            <div className="container flex items-center justify-between py-8 px-6 mx-auto gap-5">
                <Link href="/" className="flex items-center">
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
                    <RenderWithCondition condition={!!searchValueDebounce}>
                        <div className="flex flex-col justify-between gap-2 mt-2 bg-white h-[300px] w-full shadow-xl border border-solid border-gray-300 absolute top-full left-0 z-50">
                            {hotSearch.map((item, index) => (
                                <Link href="/" key={index}>
                                    <p className="text-black text-sm  hover:bg-black-01 p-2 transition">{item}</p>
                                </Link>
                            ))}
                        </div>
                    </RenderWithCondition>

                    <div className="absolute top-full left-0 z-10 w-full">
                        <ul className="flex justify-between gap-2 mt-2">
                            {hotSearch.map((item, index) => (
                                <Link href="/" key={index}>
                                    <p className="text-gray-600 text-xs hover:text-purple-600 transition">{item}</p>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex items-center gap-5 mt-4">
                    <button>
                        <RiShoppingCartLine size={30} />
                    </button>
                    <Link href="./sign-in" className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded transition w-auto">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </header>
    );
}
