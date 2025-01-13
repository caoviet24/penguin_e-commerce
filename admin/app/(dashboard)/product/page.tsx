"use client";
import React, { useEffect, useState } from "react";
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
} from "@mui/material";

import { IProduct, ResponseData } from "@/types";
import { toast, ToastContainer } from "react-toastify";
import { useQueries, useQuery } from "@tanstack/react-query";
import handleTime from "@/utils/handleTime";
import { FaRegTrashAlt } from "react-icons/fa";
import { SiDatabricks } from "react-icons/si";
import { CiRepeat } from "react-icons/ci";
import { BiPlusCircle, BiSearchAlt } from "react-icons/bi";
import { productService } from "@/services/product.service";
import { TbListDetails } from "react-icons/tb";
import useHookMutation from "@/hooks/useHookMutation";
import Product from "@/components/product_component/Product/Product";
import useDebouce from "@/hooks/useDebouce";

interface Column {
    id: "id" | "product_desc" | "status" | "created_at";
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: "right";
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: "id", label: "Mã sản phẩm", minWidth: 100, maxWidth: 150 },
    { id: "product_desc", label: "Mô tả", minWidth: 100 },
    { id: "status", label: "Xác thực", minWidth: 100, maxWidth: 150 },
    { id: "created_at", label: "Ngày tạo", minWidth: 100 },
];

export default function ProductData() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataTable, setDataTable] = useState<ResponseData<IProduct>>();
    const [tabActive, setTabActive] = useState(0);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [productSelected, setProductSeleted] = useState<IProduct>();
    const [searchValue, setSearchValue] = useState("");



    const { isSuccess: isFetchByNameSuccess, data: ProductByNameData, refetch: refetchByName } = useQuery({
        queryKey: ['products-by-name', page, rowsPerPage],
        queryFn: () => productService.getByDesc({
            page_number: page + 1,
            page_size: rowsPerPage,
            product_desc: searchValue
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
        if (isFetchByNameSuccess && ProductByNameData) {
            setDataTable(ProductByNameData);
            setTabActive(-1);
        }
    }, [isFetchByNameSuccess, ProductByNameData]);

    const resultProduct = useQueries({
        queries: [
            {
                queryKey: ["products-active", page, rowsPerPage],
                queryFn: () =>
                    productService.getActive({
                        page_number: page + 1,
                        page_size: rowsPerPage,
                    }),
                enabled: tabActive === 0,
            },
            {
                queryKey: ["products-inactive", page, rowsPerPage],
                queryFn: () =>
                    productService.getInActive({
                        page_number: page + 1,
                        page_size: rowsPerPage,
                    }),
                enabled: tabActive === 1,
            },
            {
                queryKey: ["products-deleted", page, rowsPerPage],
                queryFn: () =>
                    productService.getDeleted({
                        page_number: page + 1,
                        page_size: rowsPerPage,
                    }),
                enabled: tabActive === 2,
            },
        ],
    });

    useEffect(() => {
        if (resultProduct[tabActive]?.isSuccess) {
            setDataTable(resultProduct[tabActive].data);
        }
    }, [resultProduct, tabActive]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleEditProduct = (product: IProduct) => {
        setProductSeleted(product);
        setOpenEdit(true);
    };

    const handleUpdateProductSuccess = () => {
        toast.success("Cập nhật sản phẩm thành công", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        resultProduct[tabActive].refetch();
    };

    const handleDeleteProduct = (product: IProduct) => {
        setProductSeleted(product);
        setOpenDelete(true);
    };

    const handleDeleteProductSuccess = (data: IProduct) => {
        toast.success("Xóa sản phẩm thành công", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        resultProduct[tabActive].refetch();

        setProductSeleted(undefined);
        setOpenDelete(false);
    }

    const restoreProductMutation = useHookMutation((id: string) => (
        productService.restore(id)
    ))

    const handleRestoreProduct = (pro: IProduct) => {
        restoreProductMutation.mutate(pro.id, {
            onSuccess: () => {
                toast.success("Khôi phục sản phẩm thành công", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                resultProduct[tabActive].refetch();
            }
        });
    }


    const activeProductMutation = useHookMutation((id: string) => (
        productService.active(id)
    ));

    const handleActiveProduct = (pro: IProduct) => {
        activeProductMutation.mutate(pro.id, {
            onSuccess: () => {
                toast.success("Xác thực sản phẩm thành công", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                resultProduct[tabActive].refetch();
            }
        });
    }

    const inActiveProductMutation = useHookMutation((id: string) => (
        productService.inActive(id)
    ))

    const handleInActiveProduct = (pro: IProduct) => {
        inActiveProductMutation.mutate(pro.id, {
            onSuccess: () => {
                toast.success("Gỡ sản phẩm thành công", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                resultProduct[tabActive].refetch();
            }
        });
    }



    return (
        <Paper sx={{ width: "95%", overflow: "hidden" }} className="mx-auto mt-10 px-2 py-5 shadow-lg">
            <div className="flex items-center justify-between h-10">
                <div className="flex items-center gap-5">
                    <div className="w-[400px]">
                        <div className="relative">
                            <input
                                type="search"
                                className="block w-full p-2 text-sm text-gray-900 border outline-none border-gray-300 rounded-lg bg-gray-50 focus:ring-black focus:border-black"
                                placeholder="Aa...."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <button className="text-white absolute end-2.5 bottom-[3px] bg-black hover:opacity-80 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5">
                                Search
                            </button>
                        </div>
                    </div>
                    <select
                        value={tabActive}
                        onChange={(e) => setTabActive(Number(e.target.value))}
                        className="bg-gray-50 border border-gray-300 text-gray-900 outline-none text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[250px] p-2"
                    >
                        <option value={0}>Đã xác thực</option>
                        <option value={1}>Chưa xác thực</option>
                    </select>
                </div>
                <div className="flex gap-2 h-10">
                    <button
                        onClick={() => setTabActive(0)}
                        className={`flex items-center justify-center gap-2 text-base font-semibold text-white bg-blue-500 rounded-lg px-4 py-2
                            ${tabActive === 0 || tabActive === 1 ? "opacity-100" : "opacity-50"}`}
                    >
                        <SiDatabricks size={22} />
                        Hiện tại
                    </button>
                    <button
                        onClick={() => setTabActive(2)}
                        className={`flex items-center opacity-50 justify-center gap-2 space-y-1 text-lg font-semibold text-white bg-red-500 rounded-lg px-4 py-2 ${tabActive === 1 && "opacity-100"}`}
                    >
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
                                        maxWidth: column.maxWidth || "auto",
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell
                                align="center"
                                style={{
                                    fontWeight: "bold",
                                    minWidth: 100,
                                }}
                            >
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {dataTable?.data.map((pro) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={pro.id}>
                                {columns.map((column) => {
                                    const formattedRow = {
                                        id: pro.id,
                                        product_desc: pro.product_desc,
                                        status: pro.status ? "Đã xác thực" : "Chưa xác thực",
                                        created_at: handleTime(pro.created_at),
                                    };

                                    return (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            className="truncate"
                                            style={{
                                                minWidth: column.minWidth,
                                                maxWidth: column.maxWidth || "200px",
                                            }}
                                        >
                                            {formattedRow[column.id]}
                                        </TableCell>
                                    );
                                })}
                                <TableCell align="center">
                                    <div className="flex justify-center space-x-2">
                                        {tabActive !== 2 && (
                                            <>
                                                <button
                                                    onClick={() => handleEditProduct(pro)}
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded"
                                                >
                                                    Sửa
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteProduct(pro)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
                                                >
                                                    Xóa
                                                </button>

                                                {tabActive !== 1 &&
                                                    <button onClick={() => handleInActiveProduct(pro)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 border border-yellow-700 rounded">
                                                        <TbListDetails />
                                                        Gỡ bỏ
                                                    </button>
                                                }

                                                {tabActive === 1 && (
                                                    <button onClick={() => handleActiveProduct(pro)}  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 border border-yellow-700 rounded">
                                                        <TbListDetails />
                                                        Xác thực
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {tabActive === 2 && (
                                            <button
                                                onClick={() => handleRestoreProduct(pro)}
                                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                                            >
                                                <CiRepeat size={30} />
                                                Khôi phục
                                            </button>
                                        )}


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
                        {openEdit && productSelected &&
                            <Product mode="update" product={productSelected}
                                onSuccess={handleUpdateProductSuccess}
                                onClose={() => {
                                    setOpenEdit(false);
                                    setProductSeleted(undefined);
                                }}
                            />
                        }
                        {openDelete && productSelected &&
                            <Product mode="delete" product={productSelected}
                                onSuccess={handleDeleteProductSuccess}
                                onClose={() => {
                                    setOpenDelete(false);
                                    setProductSeleted(undefined);
                                }}
                            />
                        }
                    </div>
                </Fade>
            </Modal>

            <ToastContainer />
        </Paper>
    );
}
