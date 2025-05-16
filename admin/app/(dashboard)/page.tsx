'use client';
import React, { useState, useEffect } from 'react';
import { IoMdMore } from 'react-icons/io';
import { FaUsers, FaStore, FaBoxOpen } from 'react-icons/fa';

import { Popper } from '@mui/material';
import AnimatedNumber from '@/components/NumberAnimate/numberAnimate';
import { useSocket } from '@/providers/socket.provider';
import ChartBar from '@/components/chart_component/ChartBar/chartBar';
import ChartLine from '@/components/chart_component/ChartLine/chartLine';
import { CardData, ChartData, StatisticalData } from '@/types';

export default function DashBoard() {
    const [timeOption, setTimeOption] = useState<'day' | 'week' | 'month' | 'year' | 'range'>('day');
    const [archerElMore, setArcherElMore] = useState<Element | null>(null);
    const [openTimePicker, setOpenTimePicker] = useState<boolean>(false);
    const [accountOnline] = useState<number>(0);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    
    // Mockup data for statistics
    const [userStats] = useState<CardData>({
        total: 1245,
        rate: 15,
        title: 'Người dùng',
        icon: <FaUsers className="text-blue-500" size={24} />
    });
    
    const [shopStats] = useState<CardData>({
        total: 87,
        rate: 8,
        title: 'Gian hàng',
        icon: <FaStore className="text-green-500" size={24} />
    });
    
    const [productStats] = useState<CardData>({
        total: 3567,
        rate: 23,
        title: 'Sản phẩm',
        icon: <FaBoxOpen className="text-orange-500" size={24} />
    });

    // Mock chart data
    const [userChartData, setUserChartData] = useState<ChartData>({
        data: generateMockDataByTimeOption('day'),
        title: 'Thống kê người dùng theo thời gian',
        lable: 'Người dùng',
        lineColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)'
    });

    const [shopChartData, setShopChartData] = useState<ChartData>({
        data: generateMockDataByTimeOption('day'),
        title: 'Thống kê gian hàng theo thời gian',
        lable: 'Gian hàng',
        lineColor: 'rgba(34, 197, 94, 0.8)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)'
    });
    
    const [productChartData, setProductChartData] = useState<ChartData>({
        data: generateMockDataByTimeOption('day'),
        title: 'Thống kê sản phẩm theo thời gian',
        lable: 'Sản phẩm',
        lineColor: 'rgba(249, 115, 22, 0.8)',
        backgroundColor: 'rgba(249, 115, 22, 0.2)'
    });

    // Socket connection - can be used for real-time data
    useSocket();

    useEffect(() => {
        // Update chart data when time option changes
        setUserChartData({
            ...userChartData,
            data: generateMockDataByTimeOption(timeOption),
        });
        
        setShopChartData({
            ...shopChartData,
            data: generateMockDataByTimeOption(timeOption),
        });
        
        setProductChartData({
            ...productChartData,
            data: generateMockDataByTimeOption(timeOption),
        });
    }, [timeOption]);
    
    // Function to generate mock data based on time option
    function generateMockDataByTimeOption(option: string): StatisticalData[] {
        const data: StatisticalData[] = [];
        const today = new Date();
        
        if (option === 'day') {
            // Last 24 hours by hour
            for (let i = 0; i < 24; i++) {
                data.push({
                    day: `${i}:00`,
                    num: Math.floor(Math.random() * 100) + 10
                });
            }
        } else if (option === 'week') {
            // Last 7 days
            const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                data.push({
                    day: dayNames[date.getDay()],
                    num: Math.floor(Math.random() * 500) + 50
                });
            }
        } else if (option === 'month') {
            // Last 30 days
            for (let i = 29; i >= 0; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                data.push({
                    day: `${date.getDate()}/${date.getMonth() + 1}`,
                    num: Math.floor(Math.random() * 1000) + 100
                });
            }
        } else if (option === 'year') {
            // 12 months
            const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
            for (let i = 0; i < 12; i++) {
                data.push({
                    day: monthNames[i],
                    num: Math.floor(Math.random() * 10000) + 1000
                });
            }
        } else if (option === 'range' && startDate && endDate) {
            // Custom date range - simplified for mock
            const start = new Date(startDate);
            const end = new Date(endDate);
            const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
            
            for (let i = 0; i < dayCount; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                data.push({
                    day: `${date.getDate()}/${date.getMonth() + 1}`,
                    num: Math.floor(Math.random() * 1000) + 100
                });
            }
        }
        
        return data;
    }

    const handleToggleMoreOptionTime = (e: React.MouseEvent) => {
        setOpenTimePicker(!openTimePicker);
        setArcherElMore(e.currentTarget ? e.currentTarget : null);
    };

    const handleChangeTimeByDay = () => {
        setTimeOption('day');
    };
    const handleChangeTimeByWeek = () => {
        setTimeOption('week');
    };
    const handleChangeTimeByMonth = () => {
        setTimeOption('month');
    };

    const handleChangeTimeByYear = () => {
        setTimeOption('year');
    };




    const handleRangeSearch = () => {
        if (startDate && endDate) {
            setUserChartData({
                ...userChartData,
                data: generateMockDataByTimeOption('range'),
            });
            
            setShopChartData({
                ...shopChartData,
                data: generateMockDataByTimeOption('range'),
            });
            
            setProductChartData({
                ...productChartData,
                data: generateMockDataByTimeOption('range'),
            });
        }
    };

    return (
        <div className="flex flex-col bg-gray-100">
            <div className="w-11/12 mx-auto mt-4 bg-white p-5">
                <div className="flex items-center gap-4">
                    <span className="relative flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
                    </span>
                    <p className="font-bold text-xl">Số Người dùng đang hoạt động:</p>
                </div>
                <div className="mt-5">
                    <AnimatedNumber count={accountOnline} />
                </div>
            </div>
            
            {/* Stats Summary Cards */}
            <div className="w-11/12 mx-auto mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* User Stats Card */}
                <div className="bg-white p-5 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500">{userStats.title}</p>
                            <h3 className="text-2xl font-bold">{userStats.total}</h3>
                            <p className={`text-sm ${userStats.rate > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {userStats.rate > 0 ? '+' : ''}{userStats.rate}% so với tháng trước
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            {userStats.icon}
                        </div>
                    </div>
                </div>
                
                {/* Shop Stats Card */}
                <div className="bg-white p-5 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500">{shopStats.title}</p>
                            <h3 className="text-2xl font-bold">{shopStats.total}</h3>
                            <p className={`text-sm ${shopStats.rate > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {shopStats.rate > 0 ? '+' : ''}{shopStats.rate}% so với tháng trước
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            {shopStats.icon}
                        </div>
                    </div>
                </div>
                
                {/* Product Stats Card */}
                <div className="bg-white p-5 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500">{productStats.title}</p>
                            <h3 className="text-2xl font-bold">{productStats.total}</h3>
                            <p className={`text-sm ${productStats.rate > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {productStats.rate > 0 ? '+' : ''}{productStats.rate}% so với tháng trước
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            {productStats.icon}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-11/12 mx-auto mt-4">
                <div className="flex items-center justify-end gap-3 bg-white py-3 px-5">
                    <div className={`${timeOption === 'range' ? 'flex' : 'hidden'} items-center gap-2`}>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </div>
                            <input
                                name="start"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-1.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Select date start"
                            />
                        </div>
                        <span className="mx-4 text-gray-500">đến</span>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </div>
                            <input
                                name="end"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-1.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Select date end"
                            />
                        </div>
                        <button
                            className="px-5 w-50 py-1.5 bg-slate-200 text-center rounded-full hover:bg-slate-300"
                            onClick={handleRangeSearch}
                        >
                            OK
                        </button>
                    </div>
                    <div className="text-sm px-3 py-1 flex flex-row justify-end items-center gap-2 bg-slate-300 rounded">
                        <button
                            className={`${timeOption === 'day' && 'bg-white'} py-1 px-3 rounded-lg`}
                            onClick={handleChangeTimeByDay}
                        >
                            Hôm nay
                        </button>
                        <button
                            className={`${timeOption === 'week' && 'bg-white'} py-1 px-3 rounded-lg`}
                            onClick={handleChangeTimeByWeek}
                        >
                            Tuần này
                        </button>
                        <button
                            className={`${timeOption === 'month' && 'bg-white'} py-1 px-3 rounded-lg`}
                            onClick={handleChangeTimeByMonth}
                        >
                            Tháng này
                        </button>
                        <button onClick={handleToggleMoreOptionTime}>
                            <IoMdMore />
                            <Popper open={openTimePicker} anchorEl={archerElMore} placement="bottom-end">
                                <div className="flex flex-col items-start bg-white shadow-lg">
                                    <button
                                        onClick={handleChangeTimeByYear}
                                        className="hover:bg-slate-300 w-full text-start py-1 px-2"
                                    >
                                        Năm nay
                                    </button>
                                    <button
                                        onClick={() => setTimeOption('range')}
                                        className="hover:bg-slate-300 w-full text-start py-1 px-2"
                                    >
                                        Mốc thời gian
                                    </button>
                                </div>
                            </Popper>
                        </button>
                    </div>
                </div>
                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto mt-6">
                    {/* User Chart */}
                    <div className="bg-white rounded-lg shadow">
                        <ChartLine chartData={userChartData} />
                    </div>
                    
                    {/* Shop Chart */}
                    <div className="bg-white rounded-lg shadow">
                        <ChartBar chartData={shopChartData} />
                    </div>
                    
                    {/* Product Chart */}
                    <div className="bg-white rounded-lg shadow">
                        <ChartLine chartData={productChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
