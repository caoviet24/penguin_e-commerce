'use client';
import Header from '@/components/layout/header';
import { ReactNode, useEffect, useState } from 'react';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import Header2 from '@/components/layout/header2';

export default function MainLayOut({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/cart') {
            setTitle('Giỏ hàng');
        } else if (pathname === '/checkout') {
            setTitle('Thanh toán');
        } else {
            setTitle(null);
        }
    }, [pathname]);

    const _Header = title ? <Header2 title={title} /> : <Header />;

    return (
        <div className="h-screen flex flex-col">
            {_Header}
            <div className='flex-1 bg-gray-100'>
                {children}
            </div>
            <Footer />
        </div>
    );
}
