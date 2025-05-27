
"use client";
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import { Divider } from '@mui/material';

import { FaClock } from "react-icons/fa";
import { ChartData } from '@/types';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartLine({ chartData }: { chartData: ChartData }) {
    const _chartData = {
        labels: chartData?.data?.map((item: { day: string }) => item.day) || [],
        datasets: [
            {
                label: chartData?.lable,
                data: chartData?.data?.map((item: { num: number }) => item.num) || [],
                borderColor: chartData.lineColor,
                backgroundColor: chartData.backgroundColor,
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
        },
    };


    return (
        <>
            {_chartData &&
                <div className='w-full h-full'>
                    <Line data={_chartData} options={options} />
                    <div className='py-3 px-6'>
                        <div className='flex items-center justify-between'>
                            <p className='text-xl font-semibold py-2'>Biểu đồ</p>
                            <div className='flex items-center justify-end gap-2'>
                                <div className='h-3 w-10 border-2 border-solid' style={{
                                    backgroundColor: chartData.backgroundColor,
                                    borderColor: chartData.lineColor,
                                }}>

                                </div>
                                <p>{chartData?.lable}</p>
                            </div>
                        </div>
                        <p className='opacity-70'>{chartData.title}</p>

                    </div>

                    <div className='px-6'>
                        <Divider />
                        <div className='flex flex-row items-center gap-3 opacity-70 mt-3'>
                            <FaClock />
                            <p>Vừa cập nhật</p>
                        </div>
                    </div>
                </div>
            }
        </>

    )
}
