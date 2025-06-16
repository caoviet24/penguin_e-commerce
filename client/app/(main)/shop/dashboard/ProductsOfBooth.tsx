'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productService } from '@/services/product.service';
import { IProduct } from '@/types';
import { ProductStatus } from '@/types/enum';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Trash2, SquarePenIcon, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductDialog from './ProductDialog';
import { useQuery } from '@tanstack/react-query';
import useDebounce from '@/hooks/useDebounce';
import Image from 'next/image';
import { formatDate } from '@/utils/format-date';

interface ProductsOfBoothProps {
    boothId: string;
}

export default function ProductsOfBooth({ boothId }: ProductsOfBoothProps) {
    const [searchValue, setSearchValue] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [activationFilter, setActivationFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deletionFilter, setDeletionFilter] = useState<string>('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [mode, setMode] = useState<'edit' | 'view' | 'delete'>('view');

    const searchValueDebouce = useDebounce(searchValue, 500);
    const { data: products, isLoading } = useQuery({
        queryKey: [
            'get-products-of-booth',
            boothId,
            pageNumber,
            pageSize,
            searchValueDebouce,
            activationFilter,
            statusFilter,
            deletionFilter,
        ],
        queryFn: () =>
            productService.getAll({
                page_number: pageNumber,
                page_size: pageSize,
                booth_id: boothId,
                search: searchValueDebouce || undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                is_active: activationFilter !== 'all' ? activationFilter === 'active' : undefined,
                is_deleted: deletionFilter !== 'all' ? deletionFilter === 'deleted' : undefined,
            }),
        enabled: !!boothId,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleProductClick = (product: IProduct) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const generatePaginationItems = () => {
        if (!products) return [];

        const totalPages = Math.ceil(products.total_record / pageSize);
        if (totalPages <= 1) return [];

        const items = [];
        const displayCount = 5;

        let startPage = Math.max(1, pageNumber - Math.floor(displayCount / 2));
        const endPage = Math.min(totalPages, startPage + displayCount - 1);


        if (endPage - startPage + 1 < displayCount) {
            startPage = Math.max(1, endPage - displayCount + 1);
        }


        items.push(
            <Button
                key="prev"
                variant="outline"
                className="h-9 w-9 p-0"
                disabled={pageNumber === 1}
                onClick={() => setPageNumber(pageNumber - 1)}
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
            </Button>,
        );

        if (startPage > 1) {
            items.push(
                <Button
                    key="1"
                    variant={pageNumber === 1 ? 'default' : 'outline'}
                    className="h-9 w-9 p-0"
                    onClick={() => setPageNumber(1)}
                >
                    1
                </Button>,
            );

            if (startPage > 2) {
                items.push(
                    <Button key="ellipsis1" variant="outline" className="h-9 w-9 p-0" disabled>
                        ...
                    </Button>,
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Button
                    key={i}
                    variant={pageNumber === i ? 'default' : 'outline'}
                    className="h-9 w-9 p-0"
                    onClick={() => setPageNumber(i)}
                >
                    {i}
                </Button>,
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(
                    <Button key="ellipsis2" variant="outline" className="h-9 w-9 p-0" disabled>
                        ...
                    </Button>,
                );
            }

            items.push(
                <Button
                    key={totalPages}
                    variant={pageNumber === totalPages ? 'default' : 'outline'}
                    className="h-9 w-9 p-0"
                    onClick={() => setPageNumber(totalPages)}
                >
                    {totalPages}
                </Button>,
            );
        }

        items.push(
            <Button
                key="next"
                variant="outline"
                className="h-9 w-9 p-0"
                disabled={pageNumber === totalPages || totalPages === 0}
                onClick={() => setPageNumber(pageNumber + 1)}
            >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
            </Button>,
        );

        return items;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tim kiếm sản phẩm..."
                        className="pl-8"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Select value={activationFilter} onValueChange={setActivationFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trạng thái kích hoạt" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Trạng thái kích hoạt</SelectItem>
                            <SelectItem value="active">Đã kiểm duyệt</SelectItem>
                            <SelectItem value="inactive">Chờ kiểm duyệt</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trạng thái sản phẩm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value={ProductStatus.AVAILABLE}>Có sẵn</SelectItem>
                            <SelectItem value={ProductStatus.UNAVAILABLE}>Hết hàng</SelectItem>
                            <SelectItem value={ProductStatus.SOLD_OUT}>Bán hết</SelectItem>
                            <SelectItem value={ProductStatus.COMING_SOON}>Chờ hàng</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={deletionFilter} onValueChange={setDeletionFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trạng thái xóa" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Trạng thái xóa</SelectItem>
                            <SelectItem value="deleted">Đã xóa</SelectItem>
                            <SelectItem value="not-deleted">Chưa xóa</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>STT</TableHead>
                                    <TableHead>Sản phẩm</TableHead>
                                    <TableHead>Mô tả</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead>Ngày cập nhật</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products?.data && products.data.length > 0 ? (
                                    products.data.map((product, idx) => (
                                        <TableRow
                                            key={product.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleProductClick(product)}
                                        >
                                            <TableCell className="font-medium text-center">{idx + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col gap-1">
                                                    {product.list_product_detail.slice(0, 1).map((detail) => (
                                                        <div key={detail.id} className="flex items-center gap-2">
                                                            <Image
                                                                src={detail.image}
                                                                alt={detail.product_name}
                                                                width={40}
                                                                height={40}
                                                                className="w-10 h-10 rounded-md object-cover"
                                                            />
                                                            <span className="text-sm font-medium line-clamp-1">
                                                                {product.product_desc}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {product.list_product_detail.length > 1 && (
                                                        <span className="text-xs text-muted-foreground">
                                                            +{product.list_product_detail.length} sản phẩm khác
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                <p className="text-sm line-clamp-2">{product.product_desc}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className={cn(
                                                            'px-2 py-1 rounded-full text-xs font-medium',
                                                            product.status === ProductStatus.AVAILABLE &&
                                                                'bg-green-100 text-green-800',
                                                            product.status === ProductStatus.UNAVAILABLE &&
                                                                'bg-red-100 text-red-800',
                                                            product.status === ProductStatus.SOLD_OUT &&
                                                                'bg-orange-100 text-orange-800',
                                                            product.status === ProductStatus.COMING_SOON &&
                                                                'bg-blue-100 text-blue-800',
                                                        )}
                                                    >
                                                        {product.status === ProductStatus.AVAILABLE && 'Có sẵn'}
                                                        {product.status === ProductStatus.UNAVAILABLE && 'Hết hàng'}
                                                        {product.status === ProductStatus.SOLD_OUT && 'Bán hết'}
                                                        {product.status === ProductStatus.COMING_SOON && 'Chờ hàng'}
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
                                            <TableCell>{formatDate(product.created_at)}</TableCell>
                                            <TableCell>
                                                {new Date(
                                                    product.updated_at || product.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div
                                                    className="flex justify-end gap-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Button
                                                        className="bg-green-500 text-white"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setMode('view');
                                                            setDialogOpen(true);
                                                        }}
                                                    >
                                                        <Eye />
                                                    </Button>

                                                    <Button
                                                        className="bg-orange-500 text-white"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setMode('edit');
                                                            setDialogOpen(true);
                                                        }}
                                                    >
                                                        <SquarePenIcon />
                                                    </Button>

                                                    <Button
                                                        className="bg-red-500"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setMode('delete');
                                                            setDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {products && products.total_record > 0 && (
                        <div className="flex items-center gap-1 py-4">
                            <div className="flex-1 flex items-center justify-center gap-2">
                                {generatePaginationItems()}
                            </div>
                            <div className="flex justify-end">
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={(value) => setPageSize(Number(value))}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Kích thước trang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 5, 10, 20, 50].map((size: number) => (
                                            <SelectItem key={size} value={size.toString()}>
                                                {size} bản ghi
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                        <div>
                            Hiển thị {products?.data?.length || 0} trên {products?.total_record || 0} sản phẩm
                        </div>
                        <div className="flex items-center gap-2">
                            <p>
                                Trang {pageNumber} trên {products ? Math.ceil(products.total_record / pageSize) : 1}
                            </p>
                        </div>
                    </div>
                </>
            )}

            <ProductDialog
                mode={mode}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={selectedProduct}
            />
        </div>
    );
}
