"use client"

import ChartBar from '@/components/chart_component/ChartBar/chartBar'
import ChartLine from '@/components/chart_component/ChartLine/chartLine'
import { useAppSelector } from '@/redux/store'
import { statisticalService } from '@/services/statistical.service'
import type { Statistical } from '@/types'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'

export default function Statistical() {

    const { my_booth } = useAppSelector(state => state.booth);
    const [optTime, setOptTime] = React.useState<'day' | 'week' | 'month' | 'year' | 'range'>('day');
    const [optChart, setOptChart] = React.useState<'line' | 'bar'>('line');

    const { data: statisticalData, isSuccess, refetch } = useQuery({
        queryKey: ['BySeller', { query: { mode: optTime, id: my_booth.id } }],
        queryFn: () => statisticalService.bySeller({
            mode: optTime,
            seller_id: my_booth.id
        }),
    });

    const { data: totalData } = useQuery({
        queryKey: ['get-total', my_booth.id],
        queryFn: () => statisticalService.getTotalBySeller(my_booth.id),
    });

    return (
        <div className='container bg-white p-5 rounded-lg my-10'>
            <h1 className='text-2xl font-semibold'>Thống kê</h1>
            <div>
                <div className='grid grid-cols-4 gap-5 mt-5'>
                    <div className='bg-blue-500 p-5 rounded-lg'>
                        <h2 className='text-white text-lg font-semibold'>Tổng số đơn hàng</h2>
                        <p className='text-white text-2xl font-semibold'>{totalData?.bills_sold}</p>
                    </div>

                    <div className='bg-orange-500 p-5 rounded-lg'>
                        <h2 className='text-white text-lg font-semibold'>Tổng thu nhập</h2>
                        <p className='text-white text-2xl font-semibold'>{totalData?.total?.toLocaleString()} VNĐ</p>
                    </div>
                    <div className='bg-green-500 p-5 rounded-lg'>
                        <h2 className='text-white text-lg font-semibold'>Số sản phầm hợp lệ</h2>
                        <p className='text-white text-2xl font-semibold'>{totalData?.total_active}</p>
                    </div>

                    <div className='bg-cyan-500 p-5 rounded-lg'>
                        <h2 className='text-white text-lg font-semibold'>Số sản phầm chờ</h2>
                        <p className='text-white text-2xl font-semibold'>{totalData?.total_inactive}</p>
                    </div>

                </div>

                <div className='mt-5'>
                    <p className='text-xl font-bold'>Doanh thu doanh thu</p>
                    <div className='flex flex-row flex-nowrap justify-end gap-2'>
                        <button className={` text-white py-1 px-2 rounded-lg text-sm ${optTime === 'day' ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setOptTime('day')}>
                            Hôm nay
                        </button>
                        <button className={` text-white py-1 px-2 rounded-lg text-sm ${optTime === 'week' ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setOptTime('week')}>
                            Tuần này
                        </button>
                        <button className={` text-white py-1 px-2 rounded-lg text-sm ${optTime === 'month' ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setOptTime('month')}>
                            Tháng này
                        </button>
                        <button className={` text-white py-1 px-2 rounded-lg text-sm ${optTime === 'year' ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setOptTime('year')}>
                            Năm nay
                        </button>
                        <button className={` text-white py-1 px-2 rounded-lg text-sm ${optTime === 'range' ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setOptTime('range')}>
                            Mốc thời gian
                        </button>
                    </div>
                    <div className='flex justify-end outline-none'>
                        <select
                            value={optChart}
                            onChange={(e) => setOptChart(e.target.value as any)}
                            className='w-1/4 mt-5 border-2 border-solid border-blue-500 rounded-lg p-0.5 text-sm'
                        >
                            <option value='line'>Biểu đồ đường</option>
                            <option value='bar'>Biểu đồ cột</option>
                        </select>
                    </div>
                    <div className='flex flex-row flex-nowrap gap-5 mt-5'>
                        {(optChart === 'line' && optTime !== 'day') && <ChartLine chartData={{
                            data: statisticalData,
                            title: 'Biểu đồ doanh thu cửa hàng',
                            lable: 'Doanh thu',
                            lineColor: '#3182CE',
                            backgroundColor: 'rgba(49, 130, 206, 0.1)',
                        }} />}



                        {(optChart === 'bar' || optTime === 'day') && <ChartBar chartData={{
                            data: statisticalData,
                            title: 'Biểu đồ doanh thu',
                            lable: 'Doanh thu',
                            lineColor: '#3182CE',
                            backgroundColor: 'rgba(49, 130, 206, 0.1)',
                        }} />}
                        <div className='flex flex-col gap-2'>
                            <div className='bg-blue-500 p-5 rounded-lg h-[150px]'>
                                <h2 className='text-white text-lg font-semibold'>Tổng hoá đơn đã bán</h2>
                                <p className='text-white text-2xl font-semibold'>
                                    {statisticalData && statisticalData?.reduce((total: number, s: Statistical) => total + s.products_sold, 0)} hóa đơn
                                </p>
                            </div>

                            <div className='bg-orange-500 p-5 rounded-lg h-[150px]'>
                                <h2 className='text-white text-lg font-semibold'>Tổng doanh thu</h2>
                                <p className='text-white text-2xl font-semibold'>
                                    {statisticalData && statisticalData?.reduce((total: number, s: Statistical) => total + s.total, 0).toLocaleString()} VNĐ
                                </p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}
