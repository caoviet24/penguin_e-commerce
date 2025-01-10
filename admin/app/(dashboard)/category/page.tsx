'use client';
import React, { useEffect, useState } from 'react';
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

import { ICategory, ResponseData } from '@/types';
import { toast, ToastContainer } from 'react-toastify';
import { useQueries, useQuery } from '@tanstack/react-query';
import handleTime from '@/utils/handleTime';
import { FaRegTrashAlt } from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { TbListDetails } from "react-icons/tb";
import { CiRepeat } from 'react-icons/ci';
import useHookMutation from '@/hooks/useHookMutation';
import { categoryService } from '@/services/category.service';
import { BiPlusCircle, BiSearchAlt } from 'react-icons/bi';
import CreateCateogory from '@/components/category_component/CreateCategory/CreateCateogory';
import CategoryDetail from '@/components/category_component/CategoryDetail/CategoryDetail';
import useDebouce from '@/hooks/useDebouce';

interface Column {
    id: 'id' | 'image' | 'cg_name' | 'created_at';
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'id', label: 'Mã danh mục', minWidth: 100, maxWidth: 150 },
    { id: 'image', label: 'Hình ảnh', minWidth: 100 },
    { id: 'cg_name', label: 'Tên danh mục', minWidth: 100, maxWidth: 150 },
    { id: 'created_at', label: 'Ngày tạo', minWidth: 100 }
];

export default function Category() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataTable, setDataTable] = useState<ResponseData<ICategory>>();
    const [tabActive, setTabActive] = useState(0);
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [categorySelected, setCategorySeleted] = useState<ICategory>();
    const [searchValue, setSearchValue] = useState('');

    const { isSuccess: isFetchByNameSuccess, data: categoryByNameData, refetch: refetchByName } = useQuery({
        queryKey: ['category-by-name', page, rowsPerPage],
        queryFn: () => categoryService.getByName({
            page_number: page + 1,
            page_size: rowsPerPage,
            category_name: searchValue
        }),
        enabled: searchValue !== ''
    });

    const searchValueDebouce = useDebouce(searchValue, 500);


    useEffect(() => {
        if (searchValueDebouce.trim()) {
            refetchByName();
        }
        if (searchValue === '') {
            setTabActive(0);
        }
    }, [searchValueDebouce, refetchByName]);


    useEffect(() => {
        if (isFetchByNameSuccess && categoryByNameData) {
            setDataTable(categoryByNameData);
            setTabActive(-1);
        }
    }, [isFetchByNameSuccess, categoryByNameData]);



    const resultCategory = useQueries({
        queries: [
            {
                queryKey: ['categorys', page, rowsPerPage],
                queryFn: () => categoryService.getWithPagination({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 0
            },
            {
                queryKey: ['deleted-categorys', page, rowsPerPage],
                queryFn: () => categoryService.getDeleted({
                    page_number: page + 1,
                    page_size: rowsPerPage,
                }),
                enabled: tabActive === 1
            }
        ]
    })

    useEffect(() => {
        if (resultCategory[tabActive]?.isSuccess) {
            setDataTable(resultCategory[tabActive].data);
        }

    }, [resultCategory, tabActive]);



    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleCreateCategorySuccess = () => {
        toast.success('Thêm danh mục thành công', {
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
        resultCategory[tabActive].refetch();
    }

    const handleDeleteCategory = (category: ICategory) => {
        setOpenDelete(true);
        setCategorySeleted(category);
    };

    const handleDeleteCategorySuccess = () => {
        toast.success('Xóa danh mục thành công', {
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
        resultCategory[tabActive].refetch();
    };

    const handleUpdateCategory = (category: ICategory) => {
        setOpenEdit(true);
        setCategorySeleted(category);
    };

    const handleUpdateCategorySuccess = () => {
        toast.success('Cập nhật danh mục thành công', {
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
        resultCategory[tabActive].refetch();
    };


    const restoreCategoryMuation = useHookMutation((id: string) => {
        return categoryService.restoreById(id);
    })
    const handleRestoreCategory = (cg: ICategory) => {
        restoreCategoryMuation.mutate(cg.id, {
            onSuccess: () => {
                toast.success('Khôi phục danh mục thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: 'light'
                });
                resultCategory[tabActive].refetch();
            }
        });
    }

    return (
        <Paper sx={{ width: '95%', overflow: 'hidden' }} className="mx-auto mt-10 px-2 py-5 shadow-lg">
            <div className='flex items-center justify-between'>
                <div className="w-[500px]">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <BiSearchAlt />
                        </div>
                        <input
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
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
                <div className='flex gap-2'>
                    <button onClick={() => setTabActive(0)} className={`flex items-center opacity-50 justify-center gap-2 space-y-1 text-lg font-semibold text-white bg-blue-500 rounded-lg px-4 py-2 ${tabActive === 0 && '!opacity-100'}`}>
                        <SiDatabricks size={24} />
                        Hiện tại
                    </button>
                    <button onClick={() => setOpenCreate(true)} className={`flex items-center opacity-100 justify-center gap-2 space-y-1 text-lg font-semibold text-white bg-orange-500 rounded-lg px-4 py-2`}>
                        <BiPlusCircle size={24} />
                        Thêm danh mục
                    </button>

                    <button onClick={() => setTabActive(1)} className={`flex items-center opacity-50 justify-center gap-2 space-y-1 text-lg font-semibold text-white bg-red-500 rounded-lg px-4 py-2 ${tabActive === 1 && '!opacity-100'}`}>
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
                        {dataTable?.data.map((cg) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={cg.id}>
                                {columns.map((column) => {
                                    const formattedRow = {
                                        id: cg.id,
                                        image: <Avatar src={cg.image} alt={cg.category_name} className='!h-20 !w-20 ' />,
                                        cg_name: cg.category_name,
                                        created_at: handleTime(cg.created_at),
                                    };

                                    return (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            className='truncate'
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
                                        {tabActive === 0 &&
                                            <>
                                                <button
                                                    onClick={() => handleUpdateCategory(cg)}
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cg)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
                                                >
                                                    Xóa
                                                </button>
                                            </>
                                        }
                                        {tabActive === 1
                                            &&
                                            <button
                                                onClick={() => handleRestoreCategory(cg)}
                                                className='flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'>
                                                <CiRepeat size={30} />
                                                Khôi phục
                                            </button>
                                        }

                                        <button
                                            className='flex items-center gap-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 border border-yellow-700 rounded'>
                                            <TbListDetails />
                                            CTDM
                                        </button>
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
                open={openCreate || openEdit || openDelete}
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
                <Fade in={openCreate || openEdit || openDelete} timeout={{ enter: 300, exit: 200 }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

                        {openEdit && categorySelected && <CategoryDetail category={categorySelected} mode='edit' onSuccess={handleUpdateCategorySuccess} />}
                        {openDelete && categorySelected && <CategoryDetail category={categorySelected} mode='delete' onSuccess={handleDeleteCategorySuccess} />}
                        {openCreate && <CreateCateogory onCreateCategorySuccess={handleCreateCategorySuccess} />}
                    </div>
                </Fade>
            </Modal>

            <ToastContainer />

        </Paper>
    );
}
