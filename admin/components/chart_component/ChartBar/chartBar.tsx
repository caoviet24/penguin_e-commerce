

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { ChartData } from '@/types';
import { Divider } from '@mui/material';
import { FaClock } from 'react-icons/fa';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function ChartBar({ chartData }: { chartData: ChartData }) {
    const data = {
        labels: chartData?.data?.map((item: { day: string }) => item.day) || [],
        datasets: [
            {
                label: chartData?.lable,
                data: chartData?.data?.map((item: { num: number }) => item.num) || [],
                backgroundColor: chartData.backgroundColor,
                borderColor: chartData.lineColor,
                borderWidth: 1,
            },
        ],
    };


    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <>
            {data &&
                <div className='w-full h-full'>
                    <Bar data={data} options={options} />
                    <div className='py-3 px-6'>
                        <div className='flex items-center justify-between pb-2'>
                            <p className='text-xl font-semibold'>Biểu đồ</p>
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
    );
};

