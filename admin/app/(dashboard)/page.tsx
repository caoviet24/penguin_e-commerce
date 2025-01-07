'use client';
import React, { useState, useEffect, use } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import Card from '@/components/Card/card';
import { statisticalService } from '@/services/statistical.service';
import { ChartData, StatisticalData, StatisticalData2 } from '@/types';
import { IoMdMore } from 'react-icons/io';
import ChartLine from '@/components/chart_component/ChartLine/chartLine';
import { Popper } from '@mui/material';
import { accountService } from '@/services/account.service';
import { AccountIcon, PostIcon, UserIcon, VideoIcon } from '@/components/Icons';
import { postService } from '@/services/post.service';
import { videoService } from '@/services/video.service';
import Cookie from 'js-cookie';
import getDateRange from '@/utils/getDateRange';
import ChartBar from '@/components/chart_component/ChartBar/chartBar';
import RenderWithCondition from '@/components/RenderWithCondition/renderwithcondition';
import AnimatedNumber from '@/components/NumberAnimate/numberAnimate';
import { useSocket } from '@/providers/socket.provider';

export default function DashBoard() {
    const [timeOption, setTimeOption] = useState<'day' | 'week' | 'month' | 'year' | 'range'>('day');
    const [archerElMore, setArcherElMore] = useState<Element | null>(null);
    const [openTimePicker, setOpenTimePicker] = useState<boolean>(false);
    const [accountOnline, setAccountOnline] = useState<number>(0);

    const socket = useSocket();

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

    const { start_date, end_date } = getDateRange(timeOption);

    const {
        data: accountsOnlineData,
        isSuccess: isFetchAccountOnlineSuccess,
        refetch: refetchAccountOnline,
    } = useQuery({
        queryKey: ['get-accounts-online'],
        queryFn: accountService.getAccountOnline,
        enabled: !!Cookie.get('access_token'),
    });

    const [
        statistalcalCardDataAccount,
        statistalcalCardDataPost,
        statistalcalCardDataVideo,
        statistalcalChartDataAccount,
        statistalcalChartDataPost,
        statistalcalChartDataVideo,
    ] = useQueries({
        queries: [
            {
                queryKey: ['get-statistical-account-2', start_date, end_date],
                queryFn: () => accountService.getStatisticalAccount(start_date, end_date),
                enabled: !!Cookie.get('access_token'),
            },
            {
                queryKey: ['get-statistical-post-2', start_date, end_date],
                queryFn: () => postService.getStatisticalPost(start_date, end_date),
                enabled: !!Cookie.get('access_token'),
            },
            {
                queryKey: ['get-statistical-video-2', start_date, end_date],
                queryFn: () => videoService.getStatisticalVideo(start_date, end_date),
                enabled: !!Cookie.get('access_token'),
            },
            {
                queryKey: ['get-num-account-by-time', start_date, end_date],
                queryFn: () => statisticalService.getNumAccountByTime(start_date, end_date, timeOption),
                enabled: !!start_date && !!end_date && !!Cookie.get('access_token'),
            },
            {
                queryKey: ['get-num-post-by-time', start_date, end_date],
                queryFn: () => statisticalService.getNumPostByTime(start_date, end_date, timeOption),
                enabled: !!start_date && !!end_date && !!Cookie.get('access_token'),
            },
            {
                queryKey: ['get-num-video-by-time', start_date, end_date],
                queryFn: () => statisticalService.getNumVideoByTime(start_date, end_date, timeOption),
                enabled: !!start_date && !!end_date && !!Cookie.get('access_token'),
            },
        ],
    });

    useEffect(() => {
        if (isFetchAccountOnlineSuccess) {
            setAccountOnline(accountsOnlineData?.total);
        }
    }, [isFetchAccountOnlineSuccess, accountsOnlineData]);

    useEffect(() => {
        socket.emit('join-room-userId', 'system');

        return () => {
            socket.emit('leave-room-userId', 'system');
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('user-online', (data: any) => {

                setTimeout(() => {
                    refetchAccountOnline();
                }, 2000);
            });

            socket.on('user-offline', (data: any) => {
                console.log(data);

                refetchAccountOnline();
                setTimeout(() => {}, 1000);
            });
        }

        return () => {
            socket.off('user-online');
            socket.off('user-offline');
        };
    }, [socket]);

    return (
        <div className="flex flex-col bg-gray-100">
            <div className="w-11/12 mx-auto mt-4 bg-white  p-5">
                <div className="flex items-center gap-4">
                    <span className="relative flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
                    </span>
                    <p className="font-bold text-xl">Số Người dùng đang hoạt động :</p>
                </div>
                <div className="mt-5">
                    <AnimatedNumber count={accountOnline} />
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-1.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Select date end"
                            />
                        </div>
                        <button className="px-5 w-50 py-1.5 bg-slate-200 text-center rounded-full">OK</button>
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
                <div className="grid grid-cols-4 gap-6 w-full mx-auto mt-6">
                    <Card
                        cardData={{
                            rate: statistalcalCardDataAccount.data?.rate ?? 0,
                            title: 'Tài khoản',
                            total: statistalcalCardDataAccount.data?.total ?? 0,
                            icon: <AccountIcon size={35} />,
                        }}
                    />
                    <Card
                        cardData={{
                            rate: statistalcalCardDataAccount.data?.rate ?? 0,
                            title: 'Người dùng',
                            total: statistalcalCardDataAccount.data?.total ?? 0,
                            icon: <UserIcon size={35} />,
                        }}
                    />
                    <Card
                        cardData={{
                            rate: statistalcalCardDataPost.data?.rate ?? 0,
                            title: 'Bài đăng',
                            total: statistalcalCardDataPost.data?.total ?? 0,
                            icon: <PostIcon size={35} />,
                        }}
                    />
                    <Card
                        cardData={{
                            rate: statistalcalCardDataVideo.data?.rate ?? 0,
                            title: 'Video',
                            total: statistalcalCardDataVideo.data?.total ?? 0,
                            icon: <VideoIcon size={35} />,
                        }}
                    />
                </div>

                <div className="grid grid-cols-3 gap-6 py-2">
                    <RenderWithCondition condition={timeOption === 'day'}>
                        <div className="flex items-center justify-center w-full p-5 bg-white rounded-lg shadow-lg">
                            <ChartBar
                                chartData={{
                                    title: `Biểu đồ tài khoản đăng kí ${
                                        timeOption === 'day' ? 'hôm nay' : start_date + ' đến ' + end_date
                                    }`,
                                    lable: 'Số lượng tài khoản',
                                    data: statistalcalChartDataAccount.data,
                                    lineColor: 'rgba(75, 192, 192, 1)',
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-center w-full p-5 bg-white rounded-lg shadow-lg">
                            <ChartBar
                                chartData={{
                                    title: `Biểu đồ số lượng bài đăng ${
                                        timeOption === 'day' ? 'hôm nay' : start_date + ' đến ' + end_date
                                    }`,
                                    lable: 'Số lượng bài đăng',
                                    data: statistalcalChartDataPost.data,
                                    lineColor: 'rgba(255, 205, 86, 1)',
                                    backgroundColor: 'rgba(255, 205, 86, 0.2)',
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-center w-full p-5 bg-white rounded-lg shadow-lg">
                            <ChartBar
                                chartData={{
                                    title: `Biểu đồ số lượng video ${
                                        timeOption === 'day' ? 'hôm nay' : start_date + ' đến ' + end_date
                                    }`,
                                    lable: 'Số lượng video',
                                    data: statistalcalChartDataVideo.data,
                                    lineColor: 'rgba(255, 99, 132, 1)',
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                }}
                            />
                        </div>
                    </RenderWithCondition>

                    <RenderWithCondition condition={timeOption !== 'day'}>
                        <div className="flex items-center justify-center w-full p-5 bg-white rounded-lg shadow-lg">
                            <ChartLine
                                chartData={{
                                    title: `Biểu đồ số lượng tài khoản ${
                                        timeOption === 'day' ? 'hôm nay' : start_date + ' đến ' + end_date
                                    }`,
                                    lable: 'Số lượng tài khoản',
                                    data: statistalcalChartDataAccount.data,
                                    lineColor: 'rgba(75, 192, 192, 1)',
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-center w-full p-5 bg-white rounded-lg shadow-lg">
                            <ChartLine
                                chartData={{
                                    title: `Biểu đồ số lượng bài đăng ${
                                        timeOption === 'day' ? 'hôm nay' : start_date + ' đến ' + end_date
                                    }`,
                                    lable: 'Số lượng bài đăng',
                                    data: statistalcalChartDataPost.data,
                                    lineColor: 'rgba(255, 205, 86, 1)',
                                    backgroundColor: 'rgba(255, 205, 86, 0.2)',
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-center w-full p-5 bg-white rounded-lg shadow-lg">
                            <ChartLine
                                chartData={{
                                    title: `Biểu đồ số lượng video ${
                                        timeOption === 'day' ? 'hôm nay' : start_date + ' đến ' + end_date
                                    }`,
                                    lable: 'Số lượng video',
                                    data: statistalcalChartDataVideo.data,
                                    lineColor: 'rgba(255, 99, 132, 1)',
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                }}
                            />
                        </div>
                    </RenderWithCondition>
                </div>
            </div>
        </div>
    );
}
