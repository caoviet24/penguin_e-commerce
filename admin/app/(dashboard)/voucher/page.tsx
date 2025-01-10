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

import { IBooth, ResponseData } from '@/types';
import { toast, ToastContainer } from 'react-toastify';
import { useQueries, useQuery } from '@tanstack/react-query';
import { boothService } from '@/services/booth.service';
import handleTime from '@/utils/handleTime';
import { FaRegTrashAlt } from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { CiRepeat } from 'react-icons/ci';
import useHookMutation from '@/hooks/useHookMutation';
import { useDispatch } from 'react-redux';
import EditBooth from '@/components/shop_component/EditBooth';
import DeleteBooth from '@/components/shop_component/DeleteBooth';
import { BiSearchAlt } from 'react-icons/bi';
import useDebouce from '@/hooks/useDebouce';


interface Column {
    id: 'id' | 'booth_avatar' | 'booth_name' | 'booth_desc' | 'is_active' | 'is_banned' | 'created_by' | 'created_at';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'id', label: 'Mã gian hàng', minWidth: 100, maxWidth: 150 },
    { id: 'booth_avatar', label: 'Ảnh gian hàng', minWidth: 100 },
    { id: 'booth_name', label: 'Tên gian hàng', minWidth: 100, maxWidth: 150 },
    { id: 'booth_desc', label: 'Mô tả', minWidth: 50, maxWidth: 150 },
    { id: 'is_active', label: 'Xác thực', minWidth: 50 },
    { id: 'is_banned', label: 'Cấm', minWidth: 50 },
    { id: 'created_by', label: 'Người tạo', minWidth: 50 },
    { id: 'created_at', label: 'Ngày tạo', minWidth: 100 }
];

export default function BoothTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataTable, setDataTable] = useState<ResponseData<IBooth>>();
    const [tabActive, setTabActive] = useState(0);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [boothSelected, setBoothSeleted] = useState<IBooth>();
    const [searchValue, setSearchValue] = useState('');

    const { isSuccess: isFetchByNameSuccess, data: BoothByNameData, refetch: refetchByName } = useQuery({
        queryKey: ['booths-by-name', page, rowsPerPage],
        queryFn: () => boothService.getByName({
            page_number: page + 1,
            page_size: rowsPerPage,
            booth_name: searchValue
        }),
        enabled: searchValue !== ''
    });

    const searchValueDebouce = useDebouce(searchValue, 500);


    useEffect(() => {
        if (searchValueDebouce.trim()) {
            refetchByName();
        }
        if(searchValue === ''){
            setTabActive(0);
        }
    }, [searchValueDebouce, refetchByName]);


    useEffect(() => {
        if (isFetchByNameSuccess && BoothByNameData) {
            setDataTable(BoothByNameData);
            setTabActive(-1);
        }
    }, [isFetchByNameSuccess, BoothByNameData]);



    const resultBooth = useQueries({
        queries: [
            {
                queryKey: ['booths-activing', page, rowsPerPage],
                queryFn: () => boothService.getActiving({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 0
            },
            {
                queryKey: ['booths-active', page, rowsPerPage],
                queryFn: () => boothService.getActive({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 1
            },
            {
                queryKey: ['booth-inactive', page, rowsPerPage],
                queryFn: () => boothService.getInActive({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 2
            },
            {
                queryKey: ['booth-banned', page, rowsPerPage],
                queryFn: () => boothService.getBanned({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 3
            },
            {
                queryKey: ['booth-deleted', page, rowsPerPage],
                queryFn: () => boothService.getDeleted({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 4
            }
        ]
    })

    useEffect(() => {
        if (resultBooth[tabActive]?.isSuccess) {
            setDataTable(resultBooth[tabActive].data);
        }

    }, [resultBooth, tabActive]);



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const handleDeleteBooth = (booth: IBooth) => {
        setOpenDelete(true);
        setBoothSeleted(booth);
    };

    const handleDeleteBoothSuccess = () => {
        toast.success('Xóa gian hàng thành công', {
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
        resultBooth[tabActive].refetch();
    };

    const handleUpdateBooth = (booth: IBooth) => {
        setOpenEdit(true);
        setBoothSeleted(booth);
    };

    const handleUpdateBoothSuccess = () => {
        toast.success('Cập nhật gian hàng thành công', {
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
        resultBooth[tabActive].refetch();
    };

    const activeBoothMutation = useHookMutation((id: string) => {
        return boothService.active(id);
    })

    const handleActiveBooth = (b: IBooth) => {
        activeBoothMutation.mutate(b.id, {
            onSuccess: (data: IBooth) => {
                toast.success(`Xác thực gian hàng thành công ${data.booth_name}`, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'light'
                });
                resultBooth[tabActive].refetch();
            }
        });
    }

    const unbanBoothMutation = useHookMutation((id: string) => {
        return boothService.unban(id);
    })

    const handleUnBanBooth = (b: IBooth) => {
        unbanBoothMutation.mutate(b.id, {
            onSuccess: (data: IBooth) => {
                toast.success(`Bỏ cấm gian hàng thành công ${data.booth_name}`, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'light'
                });
                resultBooth[tabActive].refetch();
            }
        });
    }

    const restoreBoothMutation = useHookMutation((id: string) => {
        return boothService.restore(id);
    });


    const handleRestoreBooth = (b: IBooth) => {
        restoreBoothMutation.mutate(b.id, {
            onSuccess: (data) => {
                toast.success(`Khôi phục gian hàng thành công ${data.booth_name}`, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'light'
                });
                resultBooth[tabActive].refetch();
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
                        <option value={0}>Đang hoạt động</option>
                        <option value={1}>Đã xác thực</option>
                        <option value={2}>Chưa xác thực</option>
                        <option value={3}>Cấm</option>
                    </select>
                </div>
                <div className='flex gap-2'>
                    <button
                        onClick={() => setTabActive(0)}
                        className={`flex items-center justify-center gap-2 text-lg font-semibold text-white bg-blue-500 rounded-lg px-4 py-2 
                            ${(tabActive === 0 || tabActive === 1 || tabActive === 2 || tabActive === 3) ? 'opacity-100' : 'opacity-50'}`}
                    >
                        <SiDatabricks size={24} />
                        Hiện tại
                    </button>

                    <button onClick={() => setTabActive(4)} className={`flex items-center opacity-50 justify-center gap-2 space-y-1 text-lg font-semibold text-white bg-red-500 rounded-lg px-4 py-2 ${tabActive === 4 && 'opacity-100'}`}>
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
                                        booth_avatar: <Avatar src={b.booth_avatar} alt={b.booth_name} />,
                                        booth_name: b.booth_name,
                                        booth_desc: b.booth_description,
                                        is_active: b.is_active,
                                        is_banned: b.is_banned,
                                        created_by: b.created_by,
                                        created_at: handleTime(b.created_at),
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
                                        {tabActive !== 4 &&
                                            <>

                                                {(tabActive === 0 || tabActive === 1) &&
                                                    <button
                                                        onClick={() => handleUpdateBooth(b)}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded"
                                                    >
                                                        Sửa
                                                    </button>
                                                }

                                                {tabActive === 2 &&
                                                    <button
                                                        onClick={() => handleActiveBooth(b)}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded"
                                                    >
                                                        Xác nhận
                                                    </button>
                                                }

                                                {tabActive === 3 &&
                                                    <button
                                                        onClick={() => handleUnBanBooth(b)}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded"
                                                    >
                                                        Bỏ cấm
                                                    </button>

                                                }

                                                <button
                                                    onClick={() => handleDeleteBooth(b)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
                                                >
                                                    Xóa
                                                </button>
                                            </>
                                        }
                                        {tabActive === 4
                                            &&
                                            <button
                                                onClick={() => handleRestoreBooth(b)}
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
                            boothSelected && <EditBooth booth={boothSelected} onUpdateSuccess={handleUpdateBoothSuccess} />
                        ) : (
                            boothSelected && <DeleteBooth booth={boothSelected} onDeleteSuccess={handleDeleteBoothSuccess} />
                        )}
                    </div>
                </Fade>
            </Modal>

        </Paper>
    );
}
