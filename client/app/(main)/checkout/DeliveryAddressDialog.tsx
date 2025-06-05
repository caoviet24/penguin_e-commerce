'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { deliveryAddressService, ICreateDeliveryAddressPayload } from '@/services/deliveryAddress.service';
import { locationVNService } from '@/services/locationVN.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

interface DeliveryAddressDialogProps {
    mode: 'create' | 'edit';
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const deliveryAddressSchema = z.object({
    full_name: z.string().min(1, 'Tên người nhận không được để trống'),
    phone: z.string().min(1, 'Số điện thoại không được để trống'),
    address: z.string().min(1, 'Địa chỉ không được để trống'),
});

export default function DeliveryAddressDialog({ mode, open, onOpenChange }: DeliveryAddressDialogProps) {
    const [option, setOption] = useState(false);
    const [cities, setCities] = React.useState<{ code: string; name: string }[]>([]);
    const [districts, setDistricts] = React.useState<{ province_code: string; code: string; name: string }[]>([]);
    const [wards, setWards] = React.useState<{ district_code: string; code: string; name: string }[]>([]);
    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(deliveryAddressSchema),
        defaultValues: {
            full_name: '',
            phone: '',
            address: '',
        },
    });

    const getCurrentLocationMutation = useMutation({
        mutationFn: locationVNService.getCurrentLocation,
    });

    const handleGetCurrentLocation = async () => {
        const response = await getCurrentLocationMutation.mutateAsync();

        const { formatted_address } = response as {
            formatted_address: string;
        };

        form.setValue('address', formatted_address);
    };

    const handleOnChangeCity = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = e.target.value;
        if (!cityId) {
            setDistricts([]);
            setWards([]);
            form.setValue('address', '');
            return;
        }

        const city = cities.find((city) => city.code == cityId);
        form.setValue('address', `${city?.name}, `);

        const data = await locationVNService.getDistricts();
        if (data) {
            setDistricts(data.filter((district: { province_code: string }) => district.province_code == cityId));
        }
        setWards([]);
    };

    const handleOnChangeDistrict = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = e.target.value;
        if (!districtId) {
            setWards([]);
            const cityPart = form.getValues('address').split(',')[0];
            form.setValue('address', cityPart ? `${cityPart}, ` : '');
            return;
        }

        const district = districts.find((district) => district.code == districtId);
        const addressParts = form.getValues('address').split(',');
        if (addressParts.length >= 1) {
            form.setValue('address', `${addressParts[0]}, ${district?.name}, `);
        } else {
            form.setValue('address', `${district?.name}, `);
        }
        const data = await locationVNService.getWards();
        if (data) {
            setWards(data.filter((ward: { district_code: string }) => ward.district_code == districtId));
        }
    };

    const handleOnChangeWard = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardId = e.target.value;
        if (!wardId) {
            const addressParts = form.getValues('address').split(',');
            if (addressParts.length >= 2) {
                form.setValue('address', `${addressParts[0]}, ${addressParts[1]}, `);
            }
            return;
        }

        const ward = wards.find((ward) => ward.code == wardId);
        const addressParts = form.getValues('address').split(',');
        if (addressParts.length >= 2) {
            form.setValue('address', `${addressParts[0]}, ${addressParts[1]}, ${ward?.name}`);
        } else {
            form.setValue('address', `${form.getValues('address')} ${ward?.name}`);
        }
    };

    const createDeliveryAddressMutation = useMutation({
        mutationKey: ['createDeliveryAddress'],
        mutationFn: (data: ICreateDeliveryAddressPayload) => deliveryAddressService.create(data),
    });

    const onSubmit = (data: ICreateDeliveryAddressPayload) => {
        createDeliveryAddressMutation.mutate(data, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset({
                    full_name: '',
                    phone: '',
                    address: '',
                });
                toast.success('Thêm địa chỉ thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                queryClient.invalidateQueries({
                    queryKey: ['get-address-by-user-id'],
                });
            },
            onError: (error) => {
                console.error('Error creating delivery address:', error);
                toast.error('Thêm địa chỉ thất bại', {
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

    useEffect(() => {
        async function a() {
            const data = await locationVNService.getCities();
            if (data) {
                setCities(data);
            }
        }
        a();
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTitle>
                <span className="text-lg font-semibold">
                    {mode === 'create' ? 'Thêm địa chỉ mới' : 'Chỉnh sửa địa chỉ'}
                </span>
            </DialogTitle>
            <DialogContent>
                <div className="bg-white p-6 w-full max-w-[600px] rounded-lg shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Thêm địa chỉ mới</h3>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên người nhận</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Nhập tên người nhận"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Nhập số điện thoại"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Địa chỉ</FormLabel>
                                        <FormControl>
                                            <div>
                                                {option && (
                                                    <>
                                                        <select
                                                            onChange={handleOnChangeCity}
                                                            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <option value="">Chọn thành phố</option>
                                                            {cities.map((city) => (
                                                                <option key={city.code} value={city.code}>
                                                                    {city.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            className="w-full mt-2 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            onChange={handleOnChangeDistrict}
                                                        >
                                                            <option value="">Chọn quận/huyện</option>
                                                            {districts.map((district) => (
                                                                <option key={district.code} value={district.code}>
                                                                    {district.name}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <select
                                                            onChange={handleOnChangeWard}
                                                            className="w-full mt-2 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <option value="">Chọn phường/xã</option>
                                                            {wards.map((ward) => (
                                                                <option key={ward.code} value={ward.code}>
                                                                    {ward.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <br />
                                                    </>
                                                )}
                                                <Input
                                                    {...field}
                                                    placeholder="Nhập địa chỉ"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>

                    <div className="flex items-center justify-between my-5">
                        {!option && (
                            <button
                                onClick={handleGetCurrentLocation}
                                className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                {getCurrentLocationMutation.isPending ? (
                                    <span className="animate-spin">
                                        <Loader size={20} className="text-violet-700" />
                                    </span>
                                ) : (
                                    <MapPin size={20} className="text-violet-700" />
                                )}

                                <span>Lấy vị trí hiện tại của tôi</span>
                            </button>
                        )}
                        <button
                            className="border-none bg-transparent text-black hover:opacity-50 hover:underline"
                            onClick={() => {
                                setOption((prev) => !prev);
                                form.setValue('address', '');
                                if (!option) {
                                    setDistricts([]);
                                    setWards([]);
                                }
                            }}
                        >
                            {option ? 'Trở lại' : 'Tùy chọn khác'}
                        </button>
                    </div>

                    <div className="flex justify-end mt-6 gap-3">
                        <button
                            onClick={() => {
                                onOpenChange(false);
                                form.reset({
                                    address: '',
                                });
                            }}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Đóng
                        </button>
                        <button
                            type="button"
                            onClick={form.handleSubmit(onSubmit)}
                            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
