'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { boothService } from '@/services/booth.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IBooth, ResponseData } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ShopDialog from './shop-dialog';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ShopManagementPage() {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showBanned, setShowBanned] = useState<boolean | undefined>(undefined);
    const [showActive, setShowActive] = useState<boolean | undefined>(undefined);
    const [showDeleted, setShowDeleted] = useState<boolean | undefined>(undefined);

    // Dialog state
    const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<
        'view' | 'ban' | 'unban' | 'active' | 'unactive' | 'delete' | 'restore'
    >('view');

    // Debounced search function
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]);

    const {
        data: shopsData,
        isLoading,
        isError,
    } = useQuery<ResponseData<IBooth[]>>({
        queryKey: ['shops', pageNumber, pageSize, debouncedSearchTerm, showBanned, showActive, showDeleted],
        queryFn: () =>
            boothService.getAll({
                page_number: pageNumber,
                page_size: pageSize,
                search: debouncedSearchTerm || undefined,
                is_banned: showBanned,
                is_active: showActive,
                is_deleted: showDeleted,
            }),
    });

    // Calculate total pages
    const totalPages = shopsData ? Math.ceil(shopsData.total_record / pageSize) : 0;

    // Handle page navigation
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

    // Format date for display
    const formatDate = (dateString: Date) => {
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

    return (
        <div className="p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Quản lý cửa hàng</h1>
                <Button variant="outline" className="ml-auto">
                    Thêm cửa hàng
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                    <Input
                        placeholder="Tìm kiếm theo tên cửa hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div>
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                        value={showActive === undefined ? '' : showActive ? 'true' : 'false'}
                        onChange={(e) => {
                            if (e.target.value === '') {
                                setShowActive(undefined);
                            } else {
                                setShowActive(e.target.value === 'true');
                            }
                        }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Không hoạt động</option>
                    </select>
                </div>

                <div>
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                        value={showBanned === undefined ? '' : showBanned ? 'true' : 'false'}
                        onChange={(e) => {
                            if (e.target.value === '') {
                                setShowBanned(undefined);
                            } else {
                                setShowBanned(e.target.value === 'true');
                            }
                        }}
                    >
                        <option value="">Tất cả</option>
                        <option value="true">Bị cấm</option>
                        <option value="false">Không bị cấm</option>
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
                        <option value="">Tất cả bản ghi</option>
                        <option value="true">Bản ghi đã xóa</option>
                        <option value="false">Bản ghi chưa xóa</option>
                    </select>
                </div>
            </div>

            {/* Shops Table */}
            <div className="border rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">STT</TableHead>
                            <TableHead className="w-[300px]">Thông tin</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Người tạo</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-red-500">
                                    Error loading data. Please try again.
                                </TableCell>
                            </TableRow>
                        ) : !shopsData || !shopsData.data || !shopsData.data[0] || shopsData.data[0].length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    No shops found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            shopsData.data.flat().map((shop: IBooth, index: number) => (
                                <TableRow key={shop.id}>
                                    <TableCell className="font-medium">
                                        {(pageNumber - 1) * pageSize + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full overflow-hidden">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={shop.avatar || '/default-avatar.png'}
                                                        alt={shop.name}
                                                    />
                                                    <AvatarFallback>{shop.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div>
                                                <div className="font-semibold">{shop.name}</div>
                                                <div className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">
                                                    {shop.description}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {shop.is_active ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 inline-block w-fit">
                                                    Đã kích hoạt
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 inline-block w-fit">
                                                    Chờ kích hoạt
                                                </span>
                                            )}
                                            {shop.is_banned && (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 inline-block w-fit">
                                                    Bị cấm
                                                </span>
                                            )}

                                            {shop.is_detele ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 inline-block w-fit">
                                                    Đã xóa
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 inline-block w-fit">
                                                    Hoạt động
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{shop.created_by}</TableCell>
                                    <TableCell>{formatDate(shop.created_at)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedShopId(shop.id);
                                                    setDialogMode('view');
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                Xem
                                            </Button>

                                            {shop.is_active ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                                    onClick={() => {
                                                        setSelectedShopId(shop.id);
                                                        setDialogMode('unactive');
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    <span className="text-blue-600">Hủy kích hoạt</span>
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                                    onClick={() => {
                                                        setSelectedShopId(shop.id);
                                                        setDialogMode('active');
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    <span className="text-green-600">Kích hoạt</span>
                                                </Button>
                                            )}

                                            {shop.is_banned ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                                    onClick={() => {
                                                        setSelectedShopId(shop.id);
                                                        setDialogMode('unban');
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    Bỏ cấm
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                    onClick={() => {
                                                        setSelectedShopId(shop.id);
                                                        setDialogMode('ban');
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    Cấm
                                                </Button>
                                            )}

                                            {shop.is_detele ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                                    onClick={() => {
                                                        setSelectedShopId(shop.id);
                                                        setDialogMode('restore');
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    Khôi phục
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                    onClick={() => {
                                                        setSelectedShopId(shop.id);
                                                        setDialogMode('delete');
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    Xóa
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

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                    Showing {shopsData?.data[0]?.length || 0} of {shopsData?.total_record || 0} shops
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

            {/* Shop Details Dialog */}
            <ShopDialog mode={dialogMode} shopId={selectedShopId} open={isDialogOpen} onOpenChange={setIsDialogOpen} />

            <ToastContainer />
        </div>
    );
}
