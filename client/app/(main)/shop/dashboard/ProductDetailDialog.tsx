'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadService } from '@/services/upload.service';
import { UploadCloud, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
    ICreateProductDetailPayload,
    IUpdateProductDetailPayload,
    productDetailService,
} from '@/services/productdetail.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { IProductDetail } from '@/types';

interface CreateProductDetailDialogProps {
    mode: 'view' | 'create' | 'edit' | 'delete' | 'restore' | 'get-data';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId?: string;
    productDetail?: IProductDetail;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onGetData?: (data: any) => void;
}

const productDetailSchema = z.object({
    product_name: z.string().min(3, {
        message: 'Tên sản phẩm phải có ít nhất 3 ký tự',
    }),
    color: z.string().min(1, {
        message: 'Màu sắc không được để trống',
    }),
    size: z.string().min(1, {
        message: 'Kích thước không được để trống',
    }),
    sale_price: z.coerce.number().positive({
        message: 'Giá bán phải là số dương',
    }),
    promotional_price: z.coerce.number().nonnegative({
        message: 'Giá khuyến mãi phải là số không âm',
    }),
    stock_quantity: z.coerce.number().nonnegative({
        message: 'Số lượng tồn kho phải là số không âm',
    }),
    image: z.string().url({
        message: 'Vui lòng nhập đường dẫn hình ảnh hợp lệ',
    }),
});

type ProductDetailFormValues = z.infer<typeof productDetailSchema>;

export default function ProductDetailDialog({
    mode,
    open,
    onOpenChange,
    productId,
    productDetail,
    onGetData,
}: CreateProductDetailDialogProps) {
    const [previewImage, setPreviewImage] = useState('');
    const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [sizeInput, setSizeInput] = useState('');
    const [sizes, setSizes] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const form = useForm<ProductDetailFormValues>({
        resolver: zodResolver(productDetailSchema),
        defaultValues: {
            product_name: '',
            color: '',
            size: '',
            sale_price: 0,
            promotional_price: 0,
            stock_quantity: 0,
            image: '',
        },
    });

    useEffect(() => {
        if (open) {
            form.reset();
            setPreviewImage('');
            setImageTab('url');
            setSizes([]);
            setSizeInput('');
        }
    }, [open, form]);

    useEffect(() => {
        const sizeString = sizes.join(', ');
        form.setValue('size', sizeString);
        if (sizeString) {
            form.clearErrors('size');
        }
    }, [sizes, form]);

    const createProductDetailMutation = useMutation({
        mutationKey: ['create-product-detail'],
        mutationFn: (data: ICreateProductDetailPayload) => productDetailService.create(data),

        onSuccess: () => {
            toast.success('Thêm chi tiết sản phẩm thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            onOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ['get-product-by-id', productId] });
            form.reset();
            setPreviewImage('');
            setSizes([]);
            setSizeInput('');
            setImageTab('url');
        },
        onError: (error) => {
            console.error('Error creating product detail:', error);
            toast.error('Thêm chi tiết sản phẩm thất bại', {
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

    const updateProductDetailMutation = useMutation({
        mutationKey: ['update-product-detail'],
        mutationFn: (data: IUpdateProductDetailPayload) => productDetailService.update(data),
        onSuccess: () => {
            toast.success('Cập nhật chi tiết sản phẩm thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            onOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ['get-product-by-id', productId] });
            form.reset();
            setPreviewImage('');
            setSizes([]);
            setSizeInput('');
            setImageTab('url');
        },
        onError: (error) => {
            console.error('Error updating product detail:', error);
            toast.error('Cập nhật chi tiết sản phẩm thất bại', {
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

    const deleteProductDetailMutation = useMutation({
        mutationKey: ['delete-product-detail'],
        mutationFn: (id: string) => productDetailService.deleteSoft(id),
        onSuccess: () => {
            toast.success('Xóa chi tiết sản phẩm thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            onOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ['get-product-by-id', productId] });
            form.reset();
            setPreviewImage('');
            setSizes([]);
            setSizeInput('');
            setImageTab('url');
        },
        onError: (error) => {
            console.error('Error deleting product detail:', error);
            toast.error('Xóa chi tiết sản phẩm thất bại', {
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

    const restoreProductDetailMutation = useMutation({
        mutationKey: ['restore-product-detail'],
        mutationFn: (id: string) => productDetailService.restore(id),
        onSuccess: () => {
            toast.success('Khôi phục chi tiết sản phẩm thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            onOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ['get-product-by-id', productId] });
            form.reset();
            setPreviewImage('');
            setSizes([]);
            setSizeInput('');
            setImageTab('url');
        },
        onError: (error) => {
            console.error('Error restoring product detail:', error);
            toast.error('Khôi phục chi tiết sản phẩm thất bại', {
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

    const onSubmit = async (values: ProductDetailFormValues) => {
        const payload = {
            product_name: values.product_name,
            color: values.color,
            sizes: sizes,
            sale_price: values.sale_price,
            promotional_price: values.promotional_price,
            stock_quantity: values.stock_quantity,
            image: values.image,
        };

        if (mode === 'get-data' && onGetData) {
            onGetData(payload);
            onOpenChange(false);
            form.reset();
            setPreviewImage('');
            setSizes([]);
            setSizeInput('');
            setImageTab('url');
            return;
        }

        if (mode === 'create') {
            createProductDetailMutation.mutate({
                ...payload,
                product_id: productId,
            } as ICreateProductDetailPayload);
        } else if (mode === 'edit' && productDetail) {
            updateProductDetailMutation.mutate({
                ...payload,
                id: productDetail.id,
            } as IUpdateProductDetailPayload);
        } else if (mode === 'delete' && productDetail) {
            deleteProductDetailMutation.mutate(productDetail.id);
        } else if (mode === 'restore' && productDetail) {
            restoreProductDetailMutation.mutate(productDetail.id);
        }
    };

    const uploadMutation = useMutation({
        mutationKey: ['upload-image'],
        mutationFn: (file: File) => uploadService.uploadImage(file),
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit');
            return;
        }

        setPreviewImage(URL.createObjectURL(file));

        uploadMutation.mutate(file, {
            onSuccess: (url) => {
                form.setValue('image', url);
                setPreviewImage(url);
                setImageTab('url');
            },
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const addSize = () => {
        if (sizeInput.trim()) {
            setSizes((prev) => [...prev, sizeInput.trim()]);
            setSizeInput('');
        }
    };

    const removeSize = (index: number) => {
        setSizes((prev) => prev.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSize();
        }
    };

    useEffect(() => {
        if (productDetail) {
            setPreviewImage(productDetail?.image);
            setSizes(productDetail.size.split(',') || []);
            setImageTab('url');
            setSizeInput('');
            form.reset({
                product_name: productDetail.product_name,
                color: productDetail.color,
                size: '',
                sale_price: productDetail.sale_price,
                promotional_price: productDetail.promotional_price,
                stock_quantity: productDetail.stock_quantity,
                image: productDetail.image,
            });
        }
    }, [form, productDetail]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {(mode === 'create' || mode === 'get-data') && 'Thêm chi tiết sản phẩm'}
                        {mode === 'edit' && 'Chỉnh sửa chi tiết sản phẩm'}
                        {mode === 'view' && 'Xem chi tiết sản phẩm'}
                        {mode === 'delete' && 'Xóa chi tiết sản phẩm'}
                        {mode === 'restore' && 'Khôi phục chi tiết sản phẩm'}
                    </DialogTitle>
                    <DialogDescription>
                        {(mode === 'create' || mode === 'get-data') && 'Vui lòng điền thông tin chi tiết sản phẩm.'}
                        {mode === 'edit' && 'Chỉnh sửa thông tin chi tiết sản phẩm.'}
                        {mode === 'view' && 'Xem thông tin chi tiết sản phẩm.'}
                        {mode === 'delete' && 'Bạn có chắc chắn muốn xóa chi tiết sản phẩm này?'}
                        {mode === 'restore' && 'Bạn có chắc chắn muốn khôi phục chi tiết sản phẩm này?'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="product_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên sản phẩm</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tên sản phẩm" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Màu sắc</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập màu sắc" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Size</FormLabel>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    value={sizeInput}
                                                    onChange={(e) => setSizeInput(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder="Enter size (e.g. 38)"
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={addSize}
                                                    className="h-10 w-10"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {sizes.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {sizes.map((size, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-muted px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                                                        >
                                                            {size}
                                                            <button
                                                                type="button"
                                                                className="text-muted-foreground hover:text-foreground"
                                                                onClick={() => removeSize(index)}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <input type="hidden" {...field} />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sale_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá bán</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Nhập giá bán" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="promotional_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá khuyến mãi</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Nhập giá khuyến mãi" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="stock_quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số lượng tồn kho</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Nhập số lượng tồn kho" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hình ảnh</FormLabel>
                                    <Tabs
                                        value={imageTab}
                                        onValueChange={(value: string) => setImageTab(value as 'url' | 'upload')}
                                        className="w-full"
                                    >
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="url">URL</TabsTrigger>
                                            <TabsTrigger value="upload">Upload</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="url" className="pt-2">
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập URL hình ảnh"
                                                    {...field}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                    disabled={uploadMutation.isPending}
                                                />
                                            </FormControl>
                                        </TabsContent>

                                        {!previewImage && (
                                            <TabsContent value="upload" className="pt-2">
                                                <div className="flex flex-col gap-2">
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                        className="hidden"
                                                    />
                                                    <div
                                                        className={cn(
                                                            'border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary',
                                                            uploadMutation.isPending &&
                                                                'opacity-50 pointer-events-none',
                                                        )}
                                                        onClick={triggerFileInput}
                                                    >
                                                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                                                        <div className="text-sm text-muted-foreground">
                                                            Click to select an image
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            PNG, JPG, WEBP up to 5MB
                                                        </div>
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </TabsContent>
                                        )}
                                    </Tabs>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {previewImage && (
                            <div className="mt-2 relative">
                                <Label>Xem trước</Label>
                                <div className="mt-1 border rounded-md p-2">
                                    <Image
                                        src={previewImage}
                                        alt="Preview"
                                        width={128}
                                        height={128}
                                        className=" object-cover rounded-md mx-auto"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-8 right-6 text-muted-foreground  z-50"
                                    >
                                        <X
                                            onClick={() => {
                                                setPreviewImage('');
                                                form.setValue('image', '');
                                                setImageTab('url');
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                        />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Hủy
                            </Button>
                            {mode === 'create' && (
                                <Button
                                    type="submit"
                                    disabled={createProductDetailMutation.isPending || uploadMutation.isPending}
                                >
                                    {createProductDetailMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                                </Button>
                            )}

                            {mode === 'get-data' && <Button type="submit">OK</Button>}

                            {mode === 'edit' && (
                                <Button
                                    type="submit"
                                    disabled={updateProductDetailMutation.isPending || uploadMutation.isPending}
                                >
                                    {updateProductDetailMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                                </Button>
                            )}

                            {mode === 'delete' && (
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={deleteProductDetailMutation.isPending}
                                >
                                    {deleteProductDetailMutation.isPending ? 'Đang xóa...' : 'Xóa'}
                                </Button>
                            )}

                            {mode === 'restore' && (
                                <Button
                                    type="submit"
                                    variant="default"
                                    disabled={restoreProductDetailMutation.isPending}
                                >
                                    {restoreProductDetailMutation.isPending ? 'Đang khôi phục...' : 'Khôi phục'}
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
