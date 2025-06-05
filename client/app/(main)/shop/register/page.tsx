/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useRef } from 'react';
import { ImFilePicture } from 'react-icons/im';
import Loader from '@/components/Loader/loader';
import { boothService, ICreateBoothPayload } from '@/services/booth.service';
import { toast, ToastContainer } from 'react-toastify';
import { BiCheck } from 'react-icons/bi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadService } from '@/services/upload.service';
import { useUser } from '@/hooks/useAuth';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/format-date';
import { useRouter } from 'next/navigation';
import RenderWithCondition from '@/components/RenderWithCondition/renderwithcondition';
import { Loader2 } from 'lucide-react';

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
    const [imagePreview, setImagePreview] = React.useState<string>();
    const router = useRouter();

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

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChooseImage = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const uploadMutation = useMutation({
        mutationKey: ['upload'],
        mutationFn: (file: File) => uploadService.uploadImage(file),
    });

    const handleGetImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        form.setValue('avatar', '');

        if (file) {
            setImagePreview(URL.createObjectURL(file));
            uploadMutation.mutate(file, {
                onSuccess: (url) => {
                    setImagePreview(undefined);
                    form.setValue('avatar', url);
                },
            });
        }
    };

    const createShopMutation = useMutation({
        mutationKey: ['create-booth'],
        mutationFn: (data: ICreateBoothPayload) => boothService.create(data),
    });

    const onSubmit = (values: FormValues) => {
        const payload: ICreateBoothPayload = {
            name: values.name,
            description: values.description,
            avatar: values.avatar || '',
        };

        createShopMutation.mutate(payload, {
            onSuccess: () => {
                toast.success('Gửi yêu cầu đăng ký thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                queryClient.invalidateQueries({ queryKey: ['get-booth-by-id', user?.id] });
                form.reset();
            },
            onError: () => {
                toast.error('Gửi yêu cầu đăng ký thất bại do tên cửa hàng đã được ai đó sử dụng', {
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

    const { data: boothData, isLoading: isFetchGetMyBoothPending, isSuccess } = useQuery({
        queryKey: ['get-booth-by-id', !!user?.id],
        queryFn: () => boothService.getByAccId(user?.id || ''),
        enabled: !!user?.id,
        retry: 2,
    });

    useEffect(() => {
        if(isSuccess && boothData) {
            if(boothData.is_active) {
                router.push('/shop/dashboard');
            }
        }
    }, [boothData, isSuccess]);

    return (
        <div className="container mx-auto py-10">
            <Card className="shadow-lg border-0">
                <CardHeader className="border-b bg-muted/40">
                    <CardTitle className="text-2xl font-bold">Trở thành người bán hàng của Penguin</CardTitle>
                    <CardDescription>Đăng ký cửa hàng của bạn và bắt đầu bán hàng ngay hôm nay</CardDescription>
                </CardHeader>

                <RenderWithCondition condition={isFetchGetMyBoothPending}>
                    <CardContent className="p-6 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
                        <span className="ml-2 text-lg">Đang tải thông tin cửa hàng...</span>
                    </CardContent>
                </RenderWithCondition>

                <RenderWithCondition condition={!isFetchGetMyBoothPending}>
                    <CardContent className="p-6">
                        {!boothData && (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">Tên cửa hàng</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nhập tên cửa hàng của bạn..."
                                                        className="h-11"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">
                                                    Giới thiệu về cửa hàng
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Mô tả về cửa hàng của bạn..."
                                                        rows={5}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="avatar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">
                                                    Ảnh đại diện cửa hàng
                                                </FormLabel>
                                                <div className="flex flex-col gap-4">
                                                    <Button
                                                        type="button"
                                                        onClick={handleChooseImage}
                                                        variant="outline"
                                                        className="w-fit flex items-center gap-2"
                                                    >
                                                        <svg
                                                            className="w-4 h-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                                                        </svg>
                                                        Chọn ảnh
                                                    </Button>
                                                    <input
                                                        ref={inputRef}
                                                        onChange={(e) => {
                                                            handleGetImage(e);
                                                        }}
                                                        type="file"
                                                        id="avatar"
                                                        className="hidden"
                                                    />

                                                    <div className="mt-2">
                                                        {imagePreview && (
                                                            <div className="relative w-[140px] h-[140px]">
                                                                <ShadcnAvatar className="w-[140px] h-[140px] blur-[2px]">
                                                                    <AvatarImage src={imagePreview} />
                                                                    <AvatarFallback>...</AvatarFallback>
                                                                </ShadcnAvatar>
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <Loader size="sm" />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {field.value && !imagePreview && (
                                                            <ShadcnAvatar className="w-[140px] h-[140px]">
                                                                <AvatarImage src={field.value} />
                                                                <AvatarFallback>Shop</AvatarFallback>
                                                            </ShadcnAvatar>
                                                        )}

                                                        {!imagePreview && !field.value && (
                                                            <div className="w-[140px] h-[140px] flex items-center justify-center bg-muted rounded-full">
                                                                <ImFilePicture
                                                                    size={70}
                                                                    className="text-muted-foreground/50"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="terms"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Khi trở thành người bán hàng của Penguin bạn cần đồng ý với{' '}
                                                        <a
                                                            href="#"
                                                            className="text-primary underline hover:text-primary/90"
                                                        >
                                                            các điều khoản và chính sách
                                                        </a>{' '}
                                                        của chúng tôi.
                                                    </FormLabel>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        )}

                        {/* Pending Shop State */}
                        {boothData && !boothData?.is_active && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <ShadcnAvatar className="w-20 h-20">
                                        <AvatarImage src={boothData.avatar} />
                                        <AvatarFallback>{boothData?.name?.charAt(0)}</AvatarFallback>
                                    </ShadcnAvatar>
                                    <div>
                                        <h3 className="text-xl font-semibold capitalize">{boothData?.name}</h3>
                                        <div className="flex items-center text-sm text-amber-600">
                                            <BiCheck size={20} />
                                            <p>Đang chờ xác nhận</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <p className="text-lg">
                                        Chúng tôi đã nhận được thông tin của bạn đăng kí cửa hàng
                                        <span className="font-bold"> {boothData.name} </span>
                                        vào ngày {formatDate(boothData.created_at)}
                                    </p>
                                    <p className="text-lg mt-4">
                                        Chúng tôi sẽ kiểm tra thông tin và thông báo cho bạn trong thời gian sớm nhất.
                                        Cảm ơn bạn đã đăng ký cửa hàng!
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </RenderWithCondition>

                <CardFooter className="flex justify-end border-t p-6 gap-3">
                    {boothData && boothData.is_banned && <Button variant="default">Liên hệ</Button>}

                    <Button onClick={form.handleSubmit(onSubmit)} type="submit">
                        Gửi yêu cầu đăng ký
                    </Button>
                </CardFooter>
            </Card>

            <ToastContainer />
        </div>
    );
}
