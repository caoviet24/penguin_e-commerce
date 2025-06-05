'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { boothService } from '@/services/booth.service';
import { IBooth } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/format-date';

interface ShopDialogProps {
    mode: 'view' | 'ban' | 'unban' | 'active' | 'unactive' | 'delete' | 'restore';
    shopId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function ShopDialog({ mode, shopId, open, onOpenChange }: ShopDialogProps) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IBooth>();

    const fetchShop = useCallback(() => boothService.getById(shopId as string), [shopId]);

    const {
        data: shop,
        isLoading,
        isError,
    } = useQuery<IBooth>({
        queryKey: ['shop', shopId],
        queryFn: fetchShop,
        enabled: !!shopId && open,
    });

    useEffect(() => {
        if (shop) {
            reset(shop);
        }
    }, [shop, reset]);

    const handleMutationSuccess = useCallback(
        (message: string) => {
            toast.success(message);
            queryClient.invalidateQueries({ queryKey: ['shops'] });
            onOpenChange(false);
        },
        [queryClient, onOpenChange],
    );

    // Define mutation functions with useCallback
    const updateShopFn = useCallback(
        (data: IBooth) =>
            boothService.update({
                id: shopId as string,
                name: data.name,
                description: data.description,
                avatar: data.avatar,
            }),
        [shopId],
    );

    const banShopFn = useCallback((id: string) => boothService.ban(id), []);
    const unbanShopFn = useCallback((id: string) => boothService.unban(id), []);
    const activateShopFn = useCallback((id: string) => boothService.active(id), []);
    const deactivateShopFn = useCallback((id: string) => boothService.inactive(id), []);
    const deleteShopFn = useCallback((id: string) => boothService.deleteSoft(id), []);
    const restoreShopFn = useCallback((id: string) => boothService.restore(id), []);

    // Create mutations
    const updateMutation = useMutation({
        mutationKey: ['updateShop'],
        mutationFn: updateShopFn,
        onSuccess: () => handleMutationSuccess('Cập nhật cửa hàng thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi cập nhật cửa hàng');
        },
    });

    const banMutation = useMutation({
        mutationKey: ['banShop'],
        mutationFn: banShopFn,
        onSuccess: () => handleMutationSuccess('Đã cấm cửa hàng thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi cấm cửa hàng');
        },
    });

    const unbanMutation = useMutation({
        mutationKey: ['unbanShop'],
        mutationFn: unbanShopFn,
        onSuccess: () => handleMutationSuccess('Đã bỏ cấm cửa hàng thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi bỏ cấm cửa hàng');
        },
    });

    const activateMutation = useMutation({
        mutationKey: ['activateShop'],
        mutationFn: activateShopFn,
        onSuccess: () => handleMutationSuccess('Đã kích hoạt cửa hàng thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi kích hoạt cửa hàng');
        },
    });

    const deactivateMutation = useMutation({
        mutationKey: ['deactivateShop'],
        mutationFn: deactivateShopFn,
        onSuccess: () => handleMutationSuccess('Đã hủy kích hoạt cửa hàng thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi hủy kích hoạt cửa hàng');
        },
    });

    const deleteMutation = useMutation({
        mutationKey: ['deleteShop'],
        mutationFn: deleteShopFn,
        onSuccess: () => handleMutationSuccess('Đã xóa cửa hàng thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi xóa cửa hàng');
        },
    });

    const restoreMutation = useMutation({
        mutationKey: ['restoreShop'],
        mutationFn: restoreShopFn,
        onSuccess: () => handleMutationSuccess('Đã khôi phục cửa hàng thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi khôi phục cửa hàng');
        },
    });


    const onSubmit = useCallback(() => {
        if (mode === 'view' && isEditing && shop) {
            updateMutation.mutate(shop);
        } else if (mode === 'ban') {
            banMutation.mutate(shopId as string);
        } else if (mode === 'unban') {
            unbanMutation.mutate(shopId as string);
        } else if (mode === 'active') {
            activateMutation.mutate(shopId as string);
        } else if (mode === 'unactive') {
            deactivateMutation.mutate(shopId as string);
        } else if (mode === 'delete') {
            deleteMutation.mutate(shopId as string);
        } else if (mode === 'restore') {
            restoreMutation.mutate(shopId as string);
        }
    }, [
        mode,
        isEditing,
        shop,
        shopId,
        updateMutation,
        banMutation,
        unbanMutation,
        activateMutation,
        deactivateMutation,
        deleteMutation,
        restoreMutation,
    ]);

    const handleDialogClose = useCallback(() => {
        setIsEditing(false);
        onOpenChange(false);
    }, [onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'view' && isEditing && 'Chỉnh sửa thông tin cửa hàng'}
                        {mode === 'view' && !isEditing && 'Thông tin cửa hàng'}
                        {mode === 'ban' && 'Cấm cửa hàng'}
                        {mode === 'unban' && 'Bỏ cấm cửa hàng'}
                        {mode === 'active' && 'Kích hoạt cửa hàng'}
                        {mode === 'unactive' && 'Hủy kích hoạt cửa hàng'}
                        {mode === 'delete' && 'Xóa cửa hàng'}
                        {mode === 'restore' && 'Khôi phục cửa hàng'}
                    </DialogTitle>
                </DialogHeader>

                {isLoading && <div className="py-8 text-center">Đang tải...</div>}
                {isError && (
                    <div className="py-8 text-center text-red-500">
                        Có lỗi xảy ra khi tải thông tin cửa hàng. Vui lòng thử lại.
                    </div>
                )}

                {shop && !isLoading && !isError && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6 py-4">
                            {/* Avatar and basic info */}
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={shop.avatar || '/default-avatar.png'} alt={shop.name} />
                                    <AvatarFallback>{shop.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{shop.name}</h3>
                                    <p className="text-sm text-gray-500">ID: {shop.id.substring(0, 8)}...</p>
                                </div>
                            </div>

                            {/* Shop Details Form */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium">Tên cửa hàng</label>
                                    {isEditing ? (
                                        <Input {...register('name', { required: 'Bắt buộc' })} className="w-full" />
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">{shop.name}</div>
                                    )}
                                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium">Mô tả</label>
                                    {isEditing ? (
                                        <textarea
                                            {...register('description')}
                                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                                        />
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50 min-h-[60px]">
                                            {shop.description || 'Không có mô tả'}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Trạng thái hoạt động</label>
                                    {isEditing ? (
                                        <select
                                            {...register('is_active')}
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                                        >
                                            <option value="true">Đang hoạt động</option>
                                            <option value="false">Không hoạt động</option>
                                        </select>
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                                            {shop.is_active ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                    Đang hoạt động
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                                    Không hoạt động
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Trạng thái cấm</label>
                                    {isEditing ? (
                                        <select
                                            {...register('is_banned')}
                                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                                        >
                                            <option value="false">Không bị cấm</option>
                                            <option value="true">Bị cấm</option>
                                        </select>
                                    ) : (
                                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                                            {shop.is_banned ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                    Bị cấm
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                    Không bị cấm
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ngày tạo</label>
                                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                                        {formatDate(shop.created_at)}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cập nhật lần cuối</label>
                                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                                        {formatDate(shop.updated_at)}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Người tạo</label>
                                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                                        {shop.created_by || 'Không có thông tin'}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Người cập nhật</label>
                                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                                        {shop.updated_by || 'Không có thông tin'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            {mode === 'view' && isEditing && (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            reset(shop);
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button type="submit" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </Button>
                                </>
                            )}

                            {mode === 'view' && !isEditing && (
                                <>
                                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                                        Đóng
                                    </Button>
                                    <Button type="button" onClick={() => setIsEditing(true)}>
                                        Chỉnh sửa
                                    </Button>
                                </>
                            )}

                            {mode === 'ban' && (
                                <>
                                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={banMutation.isPending}
                                    >
                                        {banMutation.isPending ? 'Đang xử lý...' : 'Xác nhận cấm'}
                                    </Button>
                                </>
                            )}

                            {mode === 'unban' && (
                                <>
                                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={unbanMutation.isPending}
                                    >
                                        {unbanMutation.isPending ? 'Đang xử lý...' : 'Xác nhận bỏ cấm'}
                                    </Button>
                                </>
                            )}

                            {mode === 'active' && (
                                <>
                                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={activateMutation.isPending}
                                    >
                                        {activateMutation.isPending ? 'Đang xử lý...' : 'Xác nhận kích hoạt'}
                                    </Button>
                                </>
                            )}

                            {mode === 'unactive' && (
                                <>
                                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-yellow-600 hover:bg-yellow-700"
                                        disabled={deactivateMutation.isPending}
                                    >
                                        {deactivateMutation.isPending ? 'Đang xử lý...' : 'Xác nhận hủy kích hoạt'}
                                    </Button>
                                </>
                            )}

                            {mode === 'delete' && (
                                <>
                                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={deleteMutation.isPending}
                                    >
                                        {deleteMutation.isPending ? 'Đang xử lý...' : 'Xác nhận xóa'}
                                    </Button>
                                </>
                            )}

                            {mode === 'restore' && (
                                <>
                                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={restoreMutation.isPending}
                                    >
                                        {restoreMutation.isPending ? 'Đang xử lý...' : 'Xác nhận khôi phục'}
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

export default memo(ShopDialog);
