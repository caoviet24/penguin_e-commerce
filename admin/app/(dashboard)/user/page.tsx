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
import { User } from '@/types';
import { userService } from '@/services/user.service';

interface Column {
    id: 'acc_id' | 'full_name' | 'avatar' | 'nickname' | 'bio';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'acc_id', label: 'Mã tài khoản', minWidth: 100, maxWidth: 150 },
    { id: 'full_name', label: 'Tên đầy đủ', minWidth: 100 },
    { id: 'avatar', label: 'Ảnh đại diện', minWidth: 100, maxWidth: 150 },
    { id: 'nickname', label: 'nickname', minWidth: 50 },
    { id: 'bio', label: 'Giới thiệu', minWidth: 50 },
];

export default function UserTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [userSelected, setUserSeleted] = useState<User>({
        acc_id: '',
        full_name: '',
        nickname: '',
        avatar: '',
        bio: '',
    });
    const [message, setMessage] = useState('');

    const {
        data: userData,
        isSuccess: isFetchUserSuccess,
        refetch,
    } = useQuery({
        queryKey: ['users', page, rowsPerPage],
        queryFn: () => userService.getUserWithPagination(page, rowsPerPage),
    });

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDeleteUser = (user: User) => {
        setOpenDelete(true);
        setUserSeleted(user);
    };

    const handleDeleteAccountSuccess = () => {
        setMessage('Xóa người dùng thành công');
        setOpenDelete(false);
        refetch();
    };

    const handleUpdateUser = (user: User) => {
        setOpenEdit(true);
        setUserSeleted(user);
    };

    const handleUpdateAccountSuccess = () => {
        setMessage('Cập nhật người dùng thành công');
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
                <form className="max-w-[500px]">
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
                            required
                        />
                        <button className="text-white absolute end-2.5 bottom-[3px] bg-black hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5">
                            Search
                        </button>
                    </div>
                </form>
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
                        {userData?.data?.map((acc) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={acc.acc_id}>
                                {columns.map((column) => {
                                    const formattedRow = {
                                        acc_id: acc.acc_id,
                                        full_name: acc.full_name,
                                        avatar: (
                                            <img
                                                className="w-16 h-16 rounded-lg"
                                                src={acc.avatar}
                                                alt={acc.full_name}
                                            />
                                        ),
                                        nickname: acc.nickname,
                                        bio: acc.bio,
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
                                    <div className="flex gap-2 items-center justify-center">
                                        <button
                                            // onClick={() => handleUpdateAccount(acc)}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            // onClick={() => handleDeleteUser(acc)}
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
                count={userData?.total_record || 0}
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
                        {/* {openEdit ? (
                            <EditAccount user={accountSelected} onUpdateSuccess={handleUpdateAccountSuccess} />
                        ) : (
                            <DeleteAccount user={accountSelected} onDeleteSuccess={handleDeleteAccountSuccess} />
                        )} */}
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
