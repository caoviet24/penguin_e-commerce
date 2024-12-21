'use client';
import React from 'react';
import Loader from '@/components/Loader/loader';
import axiosJWT from '@/utils/axios.interceptor';
import { postService } from '@/services/post.service';
import getRandomVideo from '@/utils/getRandomVideo';
import { videoService } from '@/services/video.service';
import { accountService } from '@/services/account.service';

export default function Setting() {
    const [loading, setLoading] = React.useState(false);
    const [option, setOption] = React.useState('');
    const [value, setValue] = React.useState<number>(0);

    const handleFakeData = async () => {
        setLoading(true);
        const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
        const now = Date.now();
        if (option === '0') {
            const promises = [];
            for (let i = 0; i < value; i++) {
                const randomTimestamp = Math.floor(Math.random() * (now - startOfYear) + startOfYear);
                const randomDate = new Date(randomTimestamp);

                const newAccount = {
                    username: `user${Math.floor(Math.random() * 10000000)}`,
                    password: '1',
                    avatar: 'https://i.ibb.co/HzQFc4w/white-avatar.png',
                    createdAt: randomDate,
                    updatedAt: randomDate,
                };

                promises.push(accountService.createAccount(newAccount));
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
                const randomTimestamp = Math.floor(Math.random() * (now - startOfYear) + startOfYear);
                const randomDate = new Date(randomTimestamp);
                const newPost = {
                    acc_id: 'system',
                    image: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`,
                    isComment: true,
                    location: null,
                    num_comments: 0,
                    num_likes: 0,
                    privacy: false,
                    tag: null,
                    title: 'Bài viết số ' + Math.floor(Math.random() * 1000),
                    createdAt: randomDate,
                    updatedAt: randomDate,
                };
                promises.push(postService.createPost(newPost));
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
                const randomTimestamp = Math.floor(Math.random() * (now - startOfYear) + startOfYear);
                const randomDate = new Date(randomTimestamp);
                const newVideo = {
                    acc_id: 'system',
                    video: `https://res.cloudinary.com/dwtfspdzw/video/upload/v1734513975/videos/z8j80k3pmbruj4a9cik1.mp4`,
                    isComment: true,
                    location: null,
                    num_comments: 0,
                    num_likes: 0,
                    privacy: false,
                    tag: null,
                    title: 'Video số ' + Math.floor(Math.random() * 1000),
                    createdAt: randomDate,
                    updatedAt: randomDate,
                };
                promises.push(videoService.createVideo(newVideo));
            }
            try {
                await Promise.all(promises);
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
                    <option value="1">Bài đăng</option>
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
                className={`${
                    loading && 'bg-blue-300'
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
