'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { voucherService } from '@/services/voucher.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IVoucher, ResponseData } from '@/types';
import VoucherDialog from './voucher-dialog';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDebounce from '@/hooks/useDebounce';

export default function VoucherManagementPage() {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [showDeleted, setShowDeleted] = useState<boolean | undefined>(false);

    const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'view' | 'create' | 'edit' | 'delete' | 'restore'>('view');

    const searchDebounceValue = useDebounce(searchTerm, 500);


    const {
        data: vouchersData,
        isLoading,
        isError,
    } = useQuery<ResponseData<IVoucher[]>>({
        queryKey: ['vouchers', pageNumber, pageSize, searchDebounceValue, selectedType, selectedStatus, showDeleted],
        queryFn: () =>
            voucherService.getWithPagination({
                page_number: pageNumber,
                page_size: pageSize,
                search: searchDebounceValue || undefined,
                type: selectedType || undefined,
                status: selectedStatus || undefined,
                is_deleted: showDeleted,
            }),
    });

    const totalPages = vouchersData ? Math.ceil(vouchersData.total_record / pageSize) : 0;

    const nextPage = () => {
        if (pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const prevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const formatDate = (dateString: Date) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
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

    const formatDiscount = (voucher: IVoucher) => {
        if (voucher.type_discount === 'percent') {
            return `${voucher.discount}%`;
        } else {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.discount);
        }
    };

    const openDeleteDialog = (voucherId: string) => {
        setSelectedVoucherId(voucherId);
        setDialogMode('delete');
        setIsDialogOpen(true);
    };

    const openRestoreDialog = (voucherId: string) => {
        setSelectedVoucherId(voucherId);
        setDialogMode('restore');
        setIsDialogOpen(true);
    };

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

    return (
        <div className="p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Quản lý phiếu giảm giá</h1>
                <Button
                    variant="outline"
                    className="ml-auto"
                    onClick={() => {
                        setSelectedVoucherId(null);
                        setDialogMode('create');
                        setIsDialogOpen(true);
                    }}
                >
                    Thêm phiếu giảm giá
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                    <Input
                        placeholder="Tìm kiếm theo tên, mã phiếu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div>
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="">Tất cả loại phiếu</option>
                        <option value="discount">Giảm giá</option>
                        <option value="freeship">Miễn phí vận chuyển</option>
                    </select>
                </div>

                <div>
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Kích hoạt</option>
                        <option value="0">Không kích hoạt</option>
                    </select>
                </div>

                <div>
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                        value={showDeleted === undefined ? '' : showDeleted ? 'true' : 'false'}
                        onChange={(e) => {
                            if (e.target.value === '') {
                                setShowDeleted(undefined);
                            } else {
                                setShowDeleted(e.target.value === 'true');
                            }
                        }}
                    >
                        <option value="false">Phiếu giảm giá hiện tại</option>
                        <option value="true">Phiếu giảm giá đã xóa</option>
                        <option value="">Tất cả phiếu giảm giá</option>
                    </select>
                </div>
            </div>

            {/* Vouchers Table */}
            <div className="border rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">STT</TableHead>
                            <TableHead className="w-[200px]">Thông tin phiếu</TableHead>
                            <TableHead>Loại phiếu</TableHead>
                            <TableHead>Giảm giá</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Hạn sử dụng</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-red-500">
                                    Error loading data. Please try again.
                                </TableCell>
                            </TableRow>
                        ) : !vouchersData || !vouchersData.data || vouchersData.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10">
                                    No vouchers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            vouchersData.data.flat().map((voucher: IVoucher, index: number) => (
                                <TableRow key={voucher.id}>
                                    <TableCell className="font-medium">
                                        {(pageNumber - 1) * pageSize + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium">{voucher.voucher_name}</div>
                                            <div className="text-xs font-mono text-gray-500">
                                                {voucher.voucher_code}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getVoucherTypeBadge(
                                                voucher.voucher_type,
                                            )}`}
                                        >
                                            {voucher.voucher_type === 'freeship' ? 'Miễn phí vận chuyển' : 'Giảm giá'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{formatDiscount(voucher)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                voucher.status === 1
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {voucher.status === 1 ? 'Kích hoạt' : 'Không kích hoạt'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{formatDate(voucher.expiry_date)}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>
                                                Còn lại: <span className="font-medium">{voucher.quantity_remain}</span>
                                            </div>
                                            <div>
                                                Đã dùng: <span className="font-medium">{voucher.quantity_used}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedVoucherId(voucher.id);
                                                    setDialogMode('view');
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                Xem
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className='text-blue-600 border-blue-600 hover:bg-blue-50'
                                                onClick={() => {
                                                    setSelectedVoucherId(voucher.id);
                                                    setDialogMode('edit');
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                Sửa
                                            </Button>

                                            {!voucher.is_deleted ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                    onClick={() => openDeleteDialog(voucher.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                                    onClick={() => openRestoreDialog(voucher.id)}
                                                >
                                                    Khôi phục
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                    Showing {vouchersData?.data?.length || 0} of {vouchersData?.total_record || 0} vouchers
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={prevPage} disabled={pageNumber <= 1}>
                        Previous
                    </Button>
                    <span className="text-sm">
                        Page {pageNumber} of {totalPages}
                    </span>
                    <Button variant="outline" size="sm" onClick={nextPage} disabled={pageNumber >= totalPages}>
                        Next
                    </Button>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageNumber(1);
                        }}
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                </div>
            </div>

            <VoucherDialog
                voucherId={selectedVoucherId}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={dialogMode}
            />

            <ToastContainer />
        </div>
    );
}
