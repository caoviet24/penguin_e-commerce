"use client";
import EvaluateForm from "@/components/EvaluateForm/EvaluateForm";
import useHookMutation from "@/hooks/useHookMutation";
import { useAppSelector } from "@/redux/store";
import { billService } from "@/services/bill.service";
import { ISaleBill, ResponseData } from "@/types";
import { Divider, Modal } from "@mui/material";
import { useQueries} from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { CiShop } from "react-icons/ci";
import { FaFacebookMessenger } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

export default function Purchase() {
    const { my_account } = useAppSelector(state => state.account);
    const [tabActice, setTabActive] = React.useState(0);
    const [tabData, setTabData] = React.useState<ResponseData<ISaleBill>>();
    const [billSelected, setBillSelected] = React.useState<ISaleBill>();
    const statusMessages = {
        0: "Người gửi đang chuẩn bị hàng",
        1: "Đang giao hàng",
        2: "Đơn hàng giao thành công",
        3: "Đơn hàng đã hủy",
        4: "Đơn hàng bị hủy"
    };
    const handleChangeTab = (idx: number) => {
        setTabActive(idx);
    };



    const resultBillData = useQueries({
        queries: [
            {
                queryKey: ["bill-wait", my_account.id, tabActice === 0],
                queryFn: () => billService.getStatusWaitByBuyerId({
                    buyer_id: my_account.id,
                    status: tabActice,
                    page_number: 1,
                    page_size: 10
                }),
                enabled: tabActice === 0
            },
            {
                queryKey: ["bill-transport", my_account.id, tabActice === 1],
                queryFn: () => billService.getStatusWaitByBuyerId({
                    buyer_id: my_account.id,
                    status: tabActice,
                    page_number: 1,
                    page_size: 10
                }),
                enabled: tabActice === 1
            },
            {
                queryKey: ["bill-success", my_account.id, tabActice === 2],
                queryFn: () => billService.getStatusWaitByBuyerId({
                    buyer_id: my_account.id,
                    status: tabActice,
                    page_number: 1,
                    page_size: 10
                }),
                enabled: tabActice === 2
            },
            {
                queryKey: ["bill-cancel", my_account.id, tabActice === 3],
                queryFn: () => billService.getStatusWaitByBuyerId({
                    buyer_id: my_account.id,
                    status: tabActice,
                    page_number: 1,
                    page_size: 10
                }),
                enabled: tabActice === 3
            },
            {
                queryKey: ["seller-cancel", my_account.id, tabActice === 4],
                queryFn: () => billService.getStatusWaitByBuyerId({
                    buyer_id: my_account.id,
                    status: tabActice,
                    page_number: 1,
                    page_size: 10
                }),
                enabled: tabActice === 4
            }
        ]
    });

    useEffect(() => {
        if (resultBillData[tabActice].isSuccess) {
            setTabData(resultBillData[tabActice].data);
        }
    }, [resultBillData, tabActice]);

    const updateStatusBillMutation = useHookMutation((data: any) => billService.updateStatus(data));
    const handleUpdateStatus = (status: number, bill_id: string) => {
        updateStatusBillMutation.mutate({
            status: status,
            bill_id: bill_id
        }, {
            onSuccess: () => {
                resultBillData[tabActice].refetch();
                toast.success("Cập nhật trạng thái đơn hàng thành công", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            },
            onError: () => {
                toast.error("Cập nhật trạng thái đơn hàng thất bại", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        });
    };

    const handleEvaluateSuccess = () => {
        toast.success("Đánh giá thành công", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setBillSelected(undefined);
    }


    return (
        <div className="container my-10">
            <div className="bg-white grid grid-cols-5 w-full mt-5">
                {["Chờ lấy hàng", "Vận chuyển", "Hoàn thành", "Đã Hủy", "Bị hủy"].map((a, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleChangeTab(idx)}
                        className={`py-2 text-gray-500 relative ${tabActice === idx && "!text-black"}`}
                    >
                        {a}
                        {tabActice === idx && (
                            <div className="absolute w-full h-[2px] bg-purple-500 bottom-0 left-0"></div>
                        )}
                    </button>
                ))}
            </div>
            <div className="relative mt-2">
                <input
                    className="w-full bg-gray-100 text-gray-700 text-sm border border-gray-300 rounded-md pl-3 pr-28 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-purple-500 hover:border-gray-400 shadow-sm focus:shadow-md"
                    placeholder="Nhập từ khóa tìm kiếm...."
                />
                <button className="absolute top-1 right-1 flex items-center rounded bg-purple-600 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-md focus:bg-purple-500 focus:shadow-none active:bg-purple-500 hover:bg-purple-500 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                    <BiSearchAlt2 size={20} />
                    <span className="ml-1">Tìm kiếm</span>
                </button>
            </div>

            <div>
                {tabData && tabData.data.length > 0 && tabData.data.map((item: ISaleBill, idx: number) => (
                    <div key={item.id} className="bg-white p-3 mt-3">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <CiShop size={30} />
                                <span className="text-lg capitalize">{item.booth.booth_name}</span>
                                <div className='flex gap-2'>
                                    <button className='bg-orange-200 text-orange-500 border border-solid border-orange-500 flex items-center gap-2 py-1 px-3'>
                                        <FaFacebookMessenger size={15} />
                                        <span>Chat ngay</span>
                                    </button>
                                    <Link href={`/shop/${item.booth.id}`} className='flex items-center gap-2 border border-solid border-gray-200 py-1 px-3'>
                                        <CiShop size={20} />
                                        <span>Xem shop</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2 text-[#51A99C]">
                                <Image src='/images/freeship.avif' alt='freeship' width={24} height={24} />
                                <span>{statusMessages[item.status_bill as keyof typeof statusMessages]}
                                </span>
                            </div>
                        </div>

                        <Divider className="py-2" />
                        {item.list_sale_bill_detail.map((b, idx) => (
                            <div key={idx} className="flex justify-between items-center gap-2 py-2">
                                <div>
                                    <Image src={b.product_detail.image} alt={b.product_detail.product_name} width={70} height={70} />
                                </div>
                                <div className="flex flex-1 flex-col">
                                    <p>{b.product_detail.product_name}</p>
                                    <p>Phân loại hàng: {b.size} - {b.color}</p>
                                    <p>x{b.quantity}</p>
                                </div>
                                <div>
                                    {b.product_detail.promotional_price > 0 ?
                                        <div className="flex flex-row gap-2">
                                            <p className="line-through opacity-60">{b.product_detail.sale_price.toLocaleString()}đ</p>
                                            <p className="text-red-500">{b.product_detail.promotional_price.toLocaleString()}đ</p>
                                        </div>
                                        :
                                        <p>{b.product_detail.sale_price.toLocaleString()}đ</p>
                                    }
                                </div>
                            </div>
                        ))}

                        <Divider className="py-2" />

                        <div className="flex justify-end items-center py-5 mt-2">
                            <p>Tổng tiền:</p>
                            <p className="text-3xl text-red-500">{item.total_bill.toLocaleString()}đ</p>
                        </div>
                        <div className="flex justify-end items-center gap-2 mt-2">
                            <button className="bg-white font-medium border opacity-70 border-solid border-purple-500 px-4 py-[8px] rounded transition">
                                Liên hệ người bán
                            </button>
                            {item.status_bill === 0 &&
                                <button onClick={() => handleUpdateStatus(3, item.id)} className="bg-purple-500 text-white font-medium px-4 py-[9px] rounded transition ">
                                    Hủy đơn hàng
                                </button>}
                            {item.status_bill === 1 &&
                                <button onClick={() => handleUpdateStatus(2, item.id)} className="bg-purple-500 text-white font-medium px-4 py-[9px] rounded transition ">
                                    Đã nhận được hàng
                                </button>}
                            {item.status_bill === 2 &&
                                <button onClick={() => setBillSelected(item)} className="bg-purple-500 text-white font-medium px-4 py-[9px] rounded transition ">
                                    Đánh giá
                                </button>}
                            {item.status_bill === 3 && <button className="bg-purple-500 text-white font-medium px-4 py-[9px] rounded transition ">
                                Mua lại hàng
                            </button>}
                        </div>
                    </div>
                ))}
            </div>
            <Modal 
             open={!!billSelected} 
             className="flex items-center justify-center"
            onClose={() => setBillSelected(undefined)}
            >
                <div>
                    {billSelected && <EvaluateForm bill={billSelected} onSuccess={handleEvaluateSuccess} />}
                </div>
            </Modal>
            <ToastContainer />
        </div>
    );
}
