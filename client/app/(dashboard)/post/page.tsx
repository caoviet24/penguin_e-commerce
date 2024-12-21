"use client";
import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { FaCircleCheck } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import handleTime from "@/utils/handleTime";
import { Post } from "@/types";
import { postService } from "@/services/post.service";
import DeletePost from "@/components/post_componet/DeletePost";
import { RiDeleteBinLine } from "react-icons/ri";
import { PiShareFat } from "react-icons/pi";


interface Column {
    id: "post_id" | "title" | "image" | "num_likes" | "num_commets" | "location" | "createdAt" | "acc_id";
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: "right";
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: "post_id", label: "Mã bài đăng", minWidth: 100, maxWidth: 150 },
    { id: "title", label: "Tiêu đề", minWidth: 100, maxWidth: 150 },
    { id: "image", label: "Hình ảnh", minWidth: 100, maxWidth: 150 },
    { id: "num_likes", label: "Số lượt thích", minWidth: 50 },
    { id: "num_commets", label: "Số lượt comment", minWidth: 50 },
    { id: "location", label: "Nơi đăng", minWidth: 50 },
    { id: "createdAt", label: "Ngày tạo", minWidth: 100 },
    { id: "acc_id", label: "Tài khoản sở hữu", minWidth: 100, maxWidth: 150 },

];

export default function PostTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDelete, setOpenDelete] = useState(false);
    const [postSelected, setPostSeleted] = useState<Post>({
        post_id: "",
        title: "",
        image: "",
        num_likes: 0,
        num_comments: 0,
        location: "",
        createdAt: "",
        acc_id: ""
    });

    const [message, setMessage] = useState("");

    const { data: postData, isSuccess: isFetchPostSuccess, refetch } = useQuery({
        queryKey: ["posts", page, rowsPerPage],
        queryFn: () => postService.getPostWithPagination(page, rowsPerPage),
    });

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleDeletePost = (post: Post) => {
        setOpenDelete(true);
        setPostSeleted(post);
    };

    const handleDeletePostSuccess = () => {
        setMessage("Xóa ài đăng thành công");
        setOpenDelete(false);
        refetch();
    };



    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);


    return (
        <Paper sx={{ width: "95%", overflow: "hidden" }} className="mx-auto mt-10 px-2 py-5 shadow-lg">
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
                                        maxWidth: column.maxWidth || "auto",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell
                                align="center"
                            >
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {postData?.data?.map((post) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={post.post_id}>
                                {columns.map((column) => {
                                    const formattedRow = {
                                        post_id: post.post_id,
                                        title: post.title,
                                        image: (
                                            <img
                                                className="w-16 h-16 rounded-lg"
                                                src={post.image}
                                                alt={post.title}

                                            />
                                        ),
                                        num_likes: post.num_likes,
                                        num_commets: post.num_comments,
                                        location: post.location,
                                        createdAt: handleTime(post.createdAt),
                                        acc_id: post.acc_id,
                                    };

                                    return (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            className="overflow-hidden text-ellipsis whitespace-nowrap"
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
                                    <div className="flex justify-center space-x-2">
                                        <button onClick={() => handleDeletePost(post)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded">
                                            Xóa
                                        </button>
                                        <a
                                            target="_blank"
                                            href={`http://localhost:3000/post/${post.post_id}`}
                                            className="bg-transparent hover:bg-green-500 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded text-green-500"
                                        >
                                            Xem
                                        </a>
                                    </div>
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
                count={postData?.total_record || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Modal
                open={openDelete}
                onClose={() => {
                    setOpenDelete(false);
                }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        TransitionComponent: Fade,
                    },
                }}
            >

                <Fade in={openDelete} timeout={{ enter: 300, exit: 200 }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
                        <DeletePost post={postSelected} onDeleteSuccess={handleDeletePostSuccess} />
                    </div>
                </Fade>
            </Modal>
            {message &&
                <Alert className="fixed bottom-5 right-9 h-16 flex items-center" icon={<FaCircleCheck />} severity="success">
                    {message}
                </Alert>
            }

        </Paper>
    );
}
