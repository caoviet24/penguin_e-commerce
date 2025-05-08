'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Header2({ title }: { title: string }) {

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
