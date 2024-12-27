'use client';
import { AccountIcon, PostIcon, UserIcon, VideoIcon } from '@/components/Icons';
import { FcSettings } from 'react-icons/fc';
import Header from '@/components/layout/header';
import Link from 'next/link';
import { ReactNode } from 'react';
import { HiOutlineHome } from 'react-icons/hi';
import Footer from '@/components/layout/footer';

export default function MainLayOut({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen flex flex-col">
            <Header />
            {children}
            <Footer />
        </div>
    );
}
