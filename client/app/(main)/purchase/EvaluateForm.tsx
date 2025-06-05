'use client';

import { ISaleBill, ISaleBillDetail } from '@/types';
import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { ICreateProductReviewPayload, productReviewService } from '@/services/productReview.service';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { toast } from 'react-toastify';
import { uploadService } from '@/services/upload.service';

interface IProps {
    bill: ISaleBill;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EvaluateForm({ bill, open, onOpenChange }: IProps) {
    const [rating, setRating] = React.useState(1);
    const [comment, setComment] = React.useState('');
    const [reviewMedias, setReviewMedias] = React.useState<{ media_url: string; media_type: string }[]>([]);

    const createEvaluate = useMutation({
        mutationFn: (data: ICreateProductReviewPayload) => productReviewService.create(data),
    });

    const uploadMutation = useMutation({
        mutationFn: (file: File) => uploadService.uploadImage(file),
    });

    const handleAddMedia = (file: File, type: string) => {
        uploadMutation.mutate(file, {
            onSuccess: (response) => {
                const newMedia = {
                    media_url: response,
                    media_type: type,
                };
                setReviewMedias((prev) => [...prev, newMedia]);
            },
            onError: () => {
                toast.error('Failed to upload media');
            },
        });
    };

    const handleRemoveMedia = (index: number) => {
        const updatedMedias = [...reviewMedias];
        updatedMedias.splice(index, 1);
        setReviewMedias(updatedMedias);
    };

    const hanldeEvaluateProduct = () => {
        createEvaluate.mutate({
            bill_id: bill.id,
            product_id: bill.list_sale_bill_detail[0].product_detail.product_id,
            rating: rating,
            comment: comment,
            review_medias: reviewMedias,
        });
        toast.success('Đánh giá sản phẩm thành công');
        setRating(1);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Đánh giá sản phẩm</DialogTitle>
                    <DialogDescription>Hãy chia sẻ trải nghiệm của bạn về sản phẩm này</DialogDescription>
                </DialogHeader>
                <div className="m-h-[500px] w-[500px] bg-white p-5 rounded-lg">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold">Đánh giá sản phẩm</h1>
                    </div>
                    {bill.list_sale_bill_detail.map((b: ISaleBillDetail, idx) => (
                        <div key={idx} className="flex justify-between items-center gap-2 py-2">
                            <div>
                                <Image
                                    src={b.product_detail.image}
                                    alt={b.product_detail.product_name}
                                    width={70}
                                    height={70}
                                />
                            </div>
                            <div className="flex flex-1 flex-col">
                                <p>{b.product_detail.product_name}</p>
                                <p>
                                    Phân loại hàng: {b.size} - {b.color}
                                </p>
                                <p>x{b.quantity}</p>
                            </div>
                            <div>
                                {b.product_detail.promotional_price > 0 ? (
                                    <div className="flex flex-row gap-2">
                                        <p className="line-through opacity-60">
                                            {b.product_detail.sale_price.toLocaleString()}đ
                                        </p>
                                        <p className="text-red-500">
                                            {b.product_detail.promotional_price.toLocaleString()}đ
                                        </p>
                                    </div>
                                ) : (
                                    <p>{b.product_detail.sale_price.toLocaleString()}đ</p>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col gap-2">
                        <div className="flex bg-slate-200 px-4 py-2 gap-4">
                            <p>Chất lượng sản phẩm: </p>
                            <div className="flex items-center">
                                <FaStar
                                    size={20}
                                    className={`transition-all ${rating > 0 && 'text-yellow-500'}`}
                                    onClick={() => setRating(1)}
                                />
                                <FaStar
                                    size={20}
                                    className={`transition-all ${rating > 1 && 'text-yellow-500'}`}
                                    onClick={() => setRating(2)}
                                />
                                <FaStar
                                    size={20}
                                    className={`transition-all ${rating > 2 && 'text-yellow-500'}`}
                                    onClick={() => setRating(3)}
                                />
                                <FaStar
                                    size={20}
                                    className={`transition-all ${rating > 3 && 'text-yellow-500'}`}
                                    onClick={() => setRating(4)}
                                />
                                <FaStar
                                    size={20}
                                    className={`transition-all ${rating > 4 && 'text-yellow-500'}`}
                                    onClick={() => setRating(5)}
                                />
                            </div>
                        </div>

                        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
                                <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                                    <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 12 20"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
                                                />
                                            </svg>
                                            <span className="sr-only">Attach file</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 16 20"
                                            >
                                                <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                            </svg>
                                            <span className="sr-only">Embed map</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 16 20"
                                            >
                                                <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                            </svg>
                                            <span className="sr-only">Upload image</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 16 20"
                                            >
                                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                                <path d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 0 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z" />
                                            </svg>
                                            <span className="sr-only">Format code</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z" />
                                            </svg>
                                            <span className="sr-only">Add emoji</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap items-center space-x-1 rtl:space-x-reverse sm:ps-4">
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 21 18"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9.5 3h9.563M9.5 9h9.563M9.5 15h9.563M1.5 13a2 2 0 1 1 3.321 1.5L1.5 17h5m-5-15 2-1v6m-2 0h4"
                                                />
                                            </svg>
                                            <span className="sr-only">Add list</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                                            </svg>
                                            <span className="sr-only">Settings</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                                                <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                                            </svg>
                                            <span className="sr-only">Timeline</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                                                <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                                            </svg>
                                            <span className="sr-only">Download</span>
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    data-tooltip-target="tooltip-fullscreen"
                                    className="p-2 text-gray-500 rounded cursor-pointer sm:ms-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 19 19"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
                                        />
                                    </svg>
                                    <span className="sr-only">Full screen</span>
                                </button>
                                <div
                                    id="tooltip-fullscreen"
                                    role="tooltip"
                                    className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                                >
                                    Show full screen
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                                <label htmlFor="editor" className="sr-only">
                                    Publish post
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    id="editor"
                                    rows={8}
                                    className="block w-full px-0 outline-none text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Write an article..."
                                    required
                                ></textarea>
                            </div>
                        </div>
                        {/* Media Preview */}
                        {reviewMedias.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {reviewMedias.map((media, index) => (
                                    <div key={index} className="relative">
                                        {media.media_type === 'image' ? (
                                            <Image
                                                src={media.media_url}
                                                alt={`Preview ${index}`}
                                                width={100}
                                                height={100}
                                                className="rounded-md object-cover h-24 w-24"
                                            />
                                        ) : (
                                            <video
                                                src={media.media_url}
                                                className="rounded-md object-cover h-24 w-24"
                                                controls
                                            />
                                        )}
                                        <button
                                            onClick={() => handleRemoveMedia(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Media Upload Buttons */}
                        <div className="flex gap-2 mt-4">
                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        handleAddMedia(file, 'image');
                                    }
                                }}
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                                </svg>
                                Thêm hình ảnh
                            </label>

                            <input type="file" id="video-upload" accept="video/*" className="hidden" />
                            <label
                                htmlFor="video-upload"
                                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z" />
                                </svg>
                                Thêm video
                            </label>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Đóng</Button>
                            <Button onClick={hanldeEvaluateProduct} variant="default">
                                Gửi đánh giá
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
