'use client';
import React from 'react';
import Loader from '@/components/Loader/loader';
import axiosJWT from '@/utils/axios.interceptor';
import getRandomVideo from '@/utils/getRandomVideo';
import { accountService } from '@/services/account.service';
import { identityService } from '@/services/identities.service';
import { useAppSelector } from '@/redux/store';
import { boothService } from '@/services/booth.service';

export default function Setting() {
    const [loading, setLoading] = React.useState(false);
    const [option, setOption] = React.useState('');
    const [value, setValue] = React.useState<number>(0);
    const { account } = useAppSelector(state => state.account)

    const handleFakeData = async () => {
        setLoading(true);
        const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
        const now = Date.now();
        if (option === '0') {
            const promises = [];
            for (let i = 0; i < value; i++) {
                const newAccount = {
                    username: `user${Math.floor(Math.random() * 10000000)}`,
                    password: '1'
                };

                promises.push(identityService.register(newAccount));
            }

            try {
                await Promise.all(promises);
                console.log('Tất cả các API call đã hoàn thành.');
            } catch (error) {
                console.error('Có lỗi xảy ra khi gọi API:', error);
            }
        }

        if (option === '1') {
            const promises = [];
            for (let i = 0; i < value; i++) {
                const newBooth = {
                    booth_name: `Shop bán hàng ${i}` ,              
                    booth_description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    avatar: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`,
                    created_by : account[i].id,
                };
                promises.push(boothService.create(newBooth));
            }

            try {
                await Promise.all(promises);
                console.log('Tất cả các API call đã hoàn thành.');
            } catch (error) {
                console.error('Có lỗi xảy ra khi gọi API:', error);
            }
        }

        if (option === '2') {
            const promises = [];
            for (let i = 0; i < value; i++) {
                const newBooth = {

                };
                // promises.push(videoService.createVideo(newVideo));
            }
            try {
                // await Promise.all(promises);
                console.log('Tất cả các API call đã hoàn thành.');
            } catch (error) {
                console.error('Có lỗi xảy ra khi gọi API:', error);
            }
        }

        setLoading(false);
    };

    return (
        <div className="w-11/12 mx-auto h-full bg-white mt-4 p-5">
            <div className="w-96">
                <label htmlFor="data" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                    Fake data
                </label>
                <select
                    onChange={(e) => setOption(e.target.value)}
                    id="data"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option>Chọn dữ liệu</option>
                    <option value="0">Tài khoản</option>
                    <option value="1">Gian hàng</option>
                    <option value="2">Video</option>
                </select>
            </div>
            <input
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                type="text"
                className="mt-4 p-2 border border-gray-300 rounded-lg"
                placeholder="Số lượng"
            />
            <button
                disabled={loading}
                onClick={handleFakeData}
                className={`${loading && 'bg-blue-300'
                    } relative mt-2 ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            >
                Excute
                {loading && (
                    <Loader className="absolete top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size="sm" />
                )}
            </button>
        </div>
    );
}
