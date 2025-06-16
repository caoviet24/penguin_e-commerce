'use client';

import { billService } from '@/services/bill.service';
import { ISaleBill, ISaleBillDetail, ResponseData } from '@/types';
import { BillStatus } from '@/types/enum';
import { useQueries, useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

// Shadcn imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Search, ShoppingBag, Store, CheckCircle, XCircle, Truck, Clock, MoreHorizontal, User } from 'lucide-react';
import { useUser } from '@/hooks/useAuth';
import { boothService } from '@/services/booth.service';
import { useRouter } from 'next/navigation';
import ResponseBackBillForm from './ResponseBackBillForm';

export default function OrderOfShop() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<string>('pending');
    const [tabData, setTabData] = useState<ResponseData<ISaleBill[]> | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<ISaleBill | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [openEvaluateForm, setOpenEvaluateForm] = useState(false);
    const router = useRouter();

    const {
        data: BoothData,
        isLoading: isGetBoothLoading,
        isSuccess: isGetBoothSuccess,
        isError: isGetBoothError,
    } = useQuery({
        queryKey: ['booth'],
        queryFn: () => boothService.getByAccId(user?.id || ''),
        enabled: !!user?.id,
    });

    useEffect(() => {
        if (isGetBoothError) {
            router.push('/shop/dashboard');
        }

        if (BoothData && isGetBoothSuccess) {
            if (!BoothData.is_active) {
                router.push('/shop/register');
            }

            if (BoothData.is_banned || BoothData.is_detele) {
                router.push('/shop/dashboard');
            }
        }
    }, [BoothData, isGetBoothSuccess, isGetBoothError, router]);


    const statusMap = React.useMemo(() => ({
        pending: BillStatus.PENDING,
        shipping: BillStatus.SHIPPING,
        delivered: BillStatus.DELIVERED,
        userCancelled: BillStatus.USER_CANCELLED,
        userReturnPending: BillStatus.USER_RETURN_PENDING,
        userReturnConfirmed: BillStatus.USER_RETURN_CONFIRMED,
        sellerReturnPending: BillStatus.SELLER_RETURN_PENDING,
        sellerReturnAccepted: BillStatus.SELLER_RETURN_ACCEPTED,
        sellerReturnRejected: BillStatus.SELLER_RETURN_REJECTED,
        sellerCancelled: BillStatus.SELLER_CANCELLED,
    }), []);

    // Map status to human-readable messages
    const statusMessages = {
        [BillStatus.PENDING]: 'Chờ xác nhận',
        [BillStatus.SHIPPING]: 'Đang vận chuyển',
        [BillStatus.DELIVERED]: 'Giao hàng thành công',
        [BillStatus.USER_RETURN_PENDING]: 'Chờ xác nhận trả hàng',
        [BillStatus.USER_RETURN_CONFIRMED]: 'Xác nhận trả hàng',
        [BillStatus.SELLER_RETURN_PENDING]: 'Chờ xác nhận trả hàng từ người bán',
        [BillStatus.SELLER_RETURN_ACCEPTED]: 'Đã chấp nhận yêu cầu trả hàng',
        [BillStatus.SELLER_RETURN_REJECTED]: 'Yêu cầu trả hàng bị từ chối',
        [BillStatus.USER_CANCELLED]: 'Đơn hàng bị hủy bởi người dùng',
        [BillStatus.SELLER_CANCELLED]: 'Đơn hàng bị hủy bởi người bán',
    };

    // Status badge colors
    const statusColors = {
        [BillStatus.PENDING]: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        [BillStatus.SHIPPING]: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
        [BillStatus.DELIVERED]: 'bg-green-100 text-green-800 hover:bg-green-100',
        [BillStatus.USER_CANCELLED]: 'bg-red-100 text-red-800 hover:bg-red-100',
        [BillStatus.USER_RETURN_PENDING]: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
        [BillStatus.USER_RETURN_CONFIRMED]: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
        [BillStatus.SELLER_RETURN_PENDING]: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
        [BillStatus.SELLER_RETURN_ACCEPTED]: 'bg-green-100 text-green-800 hover:bg-green-100',
        [BillStatus.SELLER_RETURN_REJECTED]: 'bg-red-100 text-red-800 hover:bg-red-100',
        [BillStatus.SELLER_CANCELLED]: 'bg-red-100 text-red-800 hover:bg-red-100',

    };

    // Query bills based on active tab
    const resultBillData = useQueries({
        queries: Object.entries(statusMap).map(([tab, status]) => ({
            queryKey: [`bill-${tab}`, BoothData?.id, activeTab === tab],
            queryFn: () =>
                billService.getAllBySellerId({
                    seller_id: BoothData?.id || '',
                    status: status,
                    page_number: 1,
                    page_size: 10,
                }),
            enabled: !!BoothData?.id && activeTab === tab,
        })),
    });

    // Update tab data when active tab changes
    useEffect(() => {
        const tabIndex = Object.keys(statusMap).indexOf(activeTab);
        if (tabIndex >= 0 && resultBillData[tabIndex]?.isSuccess) {
            setTabData(resultBillData[tabIndex].data as unknown as ResponseData<ISaleBill[]>);
        }
    }, [resultBillData, activeTab, statusMap]);

    // Update bill status mutation
    const updateStatusBillMutation = useMutation({
        mutationFn: (data: { status: string; id: string }) => billService.updateStatus(data),
        onSuccess: () => {
            const tabIndex = Object.keys(statusMap).indexOf(activeTab);
            resultBillData[tabIndex]?.refetch();
            toast.success('Cập nhật trạng thái đơn hàng thành công', {
                position: 'top-right',
                autoClose: 2000,
            });
        },
        onError: () => {
            toast.error('Cập nhật trạng thái đơn hàng thất bại', {
                position: 'top-right',
                autoClose: 2000,
            });
        },
    });

    // Handle updating bill status
    const handleUpdateStatus = (status: BillStatus, billId: string) => {
        updateStatusBillMutation.mutate({
            status,
            id: billId,
        });
    };

    const filteredBills: ISaleBill[] = tabData?.data
        ? (tabData.data as unknown as ISaleBill[]).filter(
              (bill) =>
                  bill.delivery_address?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  bill.list_sale_bill_detail?.some(
                      (detail) =>
                          detail.product_detail?.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          detail.product_detail.product_name.toLowerCase().includes(searchQuery.toLowerCase()),
                  ),
          )
        : [];

    // Format date for display
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    if (isGetBoothLoading) {
        return <div className="container py-8">Đang tải...</div>;
    }

    return (
        <div className="container py-8 space-y-6 bg-white w-full my-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
                <Button asChild variant="outline">
                    <Link href="/shop/dashboard">
                        <Store className="mr-2 h-4 w-4" />
                        Trở lại gian hàng
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col space-y-4">
                <div className="flex w-full items-center space-x-2">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm theo tên khách hàng, sản phẩm..."
                            className="w-full pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid lg:grid-cols-4 grid-cols-2 h-auto">
                        <TabsTrigger value="pending" className="py-2">
                            <Clock className="mr-2 h-4 w-4" />
                            Chờ xác nhận
                        </TabsTrigger>
                        <TabsTrigger value="shipping" className="py-2">
                            <Truck className="mr-2 h-4 w-4" />
                            Đang vận chuyển
                        </TabsTrigger>
                        <TabsTrigger value="delivered" className="py-2">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Hoàn thành
                        </TabsTrigger>
                        <TabsTrigger value="sellerCancelled" className="py-2">
                            <XCircle className="mr-2 h-4 w-4" />
                            Đã hủy
                        </TabsTrigger>
                        <TabsTrigger value="userCancelled" className="py-2">
                            <User className="mr-2 h-4 w-4" />
                            Bị hủy
                        </TabsTrigger>
                        <TabsTrigger value="userReturnPending" className="py-2">
                            <User className="mr-2 h-4 w-4" />
                            Yêu cầu hoàn
                        </TabsTrigger>
                        
                        <TabsTrigger value="sellerReturnRejected" className="py-2">
                            <User className="mr-2 h-4 w-4" />
                            Từ chối hoàn
                        </TabsTrigger>
                        <TabsTrigger value="sellerReturnSuccess" className="py-2">
                            <User className="mr-2 h-4 w-4" />
                            Đã hoàn
                        </TabsTrigger>
                        
                    </TabsList>

                    {Object.keys(statusMap).map((tab) => (
                        <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
                            {filteredBills.length > 0 ? (
                                <div className="bg-white rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]">STT</TableHead>
                                                <TableHead>Mã đơn hàng</TableHead>
                                                <TableHead>Khách hàng</TableHead>
                                                <TableHead>Ngày đặt</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead className="text-right">Tổng tiền</TableHead>
                                                <TableHead className="text-center">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredBills.map((bill, index) => (
                                                <TableRow key={bill.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell className="font-medium">
                                                        {bill.id.substring(0, 8)}
                                                    </TableCell>
                                                    <TableCell>{bill.delivery_address?.full_name}</TableCell>
                                                    <TableCell>{formatDate(bill.created_at)}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                statusColors[bill.status as keyof typeof statusColors]
                                                            }
                                                        >
                                                            {statusMessages[bill.status as keyof typeof statusMessages]}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold">
                                                        {bill.total_bill.toLocaleString()}đ
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedOrder(bill as unknown as ISaleBill);
                                                                    setShowDetails(true);
                                                                }}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                Chi tiết
                                                            </Button>

                                                            {bill.status === BillStatus.USER_RETURN_PENDING && (
                                                                <React.Fragment>
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setSelectedOrder(bill);
                                                                            setOpenEvaluateForm(true);
                                                                        }
                                                                        }
                                                                    >
                                                                        <CheckCircle className="mr-1 h-4 w-4" />
                                                                        Xác nhận
                                                                    </Button>

                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleUpdateStatus(
                                                                                BillStatus.SELLER_RETURN_REJECTED,
                                                                                bill.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <XCircle className="mr-1 h-4 w-4" />
                                                                        Hủy
                                                                    </Button>
                                                                </React.Fragment>
                                                            )}

                                                            {bill.status === BillStatus.PENDING && (
                                                                <>
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleUpdateStatus(
                                                                                BillStatus.SHIPPING,
                                                                                bill.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <CheckCircle className="mr-1 h-4 w-4" />
                                                                        Xác nhận
                                                                    </Button>

                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleUpdateStatus(
                                                                                BillStatus.SELLER_CANCELLED,
                                                                                bill.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <XCircle className="mr-1 h-4 w-4" />
                                                                        Hủy
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-white">
                                    <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">Không có đơn hàng nào</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Không có đơn hàng nào trong mục này
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Order Details Dialog */}
            {selectedOrder && (
                <Dialog open={showDetails} onOpenChange={setShowDetails}>
                    <DialogContent className="sm:max-w-[800px]">
                        <DialogHeader>
                            <DialogTitle>Chi tiết đơn hàng #{selectedOrder.id.substring(0, 8)}</DialogTitle>
                            <DialogDescription>
                                Đơn đặt hàng từ {selectedOrder.delivery_address?.full_name} -{' '}
                                {formatDate(selectedOrder.created_at)}
                            </DialogDescription>
                        </DialogHeader>

                        <div className={`grid ${selectedOrder.back_bill ? "grid-cols-3" : "grid-cols-2"} gap-4 py-4`}>
                            <div className="space-y-2">
                                <h3 className="font-semibold">Thông tin khách hàng</h3>
                                <div className="text-sm">
                                    <p>
                                        <span className="font-medium">Họ tên:</span>{' '}
                                        {selectedOrder.delivery_address?.full_name}
                                    </p>
                                    <p>
                                        <span className="font-medium">Số điện thoại:</span>{' '}
                                        {selectedOrder.delivery_address?.phone}
                                    </p>
                                    <p>
                                        <span className="font-medium">Địa chỉ:</span>{' '}
                                        {selectedOrder.delivery_address?.address}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold">Thông tin đơn hàng</h3>
                                <div className="text-sm space-y-2">
                                    <p>
                                        <span className="font-medium">Mã đơn hàng:</span> {selectedOrder.id}
                                    </p>
                                    <p>
                                        <span className="font-medium">Ngày đặt hàng:</span>{' '}
                                        {formatDate(selectedOrder.created_at)}
                                    </p>
                                    <div className="flex items-center">
                                        <span className="font-medium">Trạng thái:</span>
                                        <Badge
                                            variant="outline"
                                            className={`ml-2 ${
                                                statusColors[selectedOrder.status as keyof typeof statusColors]
                                            }`}
                                        >
                                            {statusMessages[selectedOrder.status as keyof typeof statusMessages]}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {selectedOrder.back_bill && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Lý do hủy đơn</h3>
                                    <div className="text-sm">
                                        <p>
                                            <span className="font-medium">Lý do:</span>{' '}
                                            {selectedOrder.back_bill?.reason_back || 'Không có lý do'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Ngày tạo:</span>{' '}
                                            {formatDate(selectedOrder.back_bill?.created_at || new Date())}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />

                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Sản phẩm</h3>
                            <div className="space-y-4">
                                {selectedOrder.list_sale_bill_detail?.map((detail: ISaleBillDetail, idx) => (
                                    <div key={idx} className="flex items-center gap-4 pb-2 border-b last:border-0">
                                        <div className="flex-shrink-0">
                                            {/* Use either direct image or from product_detail */}
                                            {(detail.product_detail.image || detail.product_detail?.image) && (
                                                <Image
                                                    src={detail.product_detail.image || detail.product_detail.image || ''}
                                                    alt={
                                                        detail.product_detail.product_name ||
                                                        detail.product_detail?.product_name ||
                                                        'Product'
                                                    }
                                                    width={70}
                                                    height={70}
                                                    className="rounded-md object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium">
                                                {detail.product_detail.product_name ||
                                                    'Product Name'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Phân loại: {detail.size} - {detail.color}
                                            </p>
                                            <p className="text-sm">x{detail.quantity}</p>
                                        </div>

                                        <div className="text-right">
                                            {/* Use promotional_price from either source */}
                                            {(detail.product_detail.promotional_price && detail.product_detail.promotional_price > 0) ||
                                            (detail.product_detail.promotional_price &&
                                                detail.product_detail?.promotional_price > 0) ? (
                                                <div className="space-y-1">
                                                    <p className="text-sm line-through text-muted-foreground">
                                                        {(
                                                            detail.product_detail?.sale_price ||
                                                            0
                                                        ).toLocaleString()}
                                                        đ
                                                    </p>
                                                    <p className="font-medium text-red-600">
                                                        {(
                                                            detail.product_detail?.promotional_price ||
                                                            0
                                                        ).toLocaleString()}
                                                        đ
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="font-medium">
                                                    {(
                                                        detail.product_detail?.sale_price ||
                                                        0
                                                    ).toLocaleString()}
                                                    đ
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex gap-2">
                                {selectedOrder.status === BillStatus.PENDING && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                handleUpdateStatus(BillStatus.SHIPPING, selectedOrder.id);
                                                setShowDetails(false);
                                            }}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Xác nhận đơn hàng
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                handleUpdateStatus(BillStatus.SELLER_CANCELLED, selectedOrder.id);
                                                setShowDetails(false);
                                            }}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Hủy đơn hàng
                                        </Button>
                                    </>
                                )}
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Tổng tiền:</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {selectedOrder.total_bill.toLocaleString()}đ
                                </p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {selectedOrder && <ResponseBackBillForm bill={selectedOrder} open={openEvaluateForm} onOpenChange={setOpenEvaluateForm} />}

            <ToastContainer />
        </div>
    );
}
