'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/services/account.service';
import { IAccount } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AccountDialogProps {
    accountId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AccountDialog({ accountId, open, onOpenChange }: AccountDialogProps) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IAccount>();

    const {
        data: account,
        isLoading,
        isError,
    } = useQuery<IAccount>({
        queryKey: ['account', accountId],
        queryFn: () => accountService.getById(accountId as string),
        enabled: !!accountId && open,
    });


    useEffect(() => {
        if (account) {
            reset(account);
        }
    }, [account, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: Partial<IAccount>) => accountService.updateAccount(accountId as string, data),
        onSuccess: () => {
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['account', accountId] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            setIsEditing(false);
            onOpenChange(false);
        },
    });
    const formatDate = (dateString: Date | undefined) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
                .toString()
                .padStart(2, '0')}/${date.getFullYear()}`;
        } catch {
            return 'Invalid Date';
        }
    };

    const onSubmit = (data: IAccount) => {
        updateMutation.mutate(data);
    };

    const handleDialogClose = () => {
        setIsEditing(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Chỉnh sửa thông tin tài khoản' : 'Thông tin tài khoản'}</DialogTitle>
                </DialogHeader>

                {isLoading && <div className="py-8 text-center">Đang tải...</div>}
                {isError && (
                    <div className="py-8 text-center text-red-500">
                        Có lỗi xảy ra khi tải thông tin tài khoản. Vui lòng thử lại.
                    </div>
                )}

                {account && !isLoading && !isError && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6 py-4">
                            {/* Avatar and basic info */}
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage
                                        src={account.avatar || '/default-avatar.png'}
                                        alt={account.full_name}
                                    />
                                    <AvatarFallback>
                                        {account.full_name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{account.full_name}</h3>
                                    <p className="text-sm text-gray-500">@{account.username}</p>
                                </div>
                            </div>

                            {/* Account Details Form */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Họ và tên</label>
                                    {isEditing ? (
                                        <Input
                                            {...register('full_name', { required: 'Bắt buộc' })}
                                            className="w-full"
                                        />
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                                            {account.full_name}
                                        </div>
                                    )}
                                    {errors.full_name && (
                                        <p className="text-sm text-red-500">{errors.full_name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Biệt danh</label>
                                    {isEditing ? (
                                        <Input {...register('nick_name')} className="w-full" />
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                                            {account.nick_name || 'Không có'}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tên người dùng</label>
                                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                                        {account.username}
                                        <input type="hidden" {...register('username')} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Vai trò</label>
                                    {isEditing ? (
                                        <select
                                            {...register('role', { required: 'Bắt buộc' })}
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                                        >
                                            <option value="User">User</option>
                                            <option value="Saler">Saler</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    account.role === 'Admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : account.role === 'Saler'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}
                                            >
                                                {account.role}
                                            </span>
                                        </div>
                                    )}
                                    {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Giới tính</label>
                                    {isEditing ? (
                                        <select
                                            {...register('gender')}
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                                        >
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                                            {account.gender || 'Không có'}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ngày sinh</label>
                                    {isEditing ? (
                                        <Input type="date" {...register('birth')} className="w-full" />
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                                            {formatDate(account.birth)}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Số điện thoại</label>
                                    {isEditing ? (
                                        <Input
                                            {...register('phone', {
                                                pattern: {
                                                    value: /^[0-9]{10,11}$/,
                                                    message: 'Số điện thoại không hợp lệ',
                                                },
                                            })}
                                            className="w-full"
                                        />
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                                            {account.phone || 'Không có'}
                                        </div>
                                    )}
                                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium">Địa chỉ</label>
                                    {isEditing ? (
                                        <Input {...register('address')} className="w-full" />
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                                            {account.address || 'Không có'}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ngày tạo</label>
                                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                                        {formatDate(account.created_at)}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cập nhật lần cuối</label>
                                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                                        {formatDate(account.updated_at)}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Trạng thái</label>
                                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                                        {account.is_banned ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                Bị cấm
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                Hoạt động
                                            </span>
                                        )}
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
                                            reset(account);
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button type="submit" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </Button>
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
