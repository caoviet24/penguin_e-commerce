'use client';
import React from 'react';
import Loader from '@/components/Loader/loader';
import axiosJWT from '@/utils/axios.interceptor';
import getRandomVideo from '@/utils/getRandomVideo';
import { accountService } from '@/services/account.service';
import { identityService } from '@/services/identities.service';
import { useAppSelector } from '@/redux/store';
import { boothService } from '@/services/booth.service';
import { list } from 'postcss';
import { categoryService } from '@/services/category.service';
import { productService } from '@/services/product.service';

export default function Setting() {
    const [loading, setLoading] = React.useState(false);
    const [option, setOption] = React.useState('');
    const [value, setValue] = React.useState<number>(0);
    const { account } = useAppSelector(state => state.account);
    const { category } = useAppSelector(state => state.category);
    const { booth } = useAppSelector(state => state.booth);

    


    const handleFakeData = async () => {
        setLoading(true);
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
                    booth_name: `Shop bán hàng ${i}`,
                    booth_description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    avatar: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`,
                    created_by: account[i + 1].id,
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
                const newCategory = {
                    category_name: `Danh mục ${i}`,
                    image: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`,
                    list_category_detail: [
                        {
                            category_detail_name: `Danh mục con ${i}`,
                        },
                        {
                            category_detail_name: `Danh mục con ${i + 1}`,
                        },
                        {
                            category_detail_name: `Danh mục con ${i + 2}`,
                        },
                    ]
                };
                promises.push(categoryService.create(newCategory));
            }
            try {
                await Promise.all(promises);
                console.log('Tất cả các API call đã hoàn thành.');
            } catch (error) {
                console.error('Có lỗi xảy ra khi gọi API:', error);
            }
        }

        if (option === '3') {
            const promises = [];
            const categoriesData = ["59d8d9f3-8b43-40f3-b217-a769bfd7d923", "87d93a2c-fd0d-49dc-868e-5bc907986e52", "6fdd5f97-15b2-470a-ac87-4d3a2ac806ab",
                "e7e1b2fe-e39e-4ca5-a529-26d318809ca2","0625d06e-173c-4c7d-9039-5b9e9e017377", "59d8d9f3-8b43-40f3-b217-a769bfd7d923", "87d93a2c-fd0d-49dc-868e-5bc907986e52", "6fdd5f97-15b2-470a-ac87-4d3a2ac806ab",
                "e7e1b2fe-e39e-4ca5-a529-26d318809ca2","0625d06e-173c-4c7d-9039-5b9e9e017377", 
            ]
            const colors = ["Đỏ", "Xanh", "Vàng", "Trắng", "Đen", "Hồng", "Tím", "Xám", "Nâu", "Cam", "Be"];
            const sizes = ["S", "M", "L", "XL", "XXL", "2XL", "3XL", "4XXL", "5XL", "6XL"];

            for (let i = 0; i < value; i++) {
                const newProduct = {
                    booth_id: 'ab1f06cc-432a-4e4e-86ef-867f26396b10',
                    product_desc: `Mô tả chi tiết sản phẩm thứ ${i}`,
                    category_detail_id: categoriesData[Math.floor(Math.random() * 10)],
                    list_product_detail: 
                        [0, 1, 2].map((_, idx) => {
                            return {
                                product_name: `Chi tiết sản phẩm ${i}_${idx + 1}`,
                                image: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`,
                                sale_price: (1500 + Math.floor(Math.random() * 6)) * 1000,
                                promotional_price: (1000 + Math.floor(Math.random() * 4)) * 1000, 
                                stock_quantity: Math.floor(Math.random() * 100),
                                color: colors[Math.floor(Math.random() * 10)],
                                sizes: [
                                    sizes[Math.floor(Math.random() * 3)], 
                                    sizes[3 + Math.floor(Math.random() * 3)],
                                    sizes[6 + Math.floor(Math.random() * 3)]
                                ]
                            };
                        })
                    
                };
                promises.push(productService.create(newProduct));
            }
         
                await Promise.all(promises);
                console.log('Tất cả các API call đã hoàn thành.');
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
                    <option value="2">Danh mục</option>
                    <option value="3">Sản phẩm</option>
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
