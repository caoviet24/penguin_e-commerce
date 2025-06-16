/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader/loader';
import { identityService } from '@/services/identities.service';
import { toast, ToastContainer } from 'react-toastify';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signUpSchema = z.object({
    username: z
        .string()
        .email('Định dạng email không hợp lệ')
        .refine((val) => val.endsWith('@gmail.com'), {
            message: 'Email phải là Gmail (kết thúc bằng @gmail.com)',
        }),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 kí tự'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const router = useRouter();
    const [message, setMessage] = React.useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });


    const registerMutation = useMutation({
        mutationFn: (data: SignUpFormValues) => {
            return identityService.register(data.username, data.password);
        },
        onSuccess: () => {
            toast.success('Đăng kí thành công, hệ thống chuyển hướng đăng nhập sau 3s', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: 'light',
            });

            setTimeout(() => {
                router.push('/sign-in');
            }, 3000);
        },
        onError: () => {
            toast.error('Đăng kí không thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: 'light',
            });
        },
    });

    const onSubmit = (data: SignUpFormValues) => {
        setMessage('');
        registerMutation.mutate(data);
    };

    return (
        <section className="bg-gray-100 min-h-screen flex box-border justify-center items-center">
            <div className="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
                <div className="md:w-1/2 px-8">
                    <h2 className="font-bold text-3xl text-[#002D74]">Đăng kí</h2>
                    <p className="text-sm mt-4 text-[#002D74]">Nếu bạn đã chưa có tài khoản, đăng kí ngay !</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="mt-8">
                            <input
                                className={`p-2 rounded-xl border w-full ${errors.username ? 'border-red-500' : ''}`}
                                type="text"
                                placeholder="Email của bạn"
                                {...register('username')}
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                        </div>

                        <div>
                            <input
                                className={`p-2 rounded-xl border w-full ${errors.password ? 'border-red-500' : ''}`}
                                type="password"
                                placeholder="Mật khẩu"
                                {...register('password')}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        {message && <p className="text-red-500 text-sm">{message}</p>}

                        <button
                            disabled={registerMutation.isPending}
                            className={`bg-[#002D74] relative text-white py-2 rounded-xl hover:scale-105 duration-300 font-medium ${
                                registerMutation.isPending ? 'bg-[#1d3d5e]' : ''
                            }`}
                            type="submit"
                        >
                            Đăng ký
                            {registerMutation.isPending && <Loader size="sm" />}
                        </button>
                    </form>

                    <div className="mt-6 items-center text-gray-100">
                        <hr className="border-gray-300" />
                        <p className="text-center text-sm">HOẶC</p>
                        <hr className="border-gray-300" />
                    </div>

                    <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-[#60a8bc4f] font-medium">
                        <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
                            <path
                                fill="#FFC107"
                                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                            ></path>
                            <path
                                fill="#FF3D00"
                                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                            ></path>
                            <path
                                fill="#4CAF50"
                                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                            ></path>
                            <path
                                fill="#1976D2"
                                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                            ></path>
                        </svg>
                        Đăng nhập với google
                    </button>

                    <div className="mt-10 text-sm border-b border-gray-500 py-5 playfair tooltip">Quên mật khẩu?</div>

                    <div className="mt-4 text-sm flex justify-between items-center container-mr">
                        <p className="mr-3 md:mr-0 ">Nếu bạn đã có tài khoản?</p>
                        <Link
                            href="/sign-in"
                            className="hover:border text-white bg-[#002D74] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
                <div className="w-1/2">
                    <img
                        className="rounded-2xl max-h-[1600px] h-[400px]"
                        src="/images/penguin.png"
                        alt="login form image"
                    />
                </div>
            </div>
            <ToastContainer />
        </section>
    );
}
