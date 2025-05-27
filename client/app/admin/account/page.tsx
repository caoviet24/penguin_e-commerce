'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/account.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IAccount, ResponseData } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AccountDialog from './account-dialog';

export default function AccountManagementPage() {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [showBanned, setShowBanned] = useState<boolean | undefined>(undefined);
    const [showDeleted, setShowDeleted] = useState<boolean | undefined>(undefined);
    
    // Dialog state
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        data: accountsData,
        isLoading,
        isError,
    } = useQuery<ResponseData<IAccount[]>>({
        queryKey: ['accounts', pageNumber, pageSize, debouncedSearchTerm, selectedRole, showBanned, showDeleted],
        queryFn: () =>
            accountService.getAll({
                page_number: pageNumber,
                page_size: pageSize,
                search: debouncedSearchTerm || undefined,
                role: selectedRole || undefined,
                is_banned: showBanned,
                is_deleted: showDeleted,
            }),
    });

    // Calculate total pages
    const totalPages = accountsData ? Math.ceil(accountsData.total_record / pageSize) : 0;

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
                <h1 className="text-2xl font-bold">Quản lỳ tài khoản</h1>
                <Button variant="outline" className="ml-auto">
                    Thêm tài khoản
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                    <Input
                        placeholder="Tìm kiếm theo tên, tên người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div>
                    <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="">Tất cả vai trò</option>
                        <option value="User">User</option>
                        <option value="Saler">Seller</option>
                        <option value="Admin">Admin</option>
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
                        <option value="">Tất cả trạng thái</option>
                        <option value="true">Bi cấm</option>
                        <option value="false">Hoạt động </option>
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

            {/* Accounts Table */}
            <div className="border rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">STT</TableHead>
                            <TableHead className="w-[300px]">Thông tin</TableHead>
                            <TableHead>Vai trò</TableHead>
                            <TableHead>Giới tính</TableHead>
                            <TableHead>Trạng thái</TableHead>
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
                        ) : !accountsData ||
                          !accountsData.data ||
                          !accountsData.data[0] ||
                          accountsData.data[0].length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    No accounts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            accountsData.data.flat().map((account: IAccount, index: number) => (
                                <TableRow key={account.id}>
                                    <TableCell className="font-medium">
                                        {(pageNumber - 1) * pageSize + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full overflow-hidden">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={account.avatar || '/default-avatar.png'}
                                                        alt={account.full_name}
                                                    />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div>
                                                <div className="font-semibold">{account.full_name}</div>
                                                <div className="text-sm text-gray-500">@{account.username}</div>
                                                <div className="text-sm text-gray-500">{account.phone}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold 
                                            ${
                                                account.role === 'Admin'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : account.role === 'Saler'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {account.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>{account.gender}</TableCell>
                                    <TableCell>
                                        {account.is_banned ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                Banned
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{formatDate(account.created_at)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedAccountId(account.id);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                Xem
                                            </Button>
                                            {account.is_banned ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                                >
                                                    Bỏ cấm
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                >
                                                    Cấm
                                                </Button>
                                            )}
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
                    Showing {accountsData?.data[0]?.length || 0} of {accountsData?.total_record || 0} accounts
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

            {/* Account Details Dialog */}
            <AccountDialog
                accountId={selectedAccountId}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
