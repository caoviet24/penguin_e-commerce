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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IProduct, IProductDetail } from '@/types';
import { ProductStatus } from '@/types/enum';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArchiveRestore, Pencil, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/format-currency';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import Loader from '@/components/Loader/loader';
import ProductDetailDialog from './ProductDetailDialog';

interface ProductDialogProps {
    mode: 'view' | 'edit' | 'delete';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: IProduct | null;
}

export default function ProductDialog({ mode, open, onOpenChange, product }: ProductDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [editedProduct, setEditedProduct] = useState<IProduct | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'variants'>('info');
    const [openProductDetailDialog, setOpenProductDetailDialog] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<IProductDetail | null>(null);
    const [modeProductDetail, setModeProductDetail] = useState<'view' | 'create' | 'edit' | 'delete' | 'restore'>(
        'view',
    );

    const { data: productData, isLoading: isProductLoading } = useQuery({
        queryKey: ['get-product-by-id', product?.id],
        queryFn: () => productService.getById(product?.id || ''),
        enabled: open && !!product,
    });

    useEffect(() => {
        if (product) {
            setEditedProduct(JSON.parse(JSON.stringify(product)));
        } else {
            setEditedProduct(null);
        }
        setActiveTab('info');
        setSelectedDetail(null);
    }, [product, open]);

    const handleSave = () => {
        setIsLoading(true);
        // Simulate saving data
        setTimeout(() => {
            setIsLoading(false);
            onOpenChange(false);
        }, 1000);
    };

    const handleProductChange = (field: string, value: string | boolean) => {
        if (!editedProduct) return;
        setEditedProduct({
            ...editedProduct,
            [field]: value,
        });
    };

    if (!editedProduct) return null;

    // Create description content based on mode
    const getDescription = () => {
        if (mode === 'view') {
            return `Xem chi tiết sản phẩm ${product?.product_desc}`;
        } else if (mode === 'edit') {
            return `Chỉnh sửa thông tin sản phẩm ${product?.product_desc}`;
        } else {
            return `Bạn có chắc chắn muốn xóa sản phẩm ${product?.product_desc}?`;
        }
    };

    if (isProductLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[1000px] max-h-[90vh] h-[30vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Đang tải thông tin sản phẩm...</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Loader size="sm" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'view' && 'Thông tin sản phẩm'}
                        {mode === 'edit' && 'Chỉnh sửa sản phẩm'}
                        {mode === 'delete' && 'Xóa sản phẩm'}
                    </DialogTitle>
                    <DialogDescription>{getDescription()}</DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <div className="flex border-b mb-4">
                        <button
                            className={cn(
                                'px-4 py-2 border-b-2 font-medium',
                                activeTab === 'info'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground',
                            )}
                            onClick={() => setActiveTab('info')}
                        >
                            Thông tin sản phẩm
                        </button>
                        <button
                            className={cn(
                                'px-4 py-2 border-b-2 font-medium',
                                activeTab === 'variants'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground',
                            )}
                            onClick={() => setActiveTab('variants')}
                        >
                            Chi tiết sản phẩm
                        </button>
                    </div>

                    <div className={cn('space-y-4 py-4', activeTab !== 'info' && 'hidden')}>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product_desc">Mô tả</Label>
                                <Textarea
                                    id="product_desc"
                                    value={product?.product_desc || ''}
                                    onChange={(e) => handleProductChange('product_desc', e.target.value)}
                                    rows={3}
                                    disabled={mode === 'view'}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Trạng thái</Label>
                                    <Select
                                        disabled={mode === 'view'}
                                        value={editedProduct.status}
                                        onValueChange={(value) => handleProductChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Thay đổi trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={ProductStatus.AVAILABLE}>Có sẵn</SelectItem>
                                            <SelectItem value={ProductStatus.UNAVAILABLE}>Hết hàng</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="activation">Kiểm duyệt</Label>
                                    <Select
                                        value={editedProduct.is_active ? 'active' : 'inactive'}
                                        onValueChange={(value) => handleProductChange('is_active', value === 'active')}
                                        disabled={true}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái kiểm duyệt" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Đã kiểm duyệt</SelectItem>
                                            <SelectItem value="inactive">Chờ kiểm duyệt</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Ngày tạo</Label>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(editedProduct.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Ngày cập nhật</Label>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(
                                            editedProduct.updated_at || editedProduct.created_at,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cn('space-y-4 py-4', activeTab !== 'variants' && 'hidden')}>
                        {mode === 'edit' && (
                            <div className="flex justify-end mb-2">
                                <Button
                                    onClick={() => {
                                        setSelectedDetail(null);
                                        setModeProductDetail('create');
                                        setOpenProductDetailDialog(true);
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm chi tiết sản phẩm
                                </Button>
                            </div>
                        )}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hình ảnh</TableHead>
                                        <TableHead>Màu sắc</TableHead>
                                        <TableHead>Kích thước</TableHead>
                                        <TableHead>Giá</TableHead>
                                        <TableHead>Giá khuyến mãi</TableHead>
                                        <TableHead>Tồn kho</TableHead>
                                        <TableHead>Đã bán</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        {mode === 'edit' && <TableHead>Hành động</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-center">
                                    {productData &&
                                        productData.list_product_detail.map((detail) => (
                                            <TableRow key={detail.id}>
                                                <TableCell>
                                                    <Image
                                                        src={detail?.image || detail.image}
                                                        alt={detail?.product_name || detail.product_name}
                                                        width={48}
                                                        height={48}
                                                        className="w-12 h-12 rounded-md object-cover"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {detail?.color || detail.color || 'Chưa cập nhật'}
                                                </TableCell>
                                                <TableCell>{detail?.size || detail.size || 'Chưa cập nhật'}</TableCell>
                                                <TableCell>{formatCurrency(detail.sale_price)}</TableCell>
                                                <TableCell>{formatCurrency(detail.promotional_price || 0)}</TableCell>
                                                <TableCell>{detail.stock_quantity || 0}</TableCell>
                                                <TableCell>{detail.sale_quantity || 0}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold inline-block w-fit ${
                                                            detail.is_deleted
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-orange-200 text-orange-800'
                                                        }`}
                                                    >
                                                        {detail.is_deleted ? 'Đã xóa' : 'Hoạt động'}
                                                    </span>

                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold inline-block w-fit ${
                                                            detail.stock_quantity <= 0
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}
                                                    >
                                                        {detail.stock_quantity <= 0 ? 'Hết hàng' : 'Còn hàng'}
                                                    </span>
                                                    </div>
                                                </TableCell>

                                                {mode === 'edit' && (
                                                    <TableCell>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setSelectedDetail(detail);
                                                                setModeProductDetail('edit');
                                                                setOpenProductDetailDialog(true);
                                                            }}
                                                        >
                                                            <Pencil className="text-green-500" />
                                                        </Button>
                                                        {detail.is_deleted ? (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setSelectedDetail(detail);
                                                                    setModeProductDetail('restore');
                                                                    setOpenProductDetailDialog(true);
                                                                }}
                                                            >
                                                                <ArchiveRestore className="text-orange-500" />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setSelectedDetail(detail);
                                                                    setModeProductDetail('delete');
                                                                    setOpenProductDetailDialog(true);
                                                                }}
                                                            >
                                                                <Trash2 className="text-red-500" />
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                    {mode === 'delete' && <Button variant="destructive">Xóa sản phẩm</Button>}
                    {mode === 'edit' && (
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>

            <ProductDetailDialog
                open={openProductDetailDialog}
                onOpenChange={setOpenProductDetailDialog}
                productId={productData?.id || ''}
                mode={modeProductDetail}
                productDetail={selectedDetail || undefined}
            />
        </Dialog>
    );
}
