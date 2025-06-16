'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IUpdateBackBillPayload, backBillService } from '@/services/backBill.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, User, Package, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { ISaleBill } from '@/types';
import { uploadService } from '@/services/upload.service';

interface ResponseBackBillFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bill: ISaleBill;
}

const responseBackBillSchema = z.object({
    id: z.string(),
    reply_content: z.string().min(1, 'Phản hồi không được để trống'),
    reply_image: z.string().optional(),
    reply_video: z.string().optional(),
});

type ResponseBackBillFormValues = z.infer<typeof responseBackBillSchema>;

export default function ResponseBackBillForm({ open, onOpenChange, bill }: ResponseBackBillFormProps) {
    const [replyImagePreview, setReplyImagePreview] = useState<string>('');
    const [replyVideoPreview, setReplyVideoPreview] = useState<string>('');
    const queryClient = useQueryClient();
    console.log(bill);

    const form = useForm<ResponseBackBillFormValues>({
        resolver: zodResolver(responseBackBillSchema),
        defaultValues: {
            id: bill.back_bill?.id || '',
            reply_content: bill.back_bill?.reply_content || '',
            reply_image: bill.back_bill?.reply_image || '',
            reply_video: bill.back_bill?.reply_video || '',
        },
    });

    const updateBackBillMutation = useMutation({
        mutationFn: (data: IUpdateBackBillPayload) => backBillService.update(data),
    });

    const uploadMutation = useMutation({
        mutationKey: ['upload-reply-media'],
        mutationFn: (file: File) => uploadService.uploadImage(file),
    });

    const handleReplyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setReplyImagePreview(url);
            uploadMutation.mutate(file, {
                onSuccess: (url) => {
                    form.setValue('reply_image', url);
                    setReplyImagePreview(url);
                },
                onError: (error) => {
                    console.error('Error uploading image:', error);
                    toast.error('Tải lên hình ảnh thất bại');
                },
            });
        }
    };

    const handleReplyVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setReplyVideoPreview(url);
            form.setValue('reply_video', url);
        }
    };

    const onSubmit = (data: ResponseBackBillFormValues) => {
        if (!bill.back_bill?.id) return;

        const payload: IUpdateBackBillPayload = {
            id: bill.back_bill.id,
            reply_content: data.reply_content,
            reply_image: data.reply_image || '',
            reply_video: data.reply_video || '',
        };

        updateBackBillMutation.mutate(payload, {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Phản hồi yêu cầu trả hàng thành công');
                queryClient.invalidateQueries({
                    queryKey: ['shop-orders'],
                });
                queryClient.invalidateQueries({
                    queryKey: ['get-bill-by-id', bill.id],
                });
            },
            onError: (error) => {
                console.error('Error responding to back bill:', error);
                toast.error('Phản hồi thất bại');
            },
        });
    };

    useEffect(() => {
        if (bill.back_bill) {
            form.reset({
                id: bill.back_bill.id,
                reply_content: bill.back_bill.reply_content || '',
                reply_image: bill.back_bill.reply_image || '',
                reply_video: bill.back_bill.reply_video || '',
            });
            setReplyImagePreview(bill.back_bill.reply_image || '');
            setReplyVideoPreview(bill.back_bill.reply_video || '');
        }
    }, [bill.back_bill, form]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogTitle>
                    <span className="text-lg font-semibold">Phản hồi yêu cầu trả hàng</span>
                </DialogTitle>

                <div className="space-y-6">
                    {/* Order Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Thông tin đơn hàng
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Mã đơn hàng:</span> {bill.id}
                            </div>
                            <div>
                                <span className="font-medium">Trạng thái:</span> {bill.status}
                            </div>
                            <div>
                                <span className="font-medium">Phương thức thanh toán:</span> {bill.pay_method}
                            </div>
                            <div>
                                <span className="font-medium">Tổng tiền:</span> {bill.total_bill.toLocaleString()} VNĐ
                            </div>
                        </div>
                    </div>

                    {bill.back_bill && (
                        <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-red-700 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Yêu cầu trả hàng từ khách hàng
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <span className="font-medium text-gray-700">Khách hàng:</span>{' '}
                                    {bill.back_bill.account?.full_name || bill.back_bill.account?.username}
                                </div>

                                <div>
                                    <span className="font-medium text-gray-700">Lý do trả hàng:</span>
                                    <p className="mt-1 text-gray-900">{bill.back_bill.reason_back}</p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    Ngày tạo: {new Date(bill.back_bill.created_at).toLocaleString('vi-VN')}
                                </div>

                                {bill.back_bill.image && (
                                    <div>
                                        <span className="font-medium text-gray-700">Hình ảnh đính kèm:</span>
                                        <div className="mt-2">
                                            <Image
                                                src={bill.back_bill.image}
                                                alt="Hình ảnh trả hàng"
                                                width={200}
                                                height={200}
                                                className="rounded-md object-cover border"
                                            />
                                        </div>
                                    </div>
                                )}

                                {bill.back_bill.video && (
                                    <div>
                                        <span className="font-medium text-gray-700">Video đính kèm:</span>
                                        <div className="mt-2">
                                            <video
                                                src={bill.back_bill.video}
                                                className="rounded-md border w-64 h-40"
                                                controls
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Product Details */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 text-blue-700">Chi tiết sản phẩm</h3>
                        <div className="space-y-3">
                            {bill.list_sale_bill_detail?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-md">
                                    <Image
                                        src={item.product_detail.image}
                                        alt={item.product_detail.product_name}
                                        width={60}
                                        height={60}
                                        className="rounded-md object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.product_detail.product_name}</h4>
                                        <div className="text-sm text-gray-600">
                                            <span>Màu: {item.color}</span> | <span>Size: {item.size}</span> |{' '}
                                            <span>Số lượng: {item.quantity}</span>
                                        </div>
                                        <div className="text-sm font-medium text-green-600">
                                            {item.product_detail.sale_price.toLocaleString()} VNĐ
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Address */}
                    {bill.delivery_address && (
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Địa chỉ giao hàng
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">Tên:</span> {bill.delivery_address.full_name}
                                </div>
                                <div>
                                    <span className="font-medium">Số điện thoại:</span> {bill.delivery_address.phone}
                                </div>
                                <div>
                                    <span className="font-medium">Địa chỉ:</span> {bill.delivery_address.address}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Response Form */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Phản hồi của shop</h3>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="reply_content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nội dung phản hồi *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Nhập phản hồi cho yêu cầu trả hàng..."
                                                    rows={4}
                                                    className="resize-none"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <FormLabel>Hình ảnh phản hồi</FormLabel>
                                        <div className="mt-2">
                                            <input
                                                type="file"
                                                id="reply-image-upload"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleReplyImageUpload}
                                            />
                                            <label
                                                htmlFor="reply-image-upload"
                                                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center gap-2 w-full justify-center"
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

                                        {replyImagePreview && (
                                            <div className="mt-2 relative">
                                                <Image
                                                    src={replyImagePreview}
                                                    alt="Preview"
                                                    width={200}
                                                    height={150}
                                                    className="rounded-md object-cover w-full"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReplyImagePreview('');
                                                        form.setValue('reply_image', '');
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <FormLabel>Video phản hồi</FormLabel>
                                        <div className="mt-2">
                                            <input
                                                type="file"
                                                id="reply-video-upload"
                                                accept="video/*"
                                                className="hidden"
                                                onChange={handleReplyVideoUpload}
                                            />
                                            <label
                                                htmlFor="reply-video-upload"
                                                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center gap-2 w-full justify-center"
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

                                        {replyVideoPreview && (
                                            <div className="mt-2 relative">
                                                <video
                                                    src={replyVideoPreview}
                                                    className="rounded-md object-cover w-full h-32"
                                                    controls
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReplyVideoPreview('');
                                                        form.setValue('reply_video', '');
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                        Đóng
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={updateBackBillMutation.isPending}
                                        className="min-w-[120px]"
                                    >
                                        {updateBackBillMutation.isPending ? (
                                            <span className="flex items-center gap-2">
                                                <Loader size={16} className="animate-spin" />
                                                Đang xử lý...
                                            </span>
                                        ) : (
                                            'Gửi phản hồi'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
