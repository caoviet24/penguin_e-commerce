import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookie from "js-cookie";
import useHookMutation from "@/hooks/useHookMutation";
import { identityService } from "@/services/identities.service";


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Tên đăng nhập ít nhất 2 ký tự",
    }),
    password: z.string().min(1, {
        message: "Mật khẩu ít nhất 1 ký tự",
    }),
});

export default function LoginForm({ onLoginSuccess }: { onLoginSuccess: (data : any) => void }) {
    const { handleSubmit, register, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const loginMutation = useHookMutation((data: any) => {
        const { username, password } = data;
        return identityService.login(username, password);
    });

    const { data, isPending, isError, isSuccess, error } = loginMutation;

    const handleLogin = (value: z.infer<typeof formSchema>) => {
        loginMutation.mutate(value, {
            onSuccess: (data) => {
                onLoginSuccess(data);
            },
        });
    };

    useEffect(() => {

        if (isSuccess) {

            const { access_token, refresh_token } = data;
            Cookie.set('access_token', access_token, { expires: 10, path: '/' });
            Cookie.set('refresh_token', refresh_token, { expires: 365, path: '/' })
        }
    }, [isSuccess])



    return (
        <form onSubmit={handleSubmit(handleLogin)}>
            <div className="flex flex-col items-center justify-center px-6 py-8 w-[700px] mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Đăng nhập Hippo
                        </h1>
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Username
                                </label>
                                <input
                                    {...register("username")}
                                    type="text"
                                    id="username"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Aa..."
                                />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <input
                                    {...register("password")}
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                    />
                                    <label htmlFor="remember" className="ml-3 text-sm text-gray-500 dark:text-gray-300">
                                        Nhớ mật khẩu
                                    </label>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                                    Quên mật khẩu?
                                </a>
                            </div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className={`w-full text-white bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isPending ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
                            {isError && (
                                <p className="text-red-500 text-sm">
                                    Thông tin đăng nhập không chính xác
                                </p>
                            )}

                            {isSuccess && <p className="text-green-500 text-sm">Đăng nhập thành công!</p>}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
