"use client";
import { BiMessageSquareDots } from "react-icons/bi";
import { HiOutlineBellAlert } from "react-icons/hi2";

export default function HeaderAdmin() {
    return (
        <header className="flex justify-between py-5 bg-white px-10 border-b border-solid border-gray-200">
            <p className="font-extrabold text-4xl flex-1">Penguin</p>
            <div className={`flex items-center justify-betweenpr-7`}>
                <p className="relative flex items-center space-x-2 text-gray-800">
                    <HiOutlineBellAlert size={32} />
                    <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">3</span>
                </p>
                <p className="relative flex items-center space-x-2 text-gray-800">
                    <BiMessageSquareDots size={32}  />
                    <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">3</span>
                </p>
              
            </div>
        </header>
    );
}
