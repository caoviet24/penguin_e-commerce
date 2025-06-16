'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IVoucher } from '@/types';
import { voucherService } from '@/services/voucher.service';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

interface VoucherDialogProps {
    voucherId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: 'view' | 'create' | 'edit' | 'delete' | 'restore';
}

const getVoucherSchema = (mode: string | undefined) => {
    const baseSchema = {
        voucher_name: z.string().min(1, { message: 'Tên phiếu giảm giá không được để trống' }),
        voucher_type: z.string().min(1, { message: 'Loại phiếu giảm giá không được để trống' }),
        expiry_date: z.date({ required_error: 'Vui lòng chọn ngày hết hạn' }),
        quantity_remain: z.coerce.number().min(1, { message: 'Số lượng phiếu phải lớn hơn 0' }),
        discount: z.coerce.number().min(1, { message: 'Giá trị giảm giá phải lớn hơn 0' }),
        type_discount: z.string().min(1, { message: 'Loại giảm giá không được để trống' }),
        apply_for: z.string().min(1, { message: 'Đối tượng áp dụng không được để trống' }),
        status: z.coerce.number(),
    };

    if (mode === 'create') {
        return z.object({
            ...baseSchema,
            voucher_code: z.string().optional(),
        });
    }

    return z.object({
        ...baseSchema,
        voucher_code: z.string().min(1, { message: 'Mã phiếu giảm giá không được để trống' }),
    });
};

type VoucherFormValues = z.infer<ReturnType<typeof getVoucherSchema>>;

export default function VoucherDialog({ voucherId, open, onOpenChange, mode }: VoucherDialogProps) {
    const queryClient = useQueryClient();

    const form = useForm<VoucherFormValues>({
        resolver: zodResolver(getVoucherSchema(mode)),
        defaultValues: {
            voucher_name: '',
            voucher_code: '',
            voucher_type: 'discount',
            expiry_date: new Date(),
            quantity_remain: 0,
            discount: 0,
            type_discount: 'percent',
            apply_for: 'all',
            status: 1,
        },
    });

    const { data: voucherData, isLoading: isLoadingVoucher } = useQuery({
        queryKey: ['voucher', voucherId],
        queryFn: () => (voucherId ? voucherService.getById(voucherId) : null),
        enabled: !!voucherId && open,
        staleTime: 0,
    });

    useEffect(() => {
        if (voucherData) {
            form.reset({
                voucher_name: voucherData.voucher_name,
                voucher_code: voucherData.voucher_code,
                voucher_type: voucherData.voucher_type,
                expiry_date: new Date(voucherData.expiry_date),
                quantity_remain: voucherData.quantity_remain,
                discount: voucherData.discount,
                type_discount: voucherData.type_discount,
                apply_for: voucherData.apply_for,
                status: voucherData.status,
            });
        } else if (!voucherId) {
            form.reset({
                voucher_name: '',
                voucher_code: '',
                voucher_type: 'discount',
                expiry_date: new Date(),
                quantity_remain: 0,
                discount: 0,
                type_discount: 'percent',
                apply_for: 'all',
                status: 1,
            });
        }
    }, [voucherData, voucherId, form]);

    // Update the form resolver when mode changes
    useEffect(() => {
        form.clearErrors();
        form.setFocus('voucher_name');
    }, [mode, form]);

    const createMutation = useMutation({
        mutationFn: (data: Partial<IVoucher>) => voucherService.create(data),
        onSuccess: () => {
            toast.success('Thêm phiếu giảm giá thành công');
            queryClient.invalidateQueries({ queryKey: ['vouchers'] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi thêm phiếu giảm giá');
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: Partial<IVoucher>) =>
            voucherService.update({
                id: voucherId!,
                ...data,
            }),
        onSuccess: () => {
            toast.success('Cập nhật phiếu giảm giá thành công');
            queryClient.invalidateQueries({ queryKey: ['vouchers'] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi cập nhật phiếu giảm giá');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => voucherService.deleteSoft(id),
        onSuccess: () => {
            toast.success('Xóa phiếu giảm giá thành công');
            queryClient.invalidateQueries({ queryKey: ['vouchers'] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi xóa phiếu giảm giá');
        },
    });

    const restoreMutation = useMutation({
        mutationFn: (id: string) => voucherService.restore(id),
        onSuccess: () => {
            toast.success('Khôi phục phiếu giảm giá thành công');
            queryClient.invalidateQueries({ queryKey: ['vouchers'] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi khôi phục phiếu giảm giá');
        },
    });
    const onSubmit = (values: VoucherFormValues) => {
        const data: Partial<IVoucher> = {
            voucher_name: values.voucher_name,
            voucher_type: values.voucher_type,
            expiry_date: values.expiry_date,
            quantity_remain: values.quantity_remain,
            discount: values.discount,
            type_discount: values.type_discount,
            apply_for: values.apply_for,
            status: values.status,
        };

        // Only include voucher_code for non-create modes or if it's provided
        if (mode !== 'create' || values.voucher_code) {
            data.voucher_code = values.voucher_code;
        }

        console.log('Submitting data:', data);

        if (mode === 'create') {
            createMutation.mutate(data);
        } else if (mode === 'edit' && voucherId) {
            updateMutation.mutate(data);
        } else if (mode === 'delete' && voucherId) {
            deleteMutation.mutate(voucherId);
        } else if (mode === 'restore' && voucherId) {
            restoreMutation.mutate(voucherId);
        }
    };

    const getDialogTitle = () => {
        switch (mode) {
            case 'create':
                return 'Thêm phiếu giảm giá mới';
            case 'edit':
                return 'Chỉnh sửa phiếu giảm giá';
            case 'delete':
                return 'Xóa phiếu giảm giá';
            case 'restore':
                return 'Khôi phục phiếu giảm giá';
            default:
                return 'Chi tiết phiếu giảm giá';
        }
    };

    if (isLoadingVoucher) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Đang tải...</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-6">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className={`grid gap-4 ${mode === 'create' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            <FormField
                                control={form.control}
                                name="voucher_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên phiếu giảm giá</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập tên phiếu giảm giá"
                                                {...field}
                                                disabled={mode === 'view'}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {mode !== 'create' && (
                                <FormField
                                    control={form.control}
                                    name="voucher_code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mã phiếu giảm giá</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập mã phiếu giảm giá"
                                                    {...field}
                                                    disabled={mode === 'view'}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="voucher_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại phiếu giảm giá</FormLabel>
                                        <Select
                                            disabled={mode === 'view'}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn loại phiếu giảm giá" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="discount">Giảm giá</SelectItem>
                                                <SelectItem value="freeship">Miễn phí vận chuyển</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="apply_for"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Áp dụng cho</FormLabel>
                                        <Select
                                            disabled={mode === 'view'}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn đối tượng áp dụng" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                                                <SelectItem value="category">Danh mục</SelectItem>
                                                <SelectItem value="product">Sản phẩm cụ thể</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá trị giảm giá</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Nhập giá trị giảm giá"
                                                {...field}
                                                disabled={mode === 'view'}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type_discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại giảm giá</FormLabel>
                                        <Select
                                            disabled={mode === 'view'}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn loại giảm giá" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="percent">Phần trăm (%)</SelectItem>
                                                <SelectItem value="amount">Số tiền cụ thể</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="expiry_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày hết hạn</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={
                                                    field.value ? new Date(field.value).toISOString().split('T')[0] : ''
                                                }
                                                onChange={(e) => {
                                                    field.onChange(e.target.value ? new Date(e.target.value) : null);
                                                }}
                                                disabled={mode === 'view'}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantity_remain"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số lượng</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Nhập số lượng phiếu giảm giá"
                                                {...field}
                                                disabled={mode === 'view'}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trạng thái</FormLabel>
                                    <Select
                                        disabled={mode === 'view'}
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        defaultValue={field.value.toString()}
                                        value={field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Kích hoạt</SelectItem>
                                            <SelectItem value="0">Không kích hoạt</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                variant="outline"
                                disabled={mode === 'view'}
                            >
                                Đóng
                            </Button>

                            {mode === 'create' && (
                                <Button type="submit" disabled={createMutation.isPending}>
                                    Thêm phiếu giảm giá
                                    {createMutation.isPending && <Loader className="ml-2 h-4 w-4 animate-spin" />}
                                </Button>
                            )}

                            {mode === 'edit' && (
                                <Button type="submit" disabled={updateMutation.isPending}>
                                    Cập nhật phiếu giảm giá
                                    {updateMutation.isPending && <Loader className="ml-2 h-4 w-4 animate-spin" />}
                                </Button>
                            )}

                            {mode === 'delete' && (
                                <Button type="submit" disabled={deleteMutation.isPending}>
                                    Xóa phiếu giảm giá
                                    {deleteMutation.isPending && <Loader className="ml-2 h-4 w-4 animate-spin" />}
                                </Button>
                            )}

                            {mode === 'restore' && (
                                <Button type="submit" disabled={restoreMutation.isPending}>
                                    Khôi phục phiếu giảm giá
                                    {restoreMutation.isPending && <Loader className="ml-2 h-4 w-4 animate-spin" />}
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
