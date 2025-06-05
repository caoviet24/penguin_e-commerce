'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IProduct, ResponseData } from '@/types';
import ProductDialog from './product-dialog';
import { ToastContainer } from 'react-toastify';
import Image from 'next/image';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';

export default function ProductManagementPage() {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [mode, setMode] = useState<'view' | 'active' | 'inactive' | 'delete' | 'restore'>('view');
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [showActive, setShowActive] = useState<string>('');
    const [showDeleted, setShowDeleted] = useState<boolean | undefined>(false);

    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        data: productsData,
        isLoading,
        isError,
    } = useQuery<ResponseData<IProduct>>({
        queryKey: ['get-products', pageNumber, pageSize, debouncedSearchTerm, selectedStatus, showActive, showDeleted],
        queryFn: () =>
            productService.getAll({
                page_number: pageNumber,
                page_size: pageSize,
                search: debouncedSearchTerm || undefined,
                status: selectedStatus || undefined,
                is_active: showActive === '' ? undefined : showActive === 'true' ? true : false,
                is_deleted: showDeleted,
            }),
    });

    const totalPages = productsData ? Math.ceil(productsData.total_record / pageSize) : 0;

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

    const getMinPrice = (product: IProduct) => {
        if (!product.list_product_detail || product.list_product_detail.length === 0) {
            return 0;
        }
        return Math.min(...product.list_product_detail.map((variant) => variant.sale_price));
    };

    const handleSelectProduct = useCallback((productId: string, mode: 'view' | 'active' | 'inactive' | 'delete' | 'restore') => {
        setMode(mode);
        setSelectedProductId(productId);
        setIsDialogOpen(true);
    }, []);
    
    const handleDialogOpenChange = useCallback((open: boolean) => {
        setIsDialogOpen(open);
    }, []);


    return (
        <div className="p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
                <Button variant="outline" className="ml-auto">
                    Thêm sản phẩm
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                    <Input
                        placeholder="Tìm kiếm theo mô tả sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div>
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="AVAILABLE">Có sẵn</option>
                        <option value="UNAVAILABLE">Không có sẵn</option>
                    </select>
                </div>

                <div>
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                        value={showActive === '' ? '' : showActive === 'true' ? 'true' : 'false'}
                        onChange={(e) => {
                            console.log('e.target.value', e.target.value, typeof e.target.value);
                            
                            setShowActive(e.target.value)
                        }}
                    >
                        <option value="">Tất cả trạng thái kích hoạt</option>
                        <option value="true">Đã kích hoạt</option>
                        <option value="false">Chưa kích hoạt</option>
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
                        <option value="false">Sản phẩm hợp lệ</option>
                        <option value="true">Sản phẩm đã xóa</option>
                        <option value="">Tất cả sản phẩm</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="border rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">STT</TableHead>
                            <TableHead className="w-[300px]">Thông tin sản phẩm</TableHead>
                            <TableHead>Cửa hàng</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Giá bán</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-red-500">
                                    Error loading data. Please try again.
                                </TableCell>
                            </TableRow>
                        ) : !productsData || !productsData.data || productsData.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            productsData.data.map((product: IProduct, index: number) => {
                                const firstVariant =
                                    product.list_product_detail && product.list_product_detail.length > 0
                                        ? product.list_product_detail[0]
                                        : null;

                                return (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">
                                            {(pageNumber - 1) * pageSize + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-start gap-3">
                                                {firstVariant && (
                                                    <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={firstVariant.image || '/placeholder.png'}
                                                            alt={firstVariant.product_name}
                                                            width={56}
                                                            height={56}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-semibold line-clamp-1">
                                                        {firstVariant ? firstVariant.product_name : 'No variant'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 line-clamp-2">
                                                        {product.product_desc}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        ID: {product.id.substring(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.booth_id.substring(0, 8)}...</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold inline-block w-fit ${
                                                        product.status === 'AVAILABLE'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {product.status === 'AVAILABLE' ? 'Có sẵn' : 'Không có sẵn'}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold inline-block w-fit ${
                                                        product.is_active
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {product.is_active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                                                </span>

                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold inline-block w-fit ${
                                                        product.is_deleted
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-orange-200 text-orange-800'
                                                    }`}
                                                >
                                                    {product.is_deleted ? 'Đã xóa' : 'Hợp lệ'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatCurrency(getMinPrice(product))}</TableCell>
                                        <TableCell>{formatDate(product.created_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSelectProduct(product.id, 'view')}
                                                >
                                                    Xem
                                                </Button>

                                                {product.is_active ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                                                        onClick={() => handleSelectProduct(product.id, 'inactive')}
                                                    >
                                                        Hủy kích hoạt
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-gray-600 border-gray-600 hover:bg-gray-50"
                                                        onClick={() => handleSelectProduct(product.id, 'active')}
                                                    >
                                                        Kích hoạt
                                                    </Button>
                                                )}

                                                {!product.is_deleted ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                                        onClick={() => handleSelectProduct(product.id, 'delete')}
                                                    >
                                                        Xóa
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                                        onClick={() => handleSelectProduct(product.id, 'restore')}
                                                    >
                                                        Khôi phục
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                    Showing {productsData?.data?.length || 0} of {productsData?.total_record || 0} products
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

            {isDialogOpen && (
                <ProductDialog
                    mode={mode}
                    productId={selectedProductId}
                    open={isDialogOpen}
                    onOpenChange={handleDialogOpenChange}
                />
            )}

            <ToastContainer />
        </div>
    );
}
