"use client";

import { useEffect, useState } from "react";
import { Backdrop, Fade, Modal } from "@mui/material";
import Cookie from "js-cookie";

import { BiMessageSquareDots } from "react-icons/bi";
import { HiOutlineBellAlert } from "react-icons/hi2";
import LoginForm from "@/components/LoginForm";

export default function Header() {
    const [openLogin, setOpenLogin] = useState(false);
    const [token, setToken] = useState<string | undefined>(undefined);

    const handleLoginSuccess = (data: any) => {
        setOpenLogin(false);
        setToken(data.access_token);
    }

    useEffect(() => {
        const accessToken = Cookie.get('access_token');
        setToken(accessToken);
        if (!accessToken) {
            setOpenLogin(true);
        }
    }, []);

    return (
        <header className="flex justify-between py-5 bg-white px-10 border-b border-solid border-gray-200">
            <p className="font-extrabold text-4xl flex-1">Penguin</p>
            <div className={`flex items-center justify-between ${token ? 'w-[150px]' : 'w-[300px]'} pr-7`}>
                <p className="relative flex items-center space-x-2 text-gray-800">
                    <HiOutlineBellAlert size={32} />
                    <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">3</span>
                </p>
                <p className="relative flex items-center space-x-2 text-gray-800">
                    <BiMessageSquareDots size={32}  />
                    <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">3</span>
                </p>
                {!token && (
                    <button
                        onClick={() => setOpenLogin(true)}
                        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    >
                        Đăng nhập
                    </button>
                )}
                <Modal
                    open={openLogin}
                    onClose={() => setOpenLogin(true)}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            TransitionComponent: Fade,
                        },
                    }}
                >
                    <Fade in={openLogin} timeout={{ enter: 300, exit: 200 }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <LoginForm  onLoginSuccess={handleLoginSuccess}/>
                        </div>
                    </Fade>
                </Modal>
            </div>
        </header>
    );
}
