"use client";

import { useAppSelector } from '@/redux/store';
import { Divider } from '@mui/material';
import React from 'react';

export default function AccountId({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = React.use(params);

    const { my_account } = useAppSelector(state => state.account);
    const [formData, setFormData] = React.useState({});

    if (!slug) {
        throw new Error("Slug is undefined or null");
    }

    return (
        <div>
            <div>
                <h2>Hồ sở của tôi</h2>
                <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                <Divider />
                <div>
                    <div>
                        <p>Tên đăng nhập</p>
                        <p>{my_account.user?.nick_name}</p>
                    </div>
                    <div>
                        <p>Tên người dùng</p>
                        <input type="text" value={my_account.user?.full_name} />
                    </div>
                    <div>
                        <p>Ngày sinh</p>
                        <div>
                            <p>Ngày sinh</p>
                            <input
                                type="date"
                                value={my_account.user?.birth && new Date(my_account.user?.birth)?.toISOString().slice(0, 10)}
                            />
                        </div>

                    </div>
                    <div>
                        <p>Số điện thoại</p>
                        <input type="text" value={my_account.user?.phone} />
                    </div>
                    <div>
                        <p>Giới tính</p>
                        <div>
                            <div>
                                <input type="radio" />
                                <label>Nam</label>
                            </div>
                            <div>
                                <input type="radio" />
                                <label>Nữ</label>
                            </div>
                            <div>
                                <input type="radio" />
                                <label>Khác</label>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
