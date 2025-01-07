"use client";
import { useAppSelector } from "@/redux/store";
import { billService } from "@/services/bill.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";

export default function Purchase() {
    const { my_account } = useAppSelector(state => state.account);
    const [tabActice, setTabActive] = React.useState(0);
    const [tabData, setTabData] = React.useState([]);

    const handleChangeTab = (idx: number) => {
        setTabActive(idx);
    };


    const { data } = useQuery({
        queryKey: ["get-bill-wait-by-buyer-id",],
        queryFn: () => billService.getStatusWaitByBuyerId({ buyer_id: my_account.id, page_number: 1, page_size: 100 }),
        enabled: tabActice === 0,
    })

    return (
        <div className="container">
            <div className="bg-white grid grid-cols-4 w-full mt-5">
                {["Chờ lấy hàng", "Vận chuyển", "Hoàn thành", "Đã Hủy"].map((a, idx) => (
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

            </div>
        </div>
    );
}
