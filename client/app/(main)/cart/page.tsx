"use client"
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { BiSearchAlt2 } from 'react-icons/bi'
import Image from 'next/image'
import { Divider, Modal } from '@mui/material'
import { IOrderItem, IVoucher, ResponseData } from '@/types'
import useHookMutation from '@/hooks/useHookMutation'
import { orderItemService } from '@/services/orderItem.service'
import { toast, ToastContainer } from 'react-toastify'
import { setDeleteToCart } from '@/redux/slices/cart.slice'
import { useQuery } from '@tanstack/react-query'
import { voucherService } from '@/services/voucher.service'
import Voucher from '@/components/Voucher/voucher'
import useLocationStorage from '@/hooks/useLocationStorage'
import { useRouter } from 'next/navigation'



export default function Cart() {
    const { cart } = useAppSelector(state => state.cart);
    const [totalBill, setTotalBill] = React.useState(0);
    const [totalQuantity, setTotalQuantity] = React.useState(0);
    const [orderSelected, setOrderSelected] = React.useState<IOrderItem[]>([]);
    const [voucherSelected, setVoucherSelected] = React.useState<IVoucher[] | []>([]);
    const router = useRouter();


    const [openVoucher, setOpenVoucher] = React.useState(false);
    const { storedValue, setValue, removeValue } = useLocationStorage({
        key: 'temp-bill',
        initialValue: {}
    })
    const dispatch = useAppDispatch();

    const { data: voucherData } = useQuery<ResponseData<IVoucher>>({
        queryKey: ['voucher', 'getAllActive'],
        queryFn: () => voucherService.getAllActive(1, 100),
        enabled: openVoucher
    });


    const handleOrderSelected = (order: IOrderItem) => {
        if (orderSelected.some(item => item.id === order.id)) {
            setOrderSelected(orderSelected.filter(item => item.id !== order.id));
        } else {
            setOrderSelected([...orderSelected, order]);
        }
    };

    const handleSelectedAll = () => {
        if (orderSelected.length === cart.length) {
            setOrderSelected([]);
        } else {
            setOrderSelected(cart);
        }
    }

    const handleVoucherSelection = (id: string) => {
        const selectedVoucher = voucherData?.data.find((voucher) => voucher.id === id);
        if (selectedVoucher) {
            setVoucherSelected((prev: IVoucher[] | null) => {
                const idx = prev?.findIndex(vch => vch.voucher_type === selectedVoucher.voucher_type);
                if (idx !== undefined && idx !== -1) {
                    prev?.splice(idx, 1);
                }
                return [...(prev || []), selectedVoucher];

            });
        }
    };

    const handleChooseListVoucher = () => {
        setOpenVoucher(false)
    }

    const deleteOrderItemMutation = useHookMutation((id: string) => {
        return orderItemService.deleteOrderItem(id);
    })

    const handleDeleteOrder = (order: IOrderItem) => {
        deleteOrderItemMutation.mutate(order.id, {
            onSuccess: () => {
                dispatch(setDeleteToCart(order));
                toast.success('Xóa sản phẩm thành công', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light"
                });
            }
        });
    };


    const handleBuyOrder = () => {
        if (orderSelected.length === 0) {
            toast.error('Vui lòng chọn sản phẩm', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light"
            });
            return;
        }

        setValue({
            seller_id: orderSelected[0].seller_id,
            total: totalBill,
            list_bill_detail: orderSelected,
            list_voucher: voucherSelected,
        })

        router.push('/checkout')

    }




    useEffect(() => {
        setValue(null);
        setTotalBill(orderSelected.reduce((total, item) => total + item.quantity * (item.product_detail.promotional_price > 0 ? item.product_detail.promotional_price : item.product_detail.sale_price), 0));
        setTotalQuantity(orderSelected.length);

        if (voucherSelected) {
           
            
            const totalDefault = orderSelected.reduce((total, item) => total + item.quantity * (item.product_detail.promotional_price > 0 ? item.product_detail.promotional_price : item.product_detail.sale_price), 0);
            console.log(totalDefault);
            voucherSelected.forEach(voucher => {
                if (voucher.voucher_type !== 'freeship') {
                    if (voucher.type_discount === 'percent') {
                        setTotalBill(totalDefault - (totalDefault * (voucher.discount / 100)));
                    } else {
                        setTotalBill(totalDefault - voucher.discount > 0 ? totalDefault - voucher.discount : 0);
                    }
                }
            })

        }

    }, [orderSelected, voucherSelected]);


    return (
        <div className='container'>
            <div className='flex justify-between items-center bg-white mt-4 p-2 rounded-md'>
                <p className='w-1/2 uppercase text-base font-medium'>Giỏ hàng của bạn</p>
                <div className="relative flex-1">
                    <input
                        className="w-full bg-white text-gray-700 text-sm border border-gray-300 rounded-md pl-3 pr-28 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-purple-500 hover:border-gray-400 shadow-sm focus:shadow-md"
                        placeholder="Nhập tên sản phẩm...."
                    />
                    <button className="absolute top-1 right-1 flex items-center rounded bg-purple-600 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-md focus:bg-purple-500 focus:shadow-none active:bg-purple-500 hover:bg-purple-500 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                        <BiSearchAlt2 size={20} />
                        <span className="ml-1">Tìm kiếm</span>
                    </button>
                </div>
            </div>

            <div className='mb-10'>
                <div className='flex justify-between items-center bg-white mt-4 px-2 py-4 rounded-md capitalize'>
                    <div className='w-2/5 flex items-center gap-2 px-5'>
                        <input className='p-2 h-4 w-4' type='checkbox'></input>
                        <p>Sản phẩm</p>
                    </div>
                    <div className='grid grid-cols-4 gap-2 flex-1 text-center capitalize'>
                        <p>Đơn giá</p>
                        <p>Số lượng</p>
                        <p>Thành tiền</p>
                        <p>Thao tác</p>
                    </div>
                </div>
                <div>
                    {cart.map(item => (
                        <div key={item.id} className='flex justify-between items-center bg-white mt-4 p-2 rounded-md'>
                            <div className='w-2/5 flex items-center justify-between px-5 gap-2'>
                                <div className='flex items-center gap-2'>
                                    <input
                                        onChange={() => handleOrderSelected(item)}
                                        className='p-2 h-4 w-4'
                                        type='checkbox'
                                        checked={orderSelected.some(order => order.id === item.id)}
                                    />

                                    <Image src={item.product_detail.image} alt={item.product_detail.product_name} width={100} height={100} />
                                </div>
                                <p>{item.product_detail.product_name}</p>
                                <div>
                                    <p>Size: {item.size}</p>
                                    <p>Màu: {item.color}</p>
                                </div>
                            </div>
                            <div className='grid grid-cols-4 gap-2 flex-1 text-center'>
                                <div>
                                    <p className="line-through">{item.product_detail.sale_price.toLocaleString()}đ</p>
                                    {
                                        item.product_detail.promotional_price > 0 &&
                                        <p className='text-red-500'>{(item.product_detail.promotional_price).toLocaleString()}đ</p>
                                    }
                                </div>
                                <p>{item.quantity}</p>
                                <p>{(item.quantity * (item.product_detail.promotional_price > 0 ? item.product_detail.promotional_price : item.product_detail.sale_price)).toLocaleString()}đ</p>
                                <button onClick={() => handleDeleteOrder(item)} className='text-red-500 hover:underline hover:cursor-pointer'>Xóa</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex flex-col bg-white mt-4 p-4 rounded-md sticky bottom-0 right-0 mb-10'>
                <div className='flex gap-2 justify-end'>
                    <div className='flex items-center gap-2'>
                        <Image src="/images/voucher.avif" alt="voucher" width={30} height={30} />
                        <p>Penguin Voucher</p>
                    </div>
                    <button onClick={() => setOpenVoucher(true)} className='text-red-500 text-sm'>Chọn mã giảm giá</button>
                </div>

                {voucherSelected && voucherSelected.length > 0 &&
                    <div className='flex flex-col text-end py-1 text-lg'>
                        <p>Giá gốc:
                            <span className="opacity-85 line-through text-red-500"> {orderSelected.reduce((total, item) =>
                                total + item.quantity * (item.product_detail.promotional_price > 0 ?
                                    item.product_detail.promotional_price : item.product_detail.sale_price),
                                0).toLocaleString()}đ
                            </span>
                        </p>
                        {voucherSelected.map(voucher => (
                            <div key={voucher.id}>
                                {voucher.voucher_type === 'freeship' ?
                                    voucher.type_discount === 'percent' ?
                                        <p>Giảm tiền giao hàng :
                                            <span className="opacity-85 text-red-500"> {voucher.discount}%</span>
                                        </p>
                                        :
                                        <p>Giảm tiền giao hàng:
                                            <span className="opacity-85 text-red-500"> {voucher.discount.toLocaleString()}đ</span>
                                        </p>
                                    :
                                    voucher.type_discount === 'percent' ?
                                        <p>Giảm giá đơn hàng:
                                            <span className="opacity-85 text-red-500"> {voucher.discount}%</span>
                                        </p>
                                        :
                                        <p>Giảm giá đơn hàng:
                                            <span className="opacity-85 text-red-500"> {voucher.discount.toLocaleString()}đ</span>
                                        </p>
                                }
                            </div>
                        ))}
                    </div>
                }

                <div className='flex justify-between items-center mt-4'>
                    <div className='flex items-center gap-2'>
                        <input type='checkbox'></input>
                        <button onClick={handleSelectedAll}>Chọn tất cả ({totalQuantity})</button>
                        <button className='text-red-500 hover:underline hover:cursor-pointer'>Xóa</button>
                    </div>

                    <div className='flex items-center gap-4'>
                        <p>Tổng thanh toán ({totalQuantity}) sản phẩm: </p>
                        <p className='text-red-500 text-2xl'>{totalBill.toLocaleString()}đ</p>
                        <button onClick={handleBuyOrder} className='w-52 py-2 px-10 bg-purple-500 text-white rounded-lg text-center'>Mua hàng</button>
                    </div>
                </div>
            </div>

            <ToastContainer />

            <Modal
                open={openVoucher}
                onClose={() => setOpenVoucher(false)}
                className='flex justify-center items-center'
            >
                <div className='bg-white p-4 rounded-md w-[480px] min-h-32'>
                    <p className='pb-2 capitalize text-lg'>Chọn mã giảm giá</p>
                    <div className="relative flex-1">
                        <input
                            className="w-full bg-white text-gray-700 text-sm border border-gray-300 rounded-md pl-3 pr-28 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-purple-500 hover:border-gray-400 shadow-sm focus:shadow-md"
                            placeholder="Nhập voucher...."
                        />
                        <button className="absolute top-1 right-1 flex items-center rounded bg-purple-600 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-md focus:bg-purple-500 focus:shadow-none active:bg-purple-500 hover:bg-purple-500 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                            <BiSearchAlt2 size={20} />
                            <span className="ml-1">Tìm kiếm</span>
                        </button>
                    </div>
                    <Divider className='py-2' />
                    <div className='h-[400px] overflow-y-auto'>
                        <div>
                            {voucherData && voucherData.data?.some(voucher => voucher.voucher_type === 'freeship') && (
                                <>
                                    <div className='py-2'>
                                        <h3 className='capitalize'>Miễn phí giao hàng</h3>
                                        <p className='text-sm opacity-70'>Có thể chọn 1</p>
                                    </div>
                                    {voucherData.data
                                        .filter(voucher => voucher.voucher_type === 'freeship')
                                        .map(voucher => (
                                            <Voucher key={voucher.id} voucher={voucher} onChecked={handleVoucherSelection} />
                                        ))}
                                </>
                            )}
                            <Divider className='py-2' />
                            {voucherData && voucherData.data?.some(voucher => voucher.voucher_type === 'discount') && (
                                <>
                                    <div className='py-2'>
                                        <h3 className='capitalize'>Giảm giá</h3>
                                        <p className='text-sm opacity-70'>Có thể chọn 1</p>
                                    </div>
                                    {voucherData.data
                                        .filter(voucher => voucher.voucher_type === 'discount')
                                        .map(voucher => (
                                            <Voucher key={voucher.id} voucher={voucher} onChecked={handleVoucherSelection} />
                                        ))}
                                </>
                            )}
                        </div>

                    </div>
                    <div className='flex justify-end gap-2'>
                        <button onClick={() => setOpenVoucher(false)} className='w-40 py-2 px-10 border border-solid border-gray-500 mt-5'>Trở lại</button>
                        <button onClick={handleChooseListVoucher} className='w-40 py-2 px-10 border border-solid border-purple-500 bg-purple-500 text-white mt-5'>Xác nhận</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
