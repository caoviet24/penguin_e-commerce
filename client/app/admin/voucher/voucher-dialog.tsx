'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { voucherService } from '@/services/voucher.service';
import { IVoucher } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface VoucherDialogProps {
    voucherId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function VoucherDialog({ voucherId, open, onOpenChange }: VoucherDialogProps) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IVoucher>();

    // Fetch voucher details
    const {
        data: voucher,
        isLoading,
        isError,
    } = useQuery<IVoucher>({
        queryKey: ['voucher', voucherId],
        queryFn: () => voucherService.getById(voucherId as string),
        enabled: !!voucherId && open,
    });

    // Reset form when voucher data changes
    useEffect(() => {
        if (voucher) {
            reset(voucher);
        }
    }, [voucher, reset]);

    const onSubmit = async (data: IVoucher) => {
        try {
            await voucherService.update(voucherId as string, data);
            toast.success('Cập nhật phiếu giảm giá thành công');
            queryClient.invalidateQueries({ queryKey: ['voucher', voucherId] });
            queryClient.invalidateQueries({ queryKey: ['vouchers'] });
            setIsEditing(false);
        } catch {
            toast.error('Có lỗi xảy ra khi cập nhật phiếu giảm giá');
        }
    };

    const handleDialogClose = () => {
        setIsEditing(false);
        onOpenChange(false);
    };

    // Get badge color based on voucher type
    const getVoucherTypeBadge = (type: string) => {
        switch (type.toLowerCase()) {
            case 'freeship':
                return 'bg-green-100 text-green-800';
            case 'discount':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format discount value
    const formatDiscount = (voucher: IVoucher) => {
        if (!voucher) return '';

        if (voucher.type_discount === 'percent') {
            return `${voucher.discount}%`;
        } else {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.discount);
        }
    };

    // Format date for display
    const formatDate = (date: Date) => {
        if (!date) return 'N/A';
        try {
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(date);
        } catch {
            return 'Invalid Date';
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Chỉnh sửa phiếu giảm giá' : 'Thông tin phiếu giảm giá'}</DialogTitle>
                </DialogHeader>

                {isLoading && <div className="py-8 text-center">Đang tải...</div>}
                {isError && (
                    <div className="py-8 text-center text-red-500">
                        Có lỗi xảy ra khi tải thông tin phiếu giảm giá. Vui lòng thử lại.
                    </div>
                )}

                {voucher && !isLoading && !isError && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6 py-4">
                            {/* Basic Info Section */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Thông tin cơ bản</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tên phiếu giảm giá</label>
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    {...register('voucher_name', {
                                                        required: 'Tên không được để trống',
                                                    })}
                                                    className="w-full"
                                                />
                                                {errors.voucher_name && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.voucher_name.message}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                {voucher.voucher_name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Mã phiếu giảm giá</label>
                                        <div className="py-2 px-3 border rounded-md bg-gray-50 font-mono">
                                            {voucher.voucher_code}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Loại phiếu giảm giá</label>
                                        {isEditing ? (
                                            <>
                                                <select
                                                    {...register('voucher_type', {
                                                        required: 'Loại không được để trống',
                                                    })}
                                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                                                >
                                                    <option value="discount">Giảm giá</option>
                                                    <option value="freeship">Miễn phí vận chuyển</option>
                                                </select>
                                                {errors.voucher_type && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.voucher_type.message}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getVoucherTypeBadge(
                                                        voucher.voucher_type,
                                                    )}`}
                                                >
                                                    {voucher.voucher_type === 'freeship'
                                                        ? 'Miễn phí vận chuyển'
                                                        : 'Giảm giá'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Trạng thái</label>
                                        {isEditing ? (
                                            <>
                                                <select
                                                    {...register('status', {
                                                        required: 'Trạng thái không được để trống',
                                                    })}
                                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                                                >
                                                    <option value={1}>Kích hoạt</option>
                                                    <option value={0}>Không kích hoạt</option>
                                                </select>
                                                {errors.status && (
                                                    <p className="text-sm text-red-500">{errors.status.message}</p>
                                                )}
                                            </>
                                        ) : (
                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        voucher.status === 1
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {voucher.status === 1 ? 'Kích hoạt' : 'Không kích hoạt'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Discount Section */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Thông tin giảm giá</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Giá trị</label>
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    type="number"
                                                    {...register('discount', {
                                                        required: 'Giá trị không được để trống',
                                                        min: { value: 1, message: 'Giá trị phải lớn hơn 0' },
                                                    })}
                                                    className="w-full"
                                                />
                                                {errors.discount && (
                                                    <p className="text-sm text-red-500">{errors.discount.message}</p>
                                                )}
                                            </>
                                        ) : (
                                            <div className="py-2 px-3 border rounded-md bg-gray-50 font-medium">
                                                {formatDiscount(voucher)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Loại giảm giá</label>
                                        {isEditing ? (
                                            <>
                                                <select
                                                    {...register('type_discount', {
                                                        required: 'Loại giảm giá không được để trống',
                                                    })}
                                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                                                >
                                                    <option value="percent">Phần trăm (%)</option>
                                                    <option value="amount">Số tiền cố định</option>
                                                </select>
                                                {errors.type_discount && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.type_discount.message}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                {voucher.type_discount === 'percent'
                                                    ? 'Phần trăm (%)'
                                                    : 'Số tiền cố định'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Usage Section */}
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">Thông tin sử dụng</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Ngày hết hạn</label>
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    type="datetime-local"
                                                    {...register('expiry_date', {
                                                        required: 'Ngày hết hạn không được để trống',
                                                    })}
                                                    className="w-full"
                                                />
                                                {errors.expiry_date && (
                                                    <p className="text-sm text-red-500">{errors.expiry_date.message}</p>
                                                )}
                                            </>
                                        ) : (
                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                {formatDate(new Date(voucher.expiry_date))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Áp dụng cho</label>
                                        {isEditing ? (
                                            <>
                                                <Input {...register('apply_for')} className="w-full" />
                                            </>
                                        ) : (
                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                {voucher.apply_for || 'Tất cả'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Số lượng còn lại</label>
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    type="number"
                                                    {...register('quantity_remain', {
                                                        required: 'Số lượng không được để trống',
                                                        min: { value: 0, message: 'Số lượng không được âm' },
                                                    })}
                                                    className="w-full"
                                                />
                                                {errors.quantity_remain && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.quantity_remain.message}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                {voucher.quantity_remain}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Số lượng đã sử dụng</label>
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                                            {voucher.quantity_used}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">ID Người tạo</label>
                                    <div className="py-2 px-3 border rounded-md bg-gray-50 font-mono text-sm">
                                        {voucher.created_by}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            {isEditing ? (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            reset(voucher);
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button type="submit">Lưu thay đổi</Button>
                                </>
                            ) : (
                                <>
                                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                                        Đóng
                                    </Button>
                                    <Button type="button" onClick={() => setIsEditing(true)}>
                                        Chỉnh sửa
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
