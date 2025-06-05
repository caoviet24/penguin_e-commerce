'use client';
import React from 'react';
import { boothService } from '@/services/booth.service';
import { toast, ToastContainer } from 'react-toastify';
import { BiCheck } from 'react-icons/bi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { RiOrderPlayFill } from 'react-icons/ri';
import { useUser } from '@/hooks/useAuth';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import ProductsOfBooth from './ProductsOfBooth';
import { BadgePlus } from 'lucide-react';
import CreateProductDialog from './CreateProductDialog';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Tên cửa hàng phải có ít nhất 2 ký tự' }),
    description: z.string().min(10, { message: 'Giới thiệu cửa hàng phải có ít nhất 10 ký tự' }),
    avatar: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
        message: 'Bạn phải đồng ý với điều khoản và chính sách',
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
    const { user } = useUser();
    const [isEdit, setIsEdit] = React.useState(false);
    const [openCreateProduct, setOpenCreateProduct] = React.useState(false);

    const queryClient = useQueryClient();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            avatar: '',
            terms: false,
        },
    });

    const handleEditShop = () => {
        setIsEdit(true);
        form.reset({
            name: boothData?.name || '',
            description: boothData?.description || '',
            avatar: boothData?.avatar || '',
        });
    };

    const cancelRegisterMutation = useMutation({
        mutationKey: ['cancel-register-shop'],
        mutationFn: () => boothService.inactive(boothData?.id || ''),
    });

    const handleCancelRegisterShop = () => {
        cancelRegisterMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success('Hủy đăng ký cửa hàng thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                queryClient.invalidateQueries({ queryKey: ['get-booth-by-id', user?.id] });
            },
            onError: () => {
                toast.error('Hủy đăng ký cửa hàng thất bại', {
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

    const { data: boothData } = useQuery({
        queryKey: ['get-booth-by-id', !!user?.id],
        queryFn: () => boothService.getByAccId(user?.id || ''),
        enabled: !!user?.id,
        retry: 2,
    });

    return (
        <div className="container mx-auto py-10">
            <Card className="shadow-lg border-0">
                <CardHeader className="border-b bg-muted/40">
                    <CardTitle className="text-2xl font-bold">Trở thành người bán hàng của Penguin</CardTitle>
                    <CardDescription>Đăng ký cửa hàng của bạn và bắt đầu bán hàng ngay hôm nay</CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                    {boothData && boothData?.is_active && !boothData.is_banned && !isEdit && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <ShadcnAvatar className="w-20 h-20">
                                        <AvatarImage src={boothData.avatar} />
                                        <AvatarFallback>{boothData?.name?.charAt(0)}</AvatarFallback>
                                    </ShadcnAvatar>
                                    <div>
                                        <h3 className="text-xl font-semibold capitalize">{boothData.name}</h3>
                                        <div className="flex items-center text-sm text-green-600">
                                            <BiCheck size={20} />
                                            <p>Đã xác nhận</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link href="/shop/statistical" legacyBehavior>
                                        <Button variant="secondary" className="gap-2 w-full sm:w-auto">
                                            <FaArrowTrendUp size={18} />
                                            Xem thống kê cửa hàng
                                        </Button>
                                    </Link>
                                    <Link href="/shop/order" legacyBehavior>
                                        <Button className="gap-2 w-full sm:w-auto">
                                            <RiOrderPlayFill size={18} />
                                            Xem đơn hàng
                                        </Button>
                                    </Link>
                                    <Button
                                        className="gap-2 w-full sm:w-auto bg-yellow-500 text-white hover:bg-yellow-600 "
                                        onClick={() => setOpenCreateProduct(true)}
                                    >
                                        <BadgePlus />
                                        Thêm sản phẩm
                                    </Button>
                                </div>
                            </div>

                            <ProductsOfBooth boothId={boothData.id} />
                        </div>
                    )}

                    {/* Shop Banned */}
                    {boothData && boothData?.is_banned && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <ShadcnAvatar className="w-20 h-20">
                                    <AvatarImage src={boothData.avatar} />
                                    <AvatarFallback>{boothData?.name?.charAt(0)}</AvatarFallback>
                                </ShadcnAvatar>
                                <div>
                                    <h3 className="text-xl font-semibold capitalize">{boothData?.name}</h3>
                                </div>
                            </div>
                            <div className="bg-red-100 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold text-red-600">Cửa hàng của bạn đã bị khóa</h3>
                                <p className="text-lg mt-2">
                                    Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-end border-t p-6 gap-3">
                    {boothData && boothData.is_banned && <Button variant="default">Liên hệ</Button>}
                    {boothData && boothData?.name && !isEdit && (
                        <>
                            <Button onClick={handleEditShop} variant="outline">
                                {boothData.is_active ? 'Tạm đóng' : 'Sửa thông tin'}
                            </Button>
                            <Button onClick={handleCancelRegisterShop} variant="destructive">
                                Hủy đăng ký
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>

            <CreateProductDialog
                open={openCreateProduct}
                onOpenChange={setOpenCreateProduct}
                boothId={boothData?.id || ''}
            />

            <ToastContainer />
        </div>
    );
}
