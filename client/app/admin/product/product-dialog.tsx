'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { IProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/format-date';
import { formatCurrency } from '@/utils/format-currency';
import Image from 'next/image';

interface ProductDialogProps {
    mode: 'view' | 'active' | 'inactive' | 'delete' | 'restore';
    productId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function ProductDialog({ mode, productId, open, onOpenChange }: ProductDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [activeVariant, setActiveVariant] = useState<number>(0);
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IProduct>();

    const fetchProduct = useCallback(
        () => productService.getById(productId as string),
        [productId]
    );

    const {
        data: product,
        isLoading,
        isError,
    } = useQuery<IProduct>({
        queryKey: ['product', productId],
        queryFn: fetchProduct,
        enabled: !!productId && open,
    });

    console.log('mode:', mode);
    

    
    const handleMutationSuccess = useCallback((message: string) => {
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: ['get-products'] });
        onOpenChange(false);
    }, [queryClient, onOpenChange]);


    const activeProductFn = useCallback((proId: string) => productService.active(proId), []);
    const inactiveProductFn = useCallback((proId: string) => productService.inactive(proId), []);
    const deleteProductFn = useCallback((proId: string) => productService.deleteSoft(proId), []);
    const restoreProductFn = useCallback((proId: string) => productService.restore(proId), []);

    const activeProductMutation = useMutation({
        mutationKey: ['activeProduct'],
        mutationFn: activeProductFn,
        onSuccess: () => handleMutationSuccess('Kích hoạt sản phẩm thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi kích hoạt sản phẩm');
        },
    });


    const inactiveProductMutation = useMutation({
        mutationKey: ['inactiveProduct'],
        mutationFn: inactiveProductFn,
        onSuccess: () => handleMutationSuccess('Vô hiệu hóa sản phẩm thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi vô hiệu hóa sản phẩm');
        },
    });

    const deleteProductMutation = useMutation({
        mutationKey: ['deleteProduct'],
        mutationFn: deleteProductFn,
        onSuccess: () => handleMutationSuccess('Xóa sản phẩm thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi xóa sản phẩm');
        },
    });

    const restoreProductMutation = useMutation({
        mutationKey: ['restoreProduct'],
        mutationFn: restoreProductFn,
        onSuccess: () => handleMutationSuccess('Khôi phục sản phẩm thành công'),
        onError: () => {
            toast.error('Có lỗi xảy ra khi khôi phục sản phẩm');
        },
    });

    useEffect(() => {
        if (product) {
            reset(product);
        }
    }, [product, reset]);

    const onSubmit = useCallback(() => {
        if (mode === 'active') {
            activeProductMutation.mutate(productId as string);
        } else if (mode === 'inactive') {
            inactiveProductMutation.mutate(productId as string);
        } else if (mode === 'delete') {
            deleteProductMutation.mutate(productId as string);
        } else if (mode === 'restore') {
            restoreProductMutation.mutate(productId as string);
        }
    }, [mode, productId, activeProductMutation, inactiveProductMutation, deleteProductMutation, restoreProductMutation]);

    const handleDialogClose = useCallback(() => {
        setIsEditing(false);
        onOpenChange(false);
    }, [onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'view' && isEditing && 'Chỉnh sửa sản phẩm'}
                        {mode === 'view' && !isEditing && 'Thông tin sản phẩm'}
                        {mode === 'active' && 'Kích hoạt sản phẩm'}
                        {mode === 'inactive' && 'Vô hiệu hóa sản phẩm'}
                        {mode === 'delete' && 'Xóa sản phẩm'}
                        {mode === 'restore' && 'Khôi phục sản phẩm'}
                    </DialogTitle>
                </DialogHeader>

                {isLoading && <div className="py-8 text-center">Đang tải...</div>}
                {isError && (
                    <div className="py-8 text-center text-red-500">
                        Có lỗi xảy ra khi tải thông tin sản phẩm. Vui lòng thử lại.
                    </div>
                )}

                {product && !isLoading && !isError && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Mô tả sản phẩm</label>
                                        {isEditing ? (
                                            <textarea
                                                {...register('product_desc', { required: 'Bắt buộc' })}
                                                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                                            />
                                        ) : (
                                            <div className="py-2 px-3 border rounded-md bg-gray-50 min-h-[60px]">
                                                {product.product_desc}
                                            </div>
                                        )}
                                        {errors.product_desc && (
                                            <p className="text-sm text-red-500">{errors.product_desc.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">ID Cửa hàng</label>
                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                {product.booth_id}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Trạng thái</label>
                                            {isEditing ? (
                                                <select
                                                    {...register('status')}
                                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                                                >
                                                    <option value="AVAILABLE">Có sẵn</option>
                                                    <option value="UNAVAILABLE">Không có sẵn</option>
                                                </select>
                                            ) : (
                                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            product.status === 'AVAILABLE'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {product.status === 'AVAILABLE' ? 'Có sẵn' : 'Không có sẵn'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Ngày tạo</label>
                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                {formatDate(product.created_at)}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Cập nhật lần cuối</label>
                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                {formatDate(product.updated_at)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Biến thể sản phẩm</h3>

                                {product.list_product_detail && product.list_product_detail.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {product.list_product_detail.map((variant, index) => (
                                                <button
                                                    key={variant.id}
                                                    type="button"
                                                    onClick={() => setActiveVariant(index)}
                                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                        activeVariant === index
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {variant.product_name.split(' ').slice(-2).join(' ')}
                                                </button>
                                            ))}
                                        </div>

                                        {product.list_product_detail[activeVariant] && (
                                            <div className="border rounded-md p-4 space-y-4">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="w-full sm:w-1/3">
                                                        <div className="aspect-square rounded-md overflow-hidden">
                                                            <Image
                                                                src={
                                                                    product.list_product_detail[activeVariant].image ||
                                                                    '/images/no-image.png'
                                                                }
                                                                alt="Product Image"
                                                                width={200}
                                                                height={200}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="w-full sm:w-2/3 space-y-3">
                                                        <div>
                                                            <label className="text-sm font-medium">Tên sản phẩm</label>
                                                            <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                                {
                                                                    product.list_product_detail[activeVariant]
                                                                        .product_name
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-sm font-medium">Màu sắc</label>
                                                                <div className="py-2 px-3 border rounded-md bg-gray-50 flex items-center gap-2">
                                                                    <div
                                                                        className="w-4 h-4 rounded-full border"
                                                                        style={{
                                                                            backgroundColor:
                                                                                product.list_product_detail[
                                                                                    activeVariant
                                                                                ].color.toLowerCase(),
                                                                        }}
                                                                    ></div>
                                                                    {product.list_product_detail[activeVariant].color}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="text-sm font-medium">
                                                                    Kích thước
                                                                </label>
                                                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                                    {product.list_product_detail[activeVariant].size}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-sm font-medium">Giá bán</label>
                                                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                                    {formatCurrency(
                                                                        product.list_product_detail[activeVariant]
                                                                            .sale_price,
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="text-sm font-medium">
                                                                    Giá khuyến mãi
                                                                </label>
                                                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                                    {formatCurrency(
                                                                        product.list_product_detail[activeVariant]
                                                                            .promotional_price,
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-sm font-medium">Tồn kho</label>
                                                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                                    {
                                                                        product.list_product_detail[activeVariant]
                                                                            .stock_quantity
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="text-sm font-medium">Đã bán</label>
                                                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                                                    {
                                                                        product.list_product_detail[activeVariant]
                                                                            .sale_quantity
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">Không có biến thể sản phẩm</div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            {mode === 'active' && !isEditing && (
                                <Button type="submit" className="ml-auto">
                                    Kích hoạt sản phẩm
                                </Button>
                            )}

                            {mode === 'inactive' && !isEditing && (
                                <Button type="submit" className="ml-auto">
                                    Vô hiệu hóa sản phẩm
                                </Button>
                            )}

                            {mode === 'delete' && !isEditing && (
                                <Button type="submit" className="ml-auto">
                                    Xóa sản phẩm
                                </Button>
                            )}

                            {mode === 'restore' && !isEditing && (
                                <Button type="submit" className="ml-auto">
                                    Khôi phục sản phẩm
                                </Button>
                            )}

                            {mode === 'view' && !isEditing && (
                                <Button type="button" onClick={() => setIsEditing(true)} className="ml-auto">
                                    Chỉnh sửa sản phẩm
                                </Button>
                            )}

                            <Button type="button" variant="outline" onClick={handleDialogClose} className="ml-auto">
                                Đóng
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default memo(ProductDialog);
