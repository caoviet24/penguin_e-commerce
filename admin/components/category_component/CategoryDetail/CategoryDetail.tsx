"use client"

import Loader from '@/components/Loader/loader';
import useHookMutation from '@/hooks/useHookMutation';
import { categoryService } from '@/services/category.service';
import { categoryDetailService } from '@/services/categoryDetail.service';
import { ICategory, ICategoryDetail } from '@/types';
import { getUrlImage } from '@/utils/getUrlImage';
import { Avatar, Modal } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlinePicture } from "react-icons/ai";
import { BiMinusCircle, BiPlusCircle, BiPlusMedical } from 'react-icons/bi';


interface CategoryProps {
    category: ICategory;
    mode: "edit" | "delete" | "read";
    onSuccess?: (data: ICategory) => void;
}

export default function CategoryDetail({ category, mode, onSuccess }: CategoryProps) {
    const [cgDetail, setCgDetail] = useState('');
    const [formData, setFormData] = useState<ICategory>(category || {});
    const [payLoad, setPayLoad] = useState({
        id: category.id,
        category_name: formData.category_name,
        image: formData.image,
    });
    const inputImageRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [openDigLog, setOpenDigLog] = useState(false);

    const handleGetImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFormData({ ...formData, image: '' } as ICategory);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            const url = await getUrlImage(file);
            if (url) {
                setImagePreview('');
                setPayLoad({ ...payLoad, image: url });
            }
        }
    };

    const updateCategoryMutation = useHookMutation((data: any) => {
        return categoryService.update(data);
    });
    const handleUpdateCategory = () => {
        updateCategoryMutation.mutate(payLoad, {
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess(data);
                }
            }
        });
    };

    const deleteCategoryMutation = useHookMutation((id: string) => {
        return categoryService.deleteById(id);
    });
    const handDeleteCategory = () => {
        deleteCategoryMutation.mutate(category.id, {
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess(data);
                }
            }
        });
    }

    const softDeleteCgDetailMutation = useHookMutation((id: string) => {
        return categoryDetailService.delete2ById(id);
    });

    const handleSoftDeleteCgDetail = (cgd: ICategoryDetail) => {
        softDeleteCgDetailMutation.mutate(cgd.id, {
            onSuccess: () => {
                setFormData({
                    ...formData, list_category_detail: formData.list_category_detail?.map((item) => {
                        if (item.id === cgd.id) {
                            return { ...item, is_deleted: true }
                        }
                        return item;
                    })
                });
            }
        });
    }

    const restoreCgDetailMutation = useHookMutation((id: string) => {
        return categoryDetailService.restore(id);
    });

    const handleRestoreCgDetail = (cgd: ICategoryDetail) => {
        restoreCgDetailMutation.mutate(cgd.id, {
            onSuccess: () => {
                setFormData({
                    ...formData, list_category_detail: formData.list_category_detail?.map((item) => {
                        if (item.id === cgd.id) {
                            return { ...item, is_deleted: false }
                        }
                        return item;
                    })
                });
            }
        });
    }


    return (
        <div className='w-[600px] p-5 rounded-lg bg-white'>
            <p className='text-2xl pb-3'>
                {mode === "edit" && "Chỉnh sửa danh mục"}
                {mode === "delete" && "Xóa danh mục"}
                {mode === "read" && "Chi tiết danh mục"}
            </p>
            <div>
                <label htmlFor="category_name" className="block mb-2 text-sm font-medium text-gray-900 ">Tên danh mục</label>
                <input
                    onChange={(e) => setPayLoad({ ...payLoad, category_name: e.target.value })}
                    value={payLoad.category_name ? payLoad.category_name : formData.category_name}
                    type="text"
                    id="category_name"
                    name='category_name'
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
            <div>
                {!imagePreview && !formData.image && <AiOutlinePicture size={120} className='text-gray-500' />}
                {imagePreview &&
                    <div className='relative w-[140px] h-[140px] '>
                        <Avatar src={imagePreview as string} className='blur-[2px] !w-full !h-full' />
                        <Loader size="sm" />
                    </div>
                }
                {(formData.image || payLoad.image) && <Avatar src={payLoad.image ? payLoad.image : formData.image as string} className='!w-[140px] !h-[140px]' />}
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

            {
                (mode === 'edit' || mode === 'read') &&
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
                                <p>Chi tiết danh mục {index + 1}: {cgd.catogory_detail_name}</p>
                                {mode === 'edit' && !cgd.is_deleted &&
                                    <button
                                        onClick={() => handleSoftDeleteCgDetail(cgd)}
                                        className='bg-red-500 text-white rounded-full px-2 py-2 hover:bg-red-300'>
                                        <BiMinusCircle size={20} />
                                    </button>}

                                {mode === 'edit' && cgd.is_deleted &&
                                    <button onClick={() => handleRestoreCgDetail(cgd)} className='bg-green-500 text-white rounded-full px-2 py-2 hover:bg-green-300'>
                                        <BiPlusCircle size={20} />
                                    </button>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            }

            <div className='flex justify-end'>
                {mode === 'edit' && <button onClick={handleUpdateCategory} className='bg-blue-500 text-white rounded-lg px-5 py-2 mt-5'>Cập nhật</button>}
                {mode === 'delete' && <button onClick={() => setOpenDigLog(true)} className='bg-red-500 text-white rounded-lg px-5 py-2 mt-5'>Xóa</button>}
                {mode === 'read' && <button className='bg-gray-500 text-white rounded-lg px-5 py-2 mt-5'>Đóng</button>}
            </div>

            <Modal
                open={openDigLog}
                className='flex justify-center items-center'
            >
                <div className='w-[400px] bg-white p-5 rounded-lg'>
                    <p>Bạn có chắc chắn muốn xóa danh mục {category.category_name} không?</p>
                    <div className='flex justify-end gap-4'>
                        <button onClick={() => setOpenDigLog(false)} className='bg-gray-500 text-white rounded-lg px-5 py-2 mt-5'>Hủy</button>
                        <button onClick={handDeleteCategory} className='bg-red-500 text-white rounded-lg px-5 py-2 mt-5'>Xóa</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
