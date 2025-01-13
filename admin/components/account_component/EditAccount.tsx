


import React, { useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AccountIcon } from '@/components/Icons'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import useHookMutation from '@/hooks/useHookMutation'
import { IAccount } from '@/types'

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Tài khoản ít nhất có 1 kí tự"
    }),
    password: z.string().min(1, {
        message: "Mật khẩu ít nhất có 1 kí tự"
    }),
    role: z.enum(["admin", "user"], {
        message: "Vai trò là bắt buộc"
    }),
    is_banned: z.boolean()
});


export default function EditAccount({ account, onUpdateSuccess }: { account: IAccount, onUpdateSuccess: () => void }) {
    const { data: dataAccount, isSuccess: isFetchAccountSuccess } = useQuery({
        queryKey: ["get-account-by-id", account],
        queryFn: () => accountService.getById(account?.id),
        enabled: !!account
    });

    const { register, formState: { errors }, reset, handleSubmit } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const updateAccountMutation = useHookMutation((data : any) => {
        return accountService.updateById(data);
    })

    const handleUpdateAccount = async (data: z.infer<typeof formSchema>) => {
        if (account.id) {
            updateAccountMutation.mutate({
                id: account.id,
                ...data
            }, {
                onSuccess: () => {
                    onUpdateSuccess();
                }
            });
        };
    }


    useEffect(() => {
        if (isFetchAccountSuccess) {
            reset({
                username: dataAccount.username || "",
                password: dataAccount.password || "",
                role: dataAccount.role === "admin" || dataAccount.role === "user" ? dataAccount.role : "user",
                is_banned: dataAccount.is_banned || false,
            });
        }
    }, [isFetchAccountSuccess, reset]);

    return (
        <div className='flex flex-col pt-6 pb-2 px-5 min-w-[600px]'>
            <div className='flex flex-row pb-2'>
                <AccountIcon />
                <p className='font-bold px-2'>Cập nhật tài khoản</p>
            </div>
            <Divider />
            <form className="mx-auto py-4 w-full" onSubmit={handleSubmit(handleUpdateAccount)}>
                <div className="relative z-0 w-full mb-5 group">
                    <input {...register("username")} type="text" name="username" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                    <label htmlFor="username" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tên đăng nhập</label>
                    {errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input disabled type="text"  {...register("password")} name="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Mật khẩu</label>
                </div>

                <div className="pb-2">
                    <select {...register("role")} className="bg-gray-50 border-b text-sm py-4 border-gray-300 outline-none text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full">
                        <option value="">Vai trò</option>
                        <option value="admin">Quản trị viên</option>
                        <option value="user">Người dùng</option>
                    </select>
                    {errors.role && <p className='text-red-500 text-sm'>{errors.role.message}</p>}
                </div>

                <div className='flex flex-row items-center gap-2 mt-4'>
                    <label className="inline-flex items-center mb-5 cursor-pointer">
                        <input {...register("is_banned")} type="checkbox" className="sr-only peer" />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-300">Cấm</span>
                    </label>
                </div>

                <div className='flex justify-end gap-4'>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                        Hủy
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                        Cập nhật
                    </button>
                </div>

            </form>
        </div>
    )
}