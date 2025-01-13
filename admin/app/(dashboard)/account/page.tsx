'use client';
import React, { useEffect, useState } from 'react';
import {
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

import { IAccount, ResponseData } from '@/types';
import { toast, ToastContainer } from 'react-toastify';
import { useQueries, useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/account.service';
import handleTime from '@/utils/handleTime';
import EditAccount from '@/components/account_component/EditAccount';
import DeleteAccount from '@/components/account_component/DeleteAccount';
import { FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { CiRepeat } from 'react-icons/ci';
import useHookMutation from '@/hooks/useHookMutation';
import { useDispatch } from 'react-redux';
import { setAccounts } from '@/redux/slices/account.slice';

interface Column {
    id: 'id' | 'username' | 'password' | 'role' | 'is_ban' | 'created_at';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'id', label: 'Mã tài khoản', minWidth: 100, maxWidth: 150 },
    { id: 'username', label: 'Tên đăng nhập', minWidth: 100 },
    { id: 'password', label: 'Mật khẩu', minWidth: 100, maxWidth: 150 },
    { id: 'role', label: 'Vai trò', minWidth: 50 },
    { id: 'is_ban', label: 'Cấm', minWidth: 50 },
    { id: 'created_at', label: 'Ngày tạo', minWidth: 100 }
];

export default function AccountTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataTable, setDataTable] = useState<ResponseData<IAccount>>();
    const [tabActive, setTabActive] = useState(0);
    const [accId, setAccId] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [accountSelected, setAccountSeleted] = useState<IAccount>();
    const dispatch = useDispatch();

    const { data: accountByIdData, isLoading: isFetchAccountByIdSuccess, refetch: refetchGetAccountById } = useQuery({
        queryKey: ['get-account-by-id'],
        queryFn: () => accountService.getById(accId),
        enabled: !!accId
    })

    const handleOnClickSearch = () => {
        refetchGetAccountById();
    }


    const resultAccount = useQueries({
        queries: [
            {
                queryKey: ['accounts', page, rowsPerPage],
                queryFn: () => accountService.getWithPagination({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 0
            },
            {
                queryKey: ['deleted-accounts', page, rowsPerPage],
                queryFn: () => accountService.getDeleted({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 1
            },
            {
                queryKey: ['banned-accounts', page, rowsPerPage],
                queryFn: () => accountService.getBanned({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 2
            }
        ]
    })

    useEffect(() => {
        if (resultAccount[tabActive].isSuccess) {
            setDataTable(resultAccount[tabActive].data);
            // dispatch(setAccounts(resultAccount[tabActive].data?.data));
        }

    }, [resultAccount, tabActive]);



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDeleteAccount = (account: IAccount) => {
        setOpenDelete(true);
        setAccountSeleted(account);
    };

    const handleDeleteAccountSuccess = () => {
        toast.success('Xóa tài khoản thành công', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: 'light'
        });
        setOpenDelete(false);
        resultAccount[tabActive].refetch();
    };

    const handleUpdateAccount = (account: IAccount) => {
        setOpenEdit(true);
        setAccountSeleted(account);
    };

    const handleUpdateAccountSuccess = () => {
        toast.success('Cập nhật tài khoản thành công', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: 'light'
        });
        setOpenEdit(false);
        resultAccount[tabActive].refetch();
    };


    const restoreAccountMuation = useHookMutation((id: string) => {
        return accountService.restoreById(id);
    })
    const handleRestoreAccount = (acc: IAccount) => {
        restoreAccountMuation.mutate(acc.id, {
            onSuccess: () => {
                toast.success('Khôi phục tài khoản thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'light'
                });
                resultAccount[tabActive].refetch();
            }
        });
    }

    const banAccountMutation = useHookMutation((id: string) => {
        return accountService.banById(id);
    })

    const handleBanAccount = (acc: IAccount) => {
        banAccountMutation.mutate(acc.id, {
            onSuccess: () => {
                toast.success('Cấm tài khoản thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'light'
                });
                resultAccount[tabActive].refetch();
            }
        });
    }

    const unBanAccountMutation = useHookMutation((id: string) => {
        return accountService.unBanById(id);
    })
    const handleUnBanAccount = (acc: IAccount) => {
        unBanAccountMutation.mutate(acc.id, {
            onSuccess: () => {
                toast.success('Bỏ cấm tài khoản thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'light'
                });
                resultAccount[tabActive].refetch();
            }
        });
    }

    return (
        <Paper sx={{ width: '95%', overflow: 'hidden' }} className="mx-auto mt-10 px-2 py-5 shadow-lg">
            <div className='flex items-center gap-4'>
                <div className="w-[500px]">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <FaSearch />
                        </div>
                        <input
                            type="search"
                            className="block w-full p-2 ps-10 text-sm text-gray-900 border outline-none border-gray-300 rounded-lg bg-gray-50 focus:ring-black focus:border-black"
                            placeholder="Aa...."
                        />
                        <button
                            className="text-white absolute end-2.5 bottom-[3px] bg-black hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5">
                            Search
                        </button>
                    </div>
                </div>
                <select value={tabActive} onChange={(e) => setTabActive(Number(e.target.value))} className="bg-gray-50 w-[300px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none p-2.5 ">
                    <option value={0}>Đang hoạt động</option>
                    <option value={2}>Cấm</option>
                </select>
                <div className='flex gap-2'>
                    <button onClick={() => setTabActive(0)} className={`flex items-center opacity-50 justify-center gap-2 space-y-1 text-lg font-semibold text-white bg-blue-500 rounded-lg px-4 py-2 ${tabActive === 0 && 'opacity-100'}`}>
                        <SiDatabricks size={24} />
                        Hiện tại
                    </button>
                    <button onClick={() => setTabActive(1)} className={`flex items-center opacity-50 justify-center gap-2 space-y-1 text-lg font-semibold text-white bg-red-500 rounded-lg px-4 py-2 ${tabActive === 1 && 'opacity-100'}`}>
                        <FaRegTrashAlt />
                        Thùng rác
                    </button>
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
                        {dataTable?.data.map((acc) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={acc.id}>
                                {columns.map((column) => {
                                    const formattedRow = {
                                        id: acc.id,
                                        username: acc.username,
                                        password: acc.password,
                                        role: acc.role,
                                        is_ban: acc.is_banned ? 1 : 0,
                                        created_at: handleTime(acc.created_at),
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
                                        {tabActive === 0 &&
                                            <>
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

                                                {!acc.is_banned &&
                                                    <button
                                                        onClick={() => handleBanAccount(acc)}
                                                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
                                                    >
                                                        Cấm
                                                    </button>
                                                }
                                            </>
                                        }
                                        {tabActive === 1
                                            &&
                                            <button
                                                onClick={() => handleRestoreAccount(acc)}
                                                className='flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>
                                                <CiRepeat size={30} />
                                                Khôi phục
                                            </button>
                                        }
                                        {
                                            tabActive === 2 &&
                                            <button
                                                onClick={() => handleUnBanAccount(acc)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
                                            >
                                                Bỏ cấm
                                            </button>
                                        }
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[1, 5, 10, 25, 100, 1000]}
                component="div"
                count={dataTable?.total_record || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <ToastContainer />

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
                            accountSelected && <EditAccount account={accountSelected} onUpdateSuccess={handleUpdateAccountSuccess} />
                        ) : (
                            accountSelected && <DeleteAccount account={accountSelected} onDeleteSuccess={handleDeleteAccountSuccess} />
                        )}
                    </div>
                </Fade>
            </Modal>

        </Paper>
    );
}
