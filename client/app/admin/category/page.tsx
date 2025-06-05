'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ICategory, ICategoryDetail, ResponseData } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CategoryDialog from './category-dialog';

export default function CategoryManagementPage() {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showDeleted, setShowDeleted] = useState<boolean | undefined>(undefined);
    
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
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
        data: categoriesData,
        isLoading,
        isError,
    } = useQuery<ResponseData<ICategory[]>>({
        queryKey: ['categories', pageNumber, pageSize, debouncedSearchTerm, showDeleted],
        queryFn: () =>
            categoryService.getWithPagination({
                page_number: pageNumber,
                page_size: pageSize,
                search: debouncedSearchTerm || undefined,
                is_deleted: showDeleted,
            }),
    });

    const totalPages = categoriesData ? Math.ceil(categoriesData.total_record / pageSize) : 0;

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
                <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
                <Button variant="outline" className="ml-auto">
                    Thêm danh mục
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <Input
                        placeholder="Tìm kiếm theo tên danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
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

            {/* Categories Table */}
            <div className="border rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">STT</TableHead>
                            <TableHead className="w-[300px]">Thông tin</TableHead>
                            <TableHead>Danh mục con</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Cập nhật lần cuối</TableHead>
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
                        ) : !categoriesData || !categoriesData.data || categoriesData.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categoriesData.data.flat().map((category: ICategory, index: number) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">
                                        {(pageNumber - 1) * pageSize + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full overflow-hidden">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={category.image || '/default-avatar.png'}
                                                        alt={category.name}
                                                    />
                                                    <AvatarFallback>
                                                        {(category.name || 'C').charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div>
                                                <div className="font-semibold">{category.name}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-[300px]">
                                            {category.list_category_detail && category.list_category_detail.length > 0 ? (
                                                category.list_category_detail.map((subCategory: ICategoryDetail) => (
                                                    <span 
                                                        key={subCategory.id}
                                                        className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                                                    >
                                                        {subCategory.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm">Không có danh mục con</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(category.created_at)}</TableCell>
                                    <TableCell>{formatDate(category.last_updated || category.updated_at || new Date())}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedCategoryId(category.id);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                Xem
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 border-red-600 hover:bg-red-50"
                                            >
                                                Xóa
                                            </Button>
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
                    Showing {categoriesData?.data?.length || 0} of {categoriesData?.total_record || 0} categories
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

            <CategoryDialog
                categoryId={selectedCategoryId}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
