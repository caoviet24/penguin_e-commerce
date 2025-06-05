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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService, ICreateProductPayload } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import { toast } from 'react-toastify';
import { Loader, Plus } from 'lucide-react';
import { ICategoryDetail } from '@/types';
import ProductDetailDialog from './ProductDetailDialog';
import { ICreateProductDetailPayload } from '@/services/productdetail.service';
import Image from 'next/image';
import { BiMinusCircle } from 'react-icons/bi';
import { AxiosError } from 'axios';

interface CreateProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    boothId: string;
    onSuccess?: () => void;
}

const productSchema = z.object({
    booth_id: z.string().min(1, {
        message: 'Booth ID không được để trống',
    }),
    product_desc: z.string().min(3, {
        message: 'Mô tả sản phẩm phải có ít nhất 3 ký tự',
    }),
    category_detail_id: z.string().min(1, {
        message: 'Vui lòng chọn danh mục sản phẩm',
    }),
    list_product_detail: z.array(z.any()).nonempty(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function CreateProductDialog({ open, onOpenChange, boothId }: CreateProductDialogProps) {
    const [openProductDetailDialog, setOpenProductDetailDialog] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            booth_id: boothId,
            product_desc: '',
            category_detail_id: '',
            list_product_detail: [],
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                booth_id: boothId,
                product_desc: '',
                category_detail_id: '',
                list_product_detail: [],
            });
        }
    }, [open, form, boothId]);

    const { data: categories, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['get-categories'],
        queryFn: () => categoryService.getAll({ is_deleted: false }),
    });

    const createProductMutation = useMutation({
        mutationKey: ['create-product'],
        mutationFn: (data: ICreateProductPayload) => productService.create(data),
        onSuccess: () => {
            toast.success('Tạo sản phẩm thành công', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            queryClient.invalidateQueries({ queryKey: ['get-products-of-booth'] });
            onOpenChange(false);
            form.reset({
                booth_id: boothId,
                product_desc: '',
                category_detail_id: '',
                list_product_detail: [],
            });
        
        },
        onError: (error: AxiosError<{ error?: string }>) => {
            console.error('Error creating product:', error);
            toast.error(error.response?.data?.error || 'Có lỗi xảy ra khi tạo sản phẩm', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        },
    });

    // Handle form submission
    const onSubmit = async (values: ProductFormValues) => {
        console.log('Submitting product form with values:', values);

        createProductMutation.mutate({
            booth_id: boothId,
            product_desc: values.product_desc,
            category_detail_id: values.category_detail_id,
            list_product_detail: values.list_product_detail,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">Thêm sản phẩm mới</DialogTitle>
                    <DialogDescription>
                        Vui lòng điền thông tin sản phẩm và chọn danh mục. Bạn có thể thêm chi tiết sản phẩm sau.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form id="create-product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="product_desc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả sản phẩm</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập mô tả sản phẩm"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category_detail_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Danh mục</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn danh mục sản phẩm" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingCategories ? (
                                                <div className="flex items-center justify-center p-2">
                                                    <Loader className="h-4 w-4 animate-spin mr-2" />
                                                    <span>Đang tải...</span>
                                                </div>
                                            ) : (
                                                categories?.map((category) => (
                                                    <div key={category.id} className="px-2 py-1.5">
                                                        <div className="font-semibold text-sm">{category.name}</div>
                                                        {category.list_category_detail &&
                                                            category.list_category_detail.map(
                                                                (detail: ICategoryDetail) => (
                                                                    <SelectItem key={detail.id} value={detail.id}>
                                                                        {detail.name}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                    </div>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <div className="flex items-center justify-between border-b py-3 border-solid border-gray-300">
                                <p>Danh sách sản phẩm sẽ được hiển thị ở đây.</p>
                                <Button
                                    variant="ghost"
                                    className="bg-yellow-500 text-white hover:bg-yellow-600"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setOpenProductDetailDialog(true);
                                    }}
                                >
                                    <Plus className="mr-2" />
                                    Thêm chi tiết sản phẩm
                                </Button>
                            </div>

                            <div className="grid grid-cols-8 text-center border-b py-3 border-solid border-gray-300">
                                <p className="font-semibold">Ảnh</p>
                                <p className="font-semibold">Tên sản phẩm</p>
                                <p className="font-semibold">Giá bán</p>
                                <p className="font-semibold">Giá khuyến mại</p>
                                <p className="font-semibold">Màu sắc</p>
                                <p className="font-semibold">Số lượng</p>
                                <p className="font-semibold">Kích cỡ</p>
                                <p className="font-semibold">Thao tác</p>
                            </div>
                            <div className="flex flex-col gap-3 py-3">
                                {form.watch('list_product_detail')?.length > 0 &&
                                    form.watch('list_product_detail').map((pd, idx) => (
                                        <div key={idx} className="grid grid-cols-8 items-center text-center pr-2">
                                            <div className="flex items-center justify-center">
                                                <Image
                                                    src={pd.image || '/images/default-product.png'}
                                                    alt={pd.product_name}
                                                    width={50}
                                                    height={50}
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            <span>{pd.product_name}</span>
                                            <span>{pd.sale_price}</span>
                                            <span>{pd.promotional_price}</span>
                                            <span>{pd.color}</span>
                                            <span>{pd.stock_quantity}</span>
                                            <span>{pd.sizes.join(', ')}</span>
                                            <button
                                                className="flex items-center justify-center"
                                                onClick={() => {
                                                    const filtered = form
                                                        .watch('list_product_detail')
                                                        .filter((_, i) => i !== idx);
                                                    if (filtered.length > 0) {
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        form.setValue('list_product_detail', filtered as any);
                                                    } else {
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        form.setValue('list_product_detail', [] as any);
                                                    }
                                                }}
                                            >
                                                <BiMinusCircle
                                                    size={24}
                                                    className="bg-red-500 rounded-full text-white"
                                                />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                form="create-product-form"
                                onClick={() => {
                                    console.log('Submit button clicked');
                                    console.log('Form values:', form.getValues());
                                    console.log('Form errors:', form.formState.errors);
                                }}
                                disabled={createProductMutation.isPending}
                            >
                                {createProductMutation.isPending ? (
                                    <>
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    'Thêm mới'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

            <ProductDetailDialog
                open={openProductDetailDialog}
                onOpenChange={setOpenProductDetailDialog}
                mode="get-data"
                onGetData={(data: ICreateProductDetailPayload) => {
                    form.setValue('list_product_detail', [
                        ...form.watch('list_product_detail'),
                        {
                            product_name: data.product_name,
                            image: data.image,
                            sale_price: data.sale_price,
                            promotional_price: data.promotional_price,
                            stock_quantity: data.stock_quantity,
                            color: data.color,
                            sizes: data.sizes,
                        },
                    ]);
                }}
            />
        </Dialog>
    );
}
