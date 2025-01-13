"use client";
import React, { useEffect, useRef } from 'react'
import { ImFilePicture } from "react-icons/im";
import { getUrlImage } from '@/utils/getUrlImage';
import Loader from '@/components/Loader/loader';
import useHookMutation from '@/hooks/useHookMutation';
import { boothService } from '@/services/booth.service';
import { Avatar, Modal } from '@mui/material';
import useLocationStorage from '@/hooks/useLocationStorage';
import { toast, ToastContainer } from 'react-toastify';
import handleTimeVn from '@/utils/handleTimeVn';
import { BiCheck } from 'react-icons/bi';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import ProductsOfBooth from '@/components/booth_component/ProductsOfBooth/ProductsOfBooth';
import { setBooth } from '@/redux/slices/booth.slice';
import Link from 'next/link';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { RiOrderPlayFill } from 'react-icons/ri';


export default function Register() {
    const { my_account } = useAppSelector(state => state.account);
    const [imagePreview, setImagePreview] = React.useState<string>();
    const [isEdit, setIsEdit] = React.useState(false);
    const [formData, setFormData] = React.useState({
        booth_name: '',
        booth_description: '',
        avatar: ''
    });
    const dispatch = useAppDispatch();

    const { storedValue, setValue } = useLocationStorage({
        key: 'register_shop',
        initialValue: {},
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChooseImage = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    const handleGetImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFormData({
            ...formData,
            avatar: ''
        })
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            const url = await getUrlImage(file);
            if (url) {
                setImagePreview(undefined);
                setFormData({
                    ...formData,
                    avatar: url
                });
            }
        }
    }

    const createShopMutation = useHookMutation((data: any) => {
        return boothService.create(data);
    });

    const { isPending } = createShopMutation;

    const handleCreateShop = async () => {
        createShopMutation.mutate(formData, {
            onSuccess: (data) => {
                setValue(data);
                toast.success('Gửi yêu cầu đăng ký thành công', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            },
            onError: (error) => {
                toast.error('Gửi yêu cầu đăng ký thất bại do tên cửa hàng đã được ai đó sử dụng', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        });
    }

    const handleEditShop = () => {
        setIsEdit(true);
        setFormData({
            booth_name: storedValue?.booth_name,
            booth_description: storedValue?.booth_description,
            avatar: storedValue?.booth_avatar
        })
    }

    const updateBoothMutation = useHookMutation((data: any) => {
        return boothService.update(data);
    });

    const { isPending: isFetchUpdateBoothLoading } = updateBoothMutation;

    const handleUpdateShop = async () => {
        updateBoothMutation.mutate({
            booth_id: storedValue?.id,
            booth_name: formData.booth_name,
            booth_description: formData.booth_description,
            avatar: formData.avatar
        }, {
            onSuccess: (data) => {
                setValue(data);
                setIsEdit(false);
                toast.success('Cập nhật thông tin cửa hàng thành công', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            },
            onError: (error) => {
                toast.error('Cập nhật thông tin cửa hàng thất bại', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        });
    }

    const handleCancelRegisterShop = () => {
        // setValue({});
    }

    const { data: boothData, isSuccess: isFetchGetBoothSuccess, isError: isisFetchGetBoothError } = useQuery({
        queryKey: ['get-booth-by-id', !!my_account.id],
        queryFn: () => boothService.getByAccId(my_account.id),
        enabled: !!my_account.id
    });


    useEffect(() => {
        if (isFetchGetBoothSuccess) {
            setValue(boothData)
            dispatch(setBooth(boothData))
        }

        if (isisFetchGetBoothError) {
            setValue({})
        }

    }, [isFetchGetBoothSuccess, isisFetchGetBoothError])




    return (
        <div className='container bg-white p-6 rounded-lg shadow-lg my-10'>
            <div className='flex justify-between items-center'>
                <span className='text-2xl text-gray-900 pt-3 pb-5'>Trở thành người bán hàng của Penguin</span>
            </div>
            {(!storedValue?.booth_name || isEdit) &&
                <div>
                    <div className="mb-6">
                        <label htmlFor="name" className="block mb-2 text-base font-medium text-gray-900 ">Tên cửa hàng</label>
                        <input
                            name="booth_name"
                            type="text"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                            placeholder="Aa..."
                            required
                            value={formData.booth_name}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="desc" className="block mb-2 text-base font-medium text-gray-900 ">Giới thiệu về cửa hàng</label>
                        <textarea
                            name="booth_description"
                            cols={2} rows={5}
                            id="desc"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                            placeholder="Aa..."
                            required
                            value={formData.booth_description}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <button onClick={handleChooseImage} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                                <span>Ảnh shop</span>
                            </button>
                            <input ref={inputRef} onChange={handleGetImage} type="file" id="avatar" className="hidden" />
                        </div>
                        {imagePreview &&
                            <div className='relative w-[140px] h-[140px] '>
                                <Avatar src={imagePreview as string} sx={{ width: 140, height: 140 }} className='blur-[2px]' />
                                <Loader size="sm" />
                            </div>
                        }
                        {formData.avatar && <Avatar src={formData.avatar as string} sx={{ width: 140, height: 140 }} />}
                        {!imagePreview && !formData.avatar && <ImFilePicture size={140} />}
                    </div>

                    <div className="flex items-start my-6">
                        <div className="flex items-center h-5 ">
                            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-purple-600 dark:ring-offset-gray-800" required />
                        </div>
                        <label htmlFor="remember" className="ms-2 text-base font-medium text-gray-900 dark:text-gray-300 flex flex-row gap-1">
                            Khi trở thành người bán hàng của Penguin bạn cần đồng ý với
                            <a href="#" className="text-purple-600 hover:underline dark:text-purple-500">
                                các điều khoản và chính sách
                            </a>
                            của chúng tôi.
                        </label>
                    </div>
                    {isEdit ?
                        <button
                            onClick={handleUpdateShop}
                            className="rounded bg-purple-600 py-1 px-2.5 border border-transparent text-center text-base text-white transition-all shadow-sm hover:shadow-md focus:bg-purple-500 focus:shadow-none active:bg-purple-500 hover:bg-purple-500 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                            <span className="ml-1">Xác nhận</span>
                        </button>
                        :

                        <button
                            onClick={handleCreateShop}
                            className="rounded bg-purple-600 py-1 px-2.5 border border-transparent text-center text-base text-white transition-all shadow-sm hover:shadow-md focus:bg-purple-500 focus:shadow-none active:bg-purple-500 hover:bg-purple-500 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                            <span className="ml-1">Gửi yêu cầu</span>
                        </button>
                    }
                </div>
            }

            {storedValue && storedValue?.booth_name && !storedValue.is_active &&
                <div>
                    <div className='flex items-center'>
                        <Avatar src={storedValue?.booth_avatar} sx={{ width: 80, height: 80 }} />
                        <div>
                            <p className='text-xl capitalize'>{storedValue.booth_name}</p>
                            <div className='flex items-center text-sm text-gray-500'>
                                <BiCheck size={20} />
                                <p>Đang chờ xác nhận</p>
                            </div>
                        </div>

                    </div>
                    <div className='text-xl text-gray-900 pt-3 pb-5'>
                        Chúng tôi đã nhận được thông tin của bạn đăng kí cửa hàng
                        <span className='font-bold'> {storedValue?.booth_name} </span>
                        vào ngày {handleTimeVn(storedValue?.created_at)}
                    </div>
                    <div className='text-xl text-gray-900'>
                        Chúng tôi sẽ kiểm tra thông tin và thông báo cho bạn trong thời gian sớm nhất.
                        Cảm ơn bạn đã đăng ký cửa hàng!
                    </div>
                    <div className='flex justify-end gap-2 mt-6'>
                        <button onClick={handleEditShop} className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded">
                            Sửa thông tin
                        </button>
                        <button onClick={handleCancelRegisterShop} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                            Hủy đăng ký
                        </button>
                    </div>
                </div>
            }

            {storedValue && storedValue?.is_active &&
                <div className='flex flex-col'>
                    <div className='flex justify-between items-center px-3'>
                        <div className='flex items-center'>
                            <Avatar src={storedValue?.booth_avatar} sx={{ width: 80, height: 80 }} />
                            <div>
                                <p className='text-xl capitalize'>{storedValue.booth_name}</p>
                                <div className='flex items-center text-sm text-blue-500'>
                                    <BiCheck size={20} />
                                    <p>Đã xác nhận</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center'>
                            <Link className='bg-amber-500 flex items-center mr-4 gap-2 text-white px-5 py-2 rounded-lg font-bold' href='/shop/statistical'>
                                <FaArrowTrendUp size={22} />
                                Xem thống kê cửa hàng
                            </Link>
                            <Link className='bg-green-500 flex items-center gap-2 text-white px-5 py-2 rounded-lg font-bold' href='/shop/order'>
                                <RiOrderPlayFill size={22} />
                                Xem đơn hàng
                            </Link>
                        </div>

                    </div>
                    <div>
                        <ProductsOfBooth booth={storedValue} />
                    </div>
                    <div className='flex justify-end gap-2 mt-2'>
                        <button onClick={handleEditShop} className="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded">
                            Tạm đóng
                        </button>
                        <button onClick={handleCancelRegisterShop} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                            Hủy đăng ký
                        </button>
                    </div>
                </div>
            }


            <Modal open={isPending || isFetchUpdateBoothLoading}>
                <Loader size="sm" className='md' />
            </Modal>

            <ToastContainer />
        </div>
    )
}
