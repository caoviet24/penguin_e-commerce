'use client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { deliveryAddressService } from '@/services/deliveryAddress.service';
import { IDeliveryAddress } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BadgePlus } from 'lucide-react';
import React, { useState } from 'react';
import DeliveryAddressDialog from './DeliveryAddressDialog';
import { toast } from 'react-toastify';

interface DeliveryAddressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    selectedAddress?: {
        address: string;
        full_name: string;
        phone: string;
    } | null;
    onSelect: (address: IDeliveryAddress) => void;
}

export default function DeliveryAddressTableDialog({
    open,
    onOpenChange,
    userId,
    selectedAddress,
    onSelect,
}: DeliveryAddressDialogProps) {
    const { data: addressData, isLoading } = useQuery({
        queryKey: ['get-address-by-user-id', userId],
        queryFn: () => deliveryAddressService.getByUserId(userId),
        enabled: !!userId,
    });

    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [openAddressItem, setOpenAddressItem] = useState<boolean>(false);


    const deleteAddressMutation = useMutation({
        mutationKey: ['delete-address'],
        mutationFn: (id: string) => deliveryAddressService.remove(id),
    })

    const handleDeleteAddress = async (id: string) => {
        deleteAddressMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Đã xóa địa chỉ thành công');
                onOpenChange(false);
            },
            onError: (error) => {
                console.error('Error deleting address:', error);
                toast.error('Xóa địa chỉ không thành công. Vui lòng thử lại sau.');
                onOpenChange(false);
            },
        });
    }

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <div className="bg-white p-6 w-full max-w-[600px] rounded-lg shadow-xl">
                        <p>Loading...</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTitle>
                <span className="text-lg font-semibold">Chọn địa chỉ giao hàng</span>
            </DialogTitle>
            <DialogContent>
                <div className="bg-white p-6 w-full max-w-[600px] rounded-lg shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Địa chỉ của tôi</h3>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <Separator />

                    <div className="mt-4 max-h-[300px] overflow-y-auto">
                        {addressData && addressData.length > 0 ? (
                            <div className="space-y-3">
                                {addressData.map((address, index: number) => (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                                            address.address === selectedAddress?.address &&
                                            address.full_name === selectedAddress?.full_name &&
                                            address.phone === selectedAddress?.phone
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            className="w-4 h-4 mt-1 cursor-pointer border-2 border-purple-500 text-purple-600 focus:ring-purple-500"
                                            name="address"
                                            value={JSON.stringify({
                                                address: address.address,
                                                full_name: address.full_name,
                                                phone: address.phone,
                                            })}
                                            checked={
                                                selectedAddress?.address === address.address &&
                                                selectedAddress?.full_name === address.full_name &&
                                                selectedAddress?.phone === address.phone
                                            }
                                            onChange={() => onSelect(address as IDeliveryAddress)}
                                        />
                                        <div className="flex-1">
                                            <div className="flex flex-wrap gap-x-2 mb-1">
                                                <p className="font-medium">{address.full_name}</p>
                                                <p className="text-gray-600">|</p>
                                                <p className="text-gray-600">{address.phone}</p>
                                            </div>
                                            <p className="text-gray-600 text-sm">{address.address}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="text-purple-600 text-sm hover:text-purple-800">
                                                Cập nhật
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(address.id)}
                                                className="text-red-500 text-sm hover:text-red-700"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                <p>Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</p>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setMode('create');
                                setOpenAddressItem(true);
                            }}
                            type="button"
                            className="flex items-center justify-center gap-2 w-full mt-4 border border-dashed border-purple-400 bg-purple-50 hover:bg-purple-100 rounded-lg px-4 py-3 text-purple-700 font-medium transition-colors"
                        >
                            <BadgePlus size={20} />
                            Thêm địa chỉ mới
                        </button>
                    </div>

                    <div className="flex justify-end mt-6 gap-3">
                        <button
                            onClick={() => {
                                onOpenChange(false);
                                onSelect({ full_name: '', phone: '', address: '' } as IDeliveryAddress);
                            }}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={() => {
                                // handleSelectAddress(addressData[idxAddress]);
                                onOpenChange(false);
                            }}
                            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </DialogContent>

            

            <DeliveryAddressDialog mode={mode} open={openAddressItem} onOpenChange={setOpenAddressItem} />
        </Dialog>
    );
}
