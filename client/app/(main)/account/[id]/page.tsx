'use client';

import { useAppDispatch } from '@/redux/store';
import { accountService } from '@/services/account.service';
import { setMyAcount } from '@/redux/slices/account.slice';
import React from 'react';
import { FaUser, FaEdit, FaSave, FaCamera, FaExclamationCircle, FaUserCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@/hooks/useAuth';

export default function AccountId({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = React.use(params);
    const { user } = useUser();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = React.useState({
        nick_name: user?.user.nick_name || '',
        full_name: user?.user?.full_name || '',
        birth: user?.user?.birth ? new Date(user.user?.birth)?.toISOString().slice(0, 10) : '',
        phone: user?.user?.phone || '',
        gender: user?.user?.gender || 'male',
        address: user?.user?.address || '',
    });

    const [editing, setEditing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [avatarHover, setAvatarHover] = React.useState(false);

    if (!slug) {
        throw new Error('Slug is undefined or null');
    }

    // Handle form change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle radio button change
    const handleGenderChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            gender: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Basic validation
            if (!formData.nick_name.trim()) {
                throw new Error('Tên hiển thị không được để trống');
            }

            if (!formData.full_name.trim()) {
                throw new Error('Tên người dùng không được để trống');
            }

            if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
                throw new Error('Số điện thoại không hợp lệ');
            }

            // Prepare data for API
            const userData = {
                ...user?.user,
                nick_name: formData.nick_name,
                full_name: formData.full_name,
                birth: formData.birth ? new Date(formData.birth) : undefined,
                phone: formData.phone,
                address: formData.address,
                gender: formData.gender,
            };

            // Update user profile
            if (user?.user?.user_id) {
                const result = await accountService.updateUserProfile(user?.user.user_id, userData);

                // Update store with the new data
                dispatch(
                    setMyAcount({
                        ...user,
                        user: result.user || userData,
                    }),
                );

                toast.success('Cập nhật thông tin thành công', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                setEditing(false);
            } else {
                throw new Error('Không tìm thấy thông tin người dùng');
            }
        } catch (err: any) {
            setError(err.message || 'Đã có lỗi xảy ra khi cập nhật thông tin');
            toast.error(err.message || 'Đã có lỗi xảy ra khi cập nhật thông tin', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            nick_name: user?.user.nick_name || '',
            full_name: user?.user?.full_name || '',
            birth: user?.user?.birth ? new Date(user.user?.birth)?.toISOString().slice(0, 10) : '',
            phone: user?.user?.phone || '',
            gender: user?.user?.gender || 'male',
            address: user?.user?.address || '',
        });
        setEditing(false);
        setError(null);
    };

    const getGenderLabel = (gender: string) => {
        switch (gender) {
            case 'male': return 'Nam';
            case 'female': return 'Nữ';
            case 'other': return 'Khác';
            default: return 'Nam';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <ToastContainer />
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Hồ sơ của tôi</h2>
                    <p className="text-blue-100">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>

                <div className="p-6 md:flex">
                    {/* Avatar Section */}
                    <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                        <div className="relative group">
                            <div 
                                className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-50 flex items-center justify-center shadow-md transition-transform transform hover:scale-105"
                                onMouseEnter={() => setAvatarHover(true)}
                                onMouseLeave={() => setAvatarHover(false)}
                            >
                                {user?.user?.avatar ? (
                                    <img
                                        src={user?.user.avatar}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle size={120} className="text-gray-300" />
                                )}
                                
                                <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full transition-opacity ${avatarHover ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="text-white text-sm">Thay đổi ảnh</div>
                                </div>
                            </div>
                            <button
                                className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                                type="button"
                                aria-label="Change avatar"
                            >
                                <FaCamera size={18} />
                            </button>
                        </div>
                        <h3 className="mt-6 text-2xl font-semibold text-gray-800">{user?.user?.nick_name}</h3>
                        <p className="text-blue-500 font-medium">{user?.username}</p>
                        
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors border border-blue-200"
                                type="button"
                            >
                                <FaEdit size={16} />
                                <span>Chỉnh sửa thông tin</span>
                            </button>
                        ) : null}
                    </div>

                    {/* Form Section */}
                    <div className="md:w-2/3 md:pl-10 border-l-0 md:border-l border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">Thông tin cá nhân</h3>
                            {editing && (
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                                    disabled={isLoading}
                                    type="button"
                                >
                                    {isLoading ? (
                                        <span>Đang lưu...</span>
                                    ) : (
                                        <>
                                            <FaSave size={16} />
                                            <span>Lưu thay đổi</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-center gap-3 animate-fadeIn">
                                <FaExclamationCircle className="text-red-500" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Username - Read Only */}
                                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                    <label className="text-gray-700 font-medium">Tên đăng nhập</label>
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            value={user?.username}
                                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500 mt-1 italic">Tên đăng nhập không thể thay đổi</p>
                                    </div>
                                </div>

                                {/* Nickname */}
                                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                    <label className="text-gray-700 font-medium">Tên hiển thị</label>
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            name="nick_name"
                                            value={formData.nick_name}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg transition-colors ${
                                                editing 
                                                    ? 'border-blue-300 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50' 
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
                                            disabled={!editing}
                                        />
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                    <label className="text-gray-700 font-medium">Tên người dùng</label>
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg transition-colors ${
                                                editing 
                                                    ? 'border-blue-300 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50' 
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
                                            disabled={!editing}
                                        />
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                    <label className="text-gray-700 font-medium">Ngày sinh</label>
                                    <div className="md:col-span-2">
                                        <input
                                            type="date"
                                            name="birth"
                                            value={formData.birth}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg transition-colors ${
                                                editing 
                                                    ? 'border-blue-300 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50' 
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
                                            disabled={!editing}
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                    <label className="text-gray-700 font-medium">Số điện thoại</label>
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-lg transition-colors ${
                                                editing 
                                                    ? 'border-blue-300 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50' 
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
                                            disabled={!editing}
                                            placeholder={editing ? "Nhập số điện thoại" : ""}
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4">
                                    <label className="text-gray-700 font-medium pt-3">Địa chỉ</label>
                                    <div className="md:col-span-2">
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={3}
                                            className={`w-full p-3 border rounded-lg transition-colors ${
                                                editing 
                                                    ? 'border-blue-300 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50' 
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
                                            disabled={!editing}
                                            placeholder={editing ? "Nhập địa chỉ" : ""}
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                                    <label className="text-gray-700 font-medium">Giới tính</label>
                                    <div className="md:col-span-2">
                                        {editing ? (
                                            <div className="flex gap-6">
                                                {['male', 'female', 'other'].map((gender) => (
                                                    <div key={gender} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            id={`gender-${gender}`}
                                                            name="gender"
                                                            checked={formData.gender === gender}
                                                            onChange={() => handleGenderChange(gender)}
                                                            className="w-4 h-4 text-blue-600 cursor-pointer focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                        />
                                                        <label htmlFor={`gender-${gender}`} className="cursor-pointer">
                                                            {getGenderLabel(gender)}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-3 border border-gray-200 bg-gray-50 rounded-lg">
                                                {getGenderLabel(formData.gender)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {editing && (
                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors shadow-md"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang lưu...
                                            </span>
                                        ) : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}