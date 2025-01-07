'use client';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Backdrop,
    Fade,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
import { FaCircleCheck } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/account.service';
import handleTime from '@/utils/handleTime';
import DeleteAccount from '@/components/account_component/DeleteAccount';
import EditAccount from '@/components/account_component/EditAccount';
import { Account } from '@/types';

interface Column {
    id: 'acc_id' | 'username' | 'password' | 'tick' | 'role' | 'is_ban' | 'created_at' | 'last_online';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'acc_id', label: 'Mã tài khoản', minWidth: 100, maxWidth: 150 },
    { id: 'username', label: 'Tên đăng nhập', minWidth: 100 },
    { id: 'password', label: 'Mật khẩu', minWidth: 100, maxWidth: 150 },
    { id: 'tick', label: 'Xác minh', minWidth: 50 },
    { id: 'role', label: 'Vai trò', minWidth: 50 },
    { id: 'is_ban', label: 'Cấm', minWidth: 50 },
    { id: 'created_at', label: 'Ngày tạo', minWidth: 100 },
    { id: 'last_online', label: 'Hoạt động lần cuối', minWidth: 100 },
];

export default function AccountTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataTable, setDataTable] = useState<Account[]>([]);
    const [accId, setAccId] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [accountSelected, setAccountSeleted] = useState<Account>({
        acc_id: '',
        username: '',
        password: '',
        tick: false,
        role: '',
        isBan: false,
        createdAt: '',
        lastOnline: '',
    });
    const [message, setMessage] = useState('');


    const {data: accountByIdData, isLoading: isFetchAccountByIdSuccess, refetch: refetchGetAccountById } = useQuery({
        queryKey: ['get-account-by-id'],
        queryFn: () => accountService.getAccountById(accId), 
        enabled: !!accId
    })
    const handleOnClickSearch = () => {
        
        refetchGetAccountById();
    }


    const {
        data: accountsData,
        isSuccess: isFetchAccountSuccess,
        refetch,
    } = useQuery({
        queryKey: ['accounts', page, rowsPerPage],
        queryFn: () => accountService.getAccountWithPagination(page, rowsPerPage),
    });

    useEffect(() => {
        if (isFetchAccountSuccess) {
            setDataTable(accountsData.data);
        }
    
        if (isFetchAccountByIdSuccess && accountByIdData) {
            setDataTable([accountByIdData]);
        }
    }, [isFetchAccountSuccess, accountsData, isFetchAccountByIdSuccess, accountByIdData]);
    


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDeleteAccount = (account: Account) => {
        setOpenDelete(true);
        setAccountSeleted(account);
    };

    const handleDeleteAccountSuccess = () => {
        setMessage('Xóa tài khoản thành công');
        setOpenDelete(false);
        refetch();
    };

    const handleUpdateAccount = (account: Account) => {
        setOpenEdit(true);
        setAccountSeleted(account);
    };

    const handleUpdateAccountSuccess = () => {
        setMessage('Cập nhật tài khoản thành công');
        setOpenEdit(false);
        refetch();
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <Paper sx={{ width: '95%', overflow: 'hidden' }} className="mx-auto mt-10 px-2 py-5 shadow-lg">
            <div>
                <div className="max-w-[500px]">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            className="block w-full p-2 ps-10 text-sm text-gray-900 border outline-none border-gray-300 rounded-lg bg-gray-50 focus:ring-black focus:border-black"
                            placeholder="Aa...."
                            value={accId}
                            onChange={(e) => setAccId(e.target.value)}
                        />
                        <button
                        onClick={handleOnClickSearch}
                         className="text-white absolute end-2.5 bottom-[3px] bg-black hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        maxWidth: column.maxWidth || 'auto',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell
                                align="center"
                                style={{
                                    fontWeight: 'bold',
                                    minWidth: 100,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {dataTable?.map((acc) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={acc.acc_id}>
                                {columns.map((column) => {
                                    const formattedRow = {
                                        acc_id: acc.acc_id,
                                        username: acc.username,
                                        password: acc.password,
                                        tick: acc.tick ? 1 : 0,
                                        role: acc.role,
                                        is_ban: acc.isBan ? 1 : 0,
                                        created_at: handleTime(acc.createdAt),
                                        last_online: handleTime(acc.lastOnline),
                                    };

                                    return (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth,
                                                maxWidth: column.maxWidth || '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {formattedRow[column.id]}
                                        </TableCell>
                                    );
                                })}
                                <TableCell align="center">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => handleUpdateAccount(acc)}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAccount(acc)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[1, 5, 10, 25, 100]}
                component="div"
                count={accountsData?.total_record || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Modal
                open={openEdit || openDelete}
                onClose={() => {
                    setOpenDelete(false);
                    setOpenEdit(false);
                }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        TransitionComponent: Fade,
                    },
                }}
            >
                <Fade in={openEdit || openDelete} timeout={{ enter: 300, exit: 200 }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
                        {openEdit ? (
                            <EditAccount account={accountSelected} onUpdateSuccess={handleUpdateAccountSuccess} />
                        ) : (
                            <DeleteAccount account={accountSelected} onDeleteSuccess={handleDeleteAccountSuccess} />
                        )}
                    </div>
                </Fade>
            </Modal>
            {message && (
                <Alert
                    className="fixed bottom-5 right-9 h-16 flex items-center"
                    icon={<FaCircleCheck />}
                    severity="success"
                >
                    {message}
                </Alert>
            )}
        </Paper>
    );
}
