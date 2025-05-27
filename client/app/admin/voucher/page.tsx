'use client';
import React, { use, useEffect, useState } from 'react';
import {
    Avatar,
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

import { IVoucher, ResponseData } from '@/types';
import { toast, ToastContainer } from 'react-toastify';
import { useQueries, useQuery } from '@tanstack/react-query';
import { voucherService } from '@/services/voucher.service';
import handleTime from '@/utils/handleTime';
import { FaRegTrashAlt } from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { CiRepeat } from 'react-icons/ci';
import useHookMutation from '@/hooks/useHookMutation';
import { useDispatch } from 'react-redux';
import { BiPlusCircle, BiSearchAlt } from 'react-icons/bi';
import useDebouce from '@/hooks/useDebouce';
import CreateVoucher from '@/components/voucher_component/CreateVoucher/CreateVoucher';
import VoucherDetail from '@/components/voucher_component/VoucherDetail/VoucherDetail';
import { TbListDetails } from 'react-icons/tb';


interface Column {
    id: 'id' | 'voucher_type' | 'voucher_name' | 'code' | 'expiry_date' | 'quantity_remain' | 'quantity_used' | 'discount' | 'type_discount' | 'status_voucher' | 'apply_for' | 'booth_id';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'id', label: 'ID', maxWidth: 150 },
    { id: 'voucher_type', label: 'Loại', minWidth: 100 },
    { id: 'voucher_name', label: 'Tên', minWidth: 100 },
    { id: 'code', label: 'Mã', minWidth: 100 },
    { id: 'expiry_date', label: 'Ngày hết hạn', minWidth: 100 },
    { id: 'quantity_remain', label: 'Còn lại', minWidth: 100 },
    { id: 'quantity_used', label: 'Đã sử dụng', minWidth: 100 },
    { id: 'discount', label: 'Giảm giá', minWidth: 100 },
    { id: 'type_discount', label: 'Loại giảm giá', minWidth: 100 },
    { id: 'status_voucher', label: 'Trạng thái', minWidth: 100 },
    { id: 'apply_for', label: 'Áp dụng', minWidth: 100 },
];

export default function VoucherData() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataTable, setDataTable] = useState<ResponseData<IVoucher>>();
    const [tabActive, setTabActive] = useState(0);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [voucherSelected, setVoucherSeleted] = useState<IVoucher>();
    const [searchValue, setSearchValue] = useState('');


    const resultVoucher = useQueries({
        queries: [
            {
                queryKey: ['vouchers-active', page, rowsPerPage],
                queryFn: () => voucherService.getActive({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 0
            },
            {
                queryKey: ['voucher-inactive', page, rowsPerPage],
                queryFn: () => voucherService.getInActive({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 1
            },
            {
                queryKey: ['voucher-deleted', page, rowsPerPage],
                queryFn: () => voucherService.getDeleted({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 2
            }
        ]
    })

    useEffect(() => {
        if (resultVoucher[tabActive]?.isSuccess) {
            setDataTable(resultVoucher[tabActive].data);
        }

    }, [resultVoucher, tabActive]);



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleCreateVoucherSuccess = () => {
        toast.success('Tạo phiếu giảm giá thành công', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: 'light'
        });
        setOpenCreate(false);
        resultVoucher[tabActive].refetch();
    }



    const handleDeleteVoucher = (voucher: IVoucher) => {
        setOpenDelete(true);
        setVoucherSeleted(voucher);
    };

    const handleDeleteVoucherSuccess = () => {
        toast.success('Xóa phiếu gỉảm giá thành công', {
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
        resultVoucher[tabActive].refetch();
    };

    const handleUpdateVoucher = (voucher: IVoucher) => {
        setOpenEdit(true);
        setVoucherSeleted(voucher);
    };

    const handleUpdateVoucherSuccess = () => {
        toast.success('Cập nhật phiếu gỉảm giá thành công', {
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
        resultVoucher[tabActive].refetch();
    };

    const activeVoucherMutation = useHookMutation((id: string) => {
        return voucherService.active(id);
    })

    const handleActiveVoucher = (b: IVoucher) => {
        activeVoucherMutation.mutate(b.id, {
            onSuccess: (data: IVoucher) => {
                toast.success(`Xác thực phiếu gỉảm giá thành công ${data.voucher_name}`, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'light'
                });
                resultVoucher[tabActive].refetch();
            }
        });
    }

    const inActiveVoucherMutation = useHookMutation((id: string) => {
        return voucherService.inActive(id);
    })

    const handleInActiveVoucher = (b: IVoucher) => {
        inActiveVoucherMutation.mutate(b.id, {
            onSuccess: (data: IVoucher) => {
                toast.success(`Xác thực phiếu gỉảm giá thành công ${data.voucher_name}`, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'light'
                });
                resultVoucher[tabActive].refetch();
            }
        });
    }


    const restoreVoucherMutation = useHookMutation((id: string) => {
        return voucherService.restore(id);
    });


    const handleRestoreVoucher = (b: IVoucher) => {
        restoreVoucherMutation.mutate(b.id, {
            onSuccess: (data) => {
                toast.success(`Khôi phục phiếu gỉảm giá thành công ${data.voucher_name}`, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'light'
                });
                resultVoucher[tabActive].refetch();
            }
        });
    }

    return (
        <Paper sx={{ width: '95%', overflow: 'hidden' }} className="mx-auto mt-10 px-2 py-5 shadow-lg">
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5'>
                    <div className="w-[500px]">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <BiSearchAlt />
                            </div>
                            <input
                                type="search"
                                className="block w-full p-2 ps-10 text-sm text-gray-900 border outline-none border-gray-300 rounded-lg bg-gray-50 focus:ring-black focus:border-black"
                                placeholder="Aa...."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <button
                                className="text-white absolute end-2.5 bottom-[3px] bg-black hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5">
                                Search
                            </button>
                        </div>
                    </div>
                    <select value={tabActive} onChange={(e) => setTabActive(Number(e.target.value))} className="bg-gray-50 w-[300px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none p-2.5 ">
                        <option value={0}>Đã xác thực</option>
                        <option value={1}>Chưa xác thực</option>
                    </select>
                </div>
                <div className='flex gap-2'>
                    <button
                        onClick={() => setTabActive(0)}
                        className={`flex items-center justify-center gap-2 text-lg font-semibold text-white bg-blue-500 rounded-lg px-4 py-2 
                            ${(tabActive === 0 || tabActive === 1) ? 'opacity-100' : 'opacity-50'}`}
                    >
                        <SiDatabricks size={24} />
                        Hiện tại
                    </button>

                    <button
                        onClick={() => setOpenCreate(true)}
                        className={`flex items-center opacity-100 justify-center gap-2 space-y-1 text-base font-semibold text-white bg-orange-500 rounded-lg px-4 py-2`}
                    >
                        <BiPlusCircle size={24} />
                        Thêm phiếu gỉảm giá
                    </button>

                    <button onClick={() => setTabActive(2)} className={`flex items-center opacity-50 justify-center gap-2 space-y-1 text-lg font-semibold text-white bg-red-500 rounded-lg px-4 py-2 ${tabActive === 4 && 'opacity-100'}`}>
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
                        {dataTable?.data.map((b) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={b.id}>
                                {columns.map((column) => {
                                    const formattedRow = {
                                        id: b.id,
                                        voucher_type: b.voucher_type,
                                        voucher_name: b.voucher_name,
                                        code: b.voucher_code,
                                        expiry_date: handleTime(b.expiry_date),
                                        quantity_remain: b.quantity_remain,
                                        quantity_used: b.quantity_used,
                                        discount: b.discount,
                                        type_discount: b.type_discount,
                                        status_voucher: b.status_voucher,
                                        apply_for: b.apply_for,
                                        booth_id: b.boot_id,
                                    };

                                    return (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            className="truncate"
                                            style={{
                                                minWidth: column.minWidth,
                                                maxWidth: column.maxWidth || '200px',
                                            }}
                                        >
                                            {formattedRow[column.id]}
                                        </TableCell>
                                    );
                                })}
                                <TableCell align="center">
                                    <div className="flex justify-center space-x-2">
                                        {tabActive !== 2 &&
                                            <>
                                                <button
                                                    onClick={() => handleUpdateVoucher(b)}
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded"
                                                >
                                                    Sửa
                                                </button>
                                                {tabActive !== 1 &&
                                                    <button onClick={() => handleInActiveVoucher(b)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 border border-yellow-700 rounded">
                                                        Gỡ bỏ
                                                    </button>
                                                }

                                            
                                                <button
                                                    onClick={() => handleDeleteVoucher(b)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
                                                >
                                                    Xóa
                                                </button>

                                                {tabActive === 1 && (
                                                    <button onClick={() => handleActiveVoucher(b)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 border border-yellow-700 rounded">
                                                        Kích hoạt
                                                    </button>
                                                )}

                                            </>
                                        }
                                        {tabActive === 2
                                            &&
                                            <button
                                                onClick={() => handleRestoreVoucher(b)}
                                                className='flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>
                                                <CiRepeat size={30} />
                                                Khôi phục
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
                open={openEdit || openDelete || openCreate}
                onClose={() => {
                    setOpenCreate(false);
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
                <Fade in={openEdit || openDelete || openCreate} timeout={{ enter: 300, exit: 200 }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
                        {openCreate && <CreateVoucher onClose={() => setOpenCreate(false)} onSuccess={handleCreateVoucherSuccess} />}
                        {openEdit && voucherSelected &&
                            <VoucherDetail
                                mode='edit'
                                voucher={voucherSelected}
                                onClose={() => setOpenEdit(false)}
                                onSuccess={handleUpdateVoucherSuccess}
                            />}
                        {openDelete && voucherSelected &&
                            <VoucherDetail
                                mode='delete'
                                voucher={voucherSelected}
                                onClose={() => setOpenEdit(false)}
                                onSuccess={handleDeleteVoucherSuccess}
                            />
                        }
                    </div>
                </Fade>
            </Modal>

        </Paper>
    );
}
