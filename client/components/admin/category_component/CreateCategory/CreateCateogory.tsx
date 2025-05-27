"use client"

import Loader from '@/components/Loader/loader';
import useHookMutation from '@/hooks/useHookMutation';
import { categoryService } from '@/services/category.service';
import { getUrlImage } from '@/utils/getUrlImage';
import { Avatar } from '@mui/material';
import React, { useRef, useState } from 'react';
import { AiOutlinePicture } from "react-icons/ai";
import { BiMinusCircle, BiPlusCircle, BiPlusMedical } from 'react-icons/bi';

export default function CreateCateogory({ onCreateCategorySuccess }: { onCreateCategorySuccess: () => void }) {
    const [cgDetail, setCgDetail] = useState('');
    const [formData, setFormData] = useState({
        category_name: '',
        image: '',
        list_category_detail: [] as { category_detail_name: string }[]
    });
    const inputImageRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    const handleGetImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImage('');
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            const url = await getUrlImage(file);
            if (url) {
                setImagePreview('');
                setImage(url);
                setFormData({ ...formData, image: url });
            }
        }
    }
    const createCategoryMutation = useHookMutation((data: any) => {
        return categoryService.create(data);
    });

    const handleCreateCategory = () => {
        createCategoryMutation.mutate(formData, {
            onSuccess: () => {
                onCreateCategorySuccess();
            }
        });
    }

    return (
        <div className='w-[600px] p-5 rounded-lg bg-white'>
            <p className='text-2xl pb-3'>Thêm danh mục</p>
            <div>
                <label htmlFor="category_name" className="block mb-2 text-sm font-medium text-gray-900 ">Tên danh mục</label>
                <input
                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                    value={formData.category_name}
                    type="text"
                    id="category_name"
                    name='category_name'
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
            <div>
                {!imagePreview && !image && <AiOutlinePicture size={120} className='text-gray-500' />}
                {imagePreview &&
                    <div className='relative w-[140px] h-[140px] '>
                        <Avatar src={imagePreview as string} className='blur-[2px] !w-full !h-full' />
                        <Loader size="sm" />
                    </div>
                }
                {image && <Avatar src={image as string} className='!w-[140px] !h-[140px]' />}
                <button
                    onClick={() => {
                        if (inputImageRef.current) {
                            inputImageRef.current.click();
                        }
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1.5 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                    <span>Ảnh danh mục</span>
                </button>
                <input ref={inputImageRef} onChange={handleGetImage} type='file' className='hidden' />
            </div>

            <div>
                <div className='flex justify-between items-center mt-5'>
                    <p className='text-lg capitalize'>Chi tiết danh mục</p>
                </div>

                <div className='flex justify-between items-center gap-5'>
                    <input
                        value={cgDetail}
                        onChange={(e) => setCgDetail(e.target.value)}
                        type="text" id="category_detail_name"
                        name='category_detail_name'
                        placeholder='Tên chi tiết danh mục'
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    <button
                        onClick={() => {
                            setFormData({ ...formData, list_category_detail: [...formData.list_category_detail, { category_detail_name: cgDetail }] });
                            setCgDetail('');
                        }}
                        className='bg-blue-500 text-white rounded-lg px-5 py-2 hover:bg-blue-300'
                    >
                        <BiPlusMedical />
                    </button>
                </div>
                <div className='mt-2 max-h-[100px] overflow-y-auto'>
                    {formData.list_category_detail && formData.list_category_detail.map((cgd, index) => (
                        <div key={index} className='flex justify-between items-center gap-5 mt-2'>
                            <p>Chi tiết danh mục {index + 1}: {cgd.category_detail_name}</p>
                            <button onClick={() => {
                                setFormData({ ...formData, list_category_detail: formData.list_category_detail.filter((_, i) => i !== index) });
                            }}
                                className='bg-red-500 text-white rounded-full px-2 py-2 hover:bg-red-300'>
                                <BiMinusCircle size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex justify-end'>
                <button onClick={handleCreateCategory} className='bg-blue-500 text-white rounded-lg px-5 py-2 mt-5'>Xác nhận</button>
            </div>

        </div>
    )
}
