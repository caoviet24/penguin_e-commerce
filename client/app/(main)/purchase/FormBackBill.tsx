'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
// Removed unused import
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ICreateBackBillPayload, backBillService } from '@/services/backBill.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { ISaleBill } from '@/types';
import { uploadService } from '@/services/upload.service';
import { billService } from '@/services/bill.service';

interface BackBillDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bill: ISaleBill;
}

const backBillSchema = z.object({
    reason_back: z.string().min(1, 'Lý do trả hàng không được để trống'),
    bill_id: z.string(),
    booth_id: z.string(),
    image: z.string().optional(),
    video: z.string().optional(),
});

type BackBillFormValues = z.infer<typeof backBillSchema>;

export default function BackBillDForm({ open, onOpenChange, bill }: BackBillDialogProps) {
    const [imagePreview, setImagePreview] = useState<string>('');
    const [videoPreview, setVideoPreview] = useState<string>('');
    const queryClient = useQueryClient();

    const form = useForm<BackBillFormValues>({
        resolver: zodResolver(backBillSchema),
        defaultValues: {
            reason_back: '',
            bill_id: bill.id,
            booth_id: bill.seller_id,
            image: '',
            video: '',
        },
    });

    const createBackBillMutation = useMutation({
        mutationFn: (data: ICreateBackBillPayload) => backBillService.create(data),
    });

    const updateBillMutation = useMutation({
        mutationFn: (data: { id: string; status: string }) => billService.updateStatus({
            id: data.id,
            status: data.status,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tab-delivered', bill.id],
            });
        }
    })

    const uploadMutation = useMutation({
        mutationKey: ['upload-back-bill'],
        mutationFn: (file: File) => uploadService.uploadImage(file),
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            uploadMutation.mutate(file, {
                onSuccess: (url) => {
                    form.setValue('image', url);
                    setImagePreview(url);
                },
                onError: (error) => {
                    console.error('Error uploading image:', error);
                    toast.error('Tải lên hình ảnh thất bại', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                },
            });
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
            form.setValue('video', url);
        }
    };

    const onSubmit = (data: BackBillFormValues) => {
        const payload: ICreateBackBillPayload = {
            ...data,
            image: data.image || '',
            video: data.video || '',
        };
        
        createBackBillMutation.mutate(payload, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset({
                    reason_back: '',
                    bill_id: bill.id,
                    booth_id: bill.seller_id,
                    image: '',
                    video: '',
                });
                setImagePreview('');
                setVideoPreview('');
                toast.success('Gửi yêu cầu trả hàng thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                updateBillMutation.mutate({
                    id: bill.id,
                    status: 'USER_RETURN_PENDING',
                })
                queryClient.invalidateQueries({
                    queryKey: ['get-bill-by-id', bill.id],
                });
            },
            onError: (error) => {
                console.error('Error creating back bill request:', error);
                toast.error('Gửi yêu cầu trả hàng thất bại', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            },
        });
    };

    useEffect(() => {
        if(bill.back_bill) {
            form.reset({
                reason_back: bill.back_bill.reason_back || '',
                bill_id: bill.id,
                booth_id: bill.seller_id,
                image: bill.back_bill.image || '',
                video: bill.back_bill.video || '',
            })
        }
    }, [bill.back_bill, bill.id, bill.seller_id, form])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTitle>
                <span className="text-lg font-semibold">Yêu cầu trả hàng</span>
            </DialogTitle>
            <DialogContent className="sm:max-w-[600px]">
                <div className="bg-white p-6 w-full max-w-[600px] rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Thông tin trả hàng</h3>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="reason_back"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lý do trả hàng</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Nhập lý do trả hàng"
                                                rows={4}
                                                className="resize-none"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <div>
                                    <FormLabel>Hình ảnh</FormLabel>
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
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
                                    </div>

                                    {imagePreview && (
                                        <div className="mt-2 relative">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                width={200}
                                                height={200}
                                                className="rounded-md object-cover h-40 w-40"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview('');
                                                    form.setValue('image', '');
                                                }}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <FormLabel>Video</FormLabel>
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            id="video-upload"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={handleVideoUpload}
                                        />
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

                                    {videoPreview && (
                                        <div className="mt-2 relative">
                                            <video
                                                src={videoPreview}
                                                className="rounded-md object-cover h-40 w-40"
                                                controls
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setVideoPreview('');
                                                    form.setValue('video', '');
                                                }}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </Form>

                    <div className="flex justify-end mt-6 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                form.reset({
                                    reason_back: '',
                                    bill_id: bill.id,
                                    booth_id: bill.seller_id,
                                    image: '',
                                    video: '',
                                });
                                setImagePreview('');
                                setVideoPreview('');
                            }}
                        >
                            Đóng
                        </Button>
                        <Button
                            type="button"
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={createBackBillMutation.isPending}
                        >
                            {createBackBillMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <Loader size={16} className="animate-spin" /> Đang xử lý...
                                </span>
                            ) : (
                                'Gửi yêu cầu'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}