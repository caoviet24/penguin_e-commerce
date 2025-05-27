
import React, { useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Avatar, Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { boothService } from '@/services/booth.service'
import useHookMutation from '@/hooks/useHookMutation'
import { IBooth } from '@/types'
import { CiShop } from 'react-icons/ci'

const formSchema = z.object({
    booth_name: z.string().min(1, {
        message: "Tên gian hàng ít nhất có 1 kí tự"
    }),
    booth_description: z.string().min(1, {
        message: "Tài khoản ít nhất có 1 kí tự"
    }),
    is_active: z.boolean(),
    is_banned: z.boolean(),
})


export default function EditBooth({ booth, onUpdateSuccess }: { booth: IBooth, onUpdateSuccess: () => void }) {
    const { data: dataBooth, isSuccess: isFetchBoothSuccess } = useQuery({
        queryKey: ["get-booth-by-id", booth],
        queryFn: () => boothService.getById(booth?.id),
        enabled: !!booth
    });

    const { register, formState: { errors }, reset, handleSubmit } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });


    const updateBoothMutation = useHookMutation((data: any) => {
        return boothService.update(data);
    })

    const handleUpdateBooth = async (data: z.infer<typeof formSchema>) => {
        if (booth.id) {
            updateBoothMutation.mutate({
                booth_id: booth.id,
                booth_avatar: booth.booth_avatar,
                ...data
            }, {
                onSuccess: () => {
                    onUpdateSuccess();
                }
            });
        };
    }


    useEffect(() => {
        if (isFetchBoothSuccess) {
            reset({
                booth_name: dataBooth.booth_name || "",
                booth_description: dataBooth.booth_description || "",
                is_active: dataBooth.is_active || false,
                is_banned: dataBooth.is_banned || false,
            });
        }
        
    }, [isFetchBoothSuccess, reset]);

    return (
        <div className='flex flex-col pt-6 pb-2 px-5 min-w-[600px]'>
            <div className='flex flex-row pb-2'>
                <CiShop />
                <p className='font-bold px-2'>Cập nhật gian hàng</p>
            </div>
            <Divider />
            <form className="mx-auto py-4 w-full" onSubmit={handleSubmit(handleUpdateBooth)}>
                <div className="relative z-0 w-full mb-5 group">
                    <input {...register("booth_name")} type="text" name="booth_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                    <label htmlFor="booth_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tên gian hàng</label>
                    {errors.booth_name && <p className='text-red-500 text-sm'>{errors.booth_name.message}</p>}
                </div>

                <div className="relative z-0 w-full mb-5 group">
                    <textarea cols={2} rows={2} {...register("booth_description")} name="booth_description" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                    <label htmlFor="booth_description" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Mô tả</label>
                    {errors.booth_description && <p className='text-red-500 text-sm'>{errors.booth_description.message}</p>}
                </div>

                <div className='flex h-[100px] items-center gap-4'>
                    <Avatar src={booth.booth_avatar} className='block !h-[100px] !w-[100px]' />
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1.5 px-4 rounded inline-flex items-center">
                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                        <span>Ảnh shop</span>
                    </button>
                </div>

                <div className='flex flex-row items-center gap-2 mt-4'>
                    <label className="inline-flex items-center mb-5 cursor-pointer">
                        <input {...register("is_active")} type="checkbox" value="" className="sr-only peer" />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-300">Xác thực</span>
                    </label>
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