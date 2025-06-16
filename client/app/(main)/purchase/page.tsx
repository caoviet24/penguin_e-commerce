'use client';

import { useUser } from '@/hooks/useAuth';
import { billService } from '@/services/bill.service';
import { BillStatus } from '@/types/enum';
import { ISaleBill } from '@/types';
import { useQueries, useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';


import {
    Search,
    ShoppingBag,
    MessageCircle,
    Store,
    Package,
    CheckCircle,
    XCircle,
    RefreshCw,
    Star,
    ArchiveRestore,
} from 'lucide-react';
import EvaluateForm from '@/app/(main)/purchase/EvaluateForm';
import BackBillDForm from './FormBackBill';

export default function Purchase() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<string>('pending');
    const [tabData, setTabData] = useState<ISaleBill[]>([]);
    const [billSelected, setBillSelected] = useState<ISaleBill | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [openEvaluateForm, setOpenEvaluateForm] = useState(false);
    const [openBackBillForm, setOpenBackBillForm] = useState(false);
    const statusMap = useMemo(
        () => ({
            pending: BillStatus.PENDING,
            shipping: BillStatus.SHIPPING,
            delivered: BillStatus.DELIVERED,
            userReturnPending: BillStatus.USER_RETURN_PENDING,
            userCancelled: BillStatus.USER_CANCELLED,
            sellerCancelled: BillStatus.SELLER_CANCELLED,
            sellerReturnAccepted: BillStatus.SELLER_RETURN_ACCEPTED,
            sellerReturnRejected: BillStatus.SELLER_RETURN_REJECTED,
        }),
        [],
    );

    const statusMessages = {
        [BillStatus.PENDING]: 'Người gửi đang chuẩn bị hàng',
        [BillStatus.SHIPPING]: 'Đang giao hàng',
        [BillStatus.DELIVERED]: 'Đơn hàng giao thành công',
        [BillStatus.USER_CANCELLED]: 'Đơn hàng đã bị hủy',
        [BillStatus.USER_RETURN_PENDING]: 'Chờ người bán xác nhận hoàn hàng',
        [BillStatus.SELLER_CANCELLED]: 'Đơn hàng đã bị người bán hủy',
        [BillStatus.SELLER_RETURN_ACCEPTED]: 'Đơn hoàn hàng đã được chấp nhận',
        [BillStatus.SELLER_RETURN_REJECTED]: 'Đơn hoàn hàng bị từ chối',
    };

    const statusColors = {
        [BillStatus.PENDING]: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        [BillStatus.SHIPPING]: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
        [BillStatus.DELIVERED]: 'bg-green-100 text-green-800 hover:bg-green-100',
        [BillStatus.USER_CANCELLED]: 'bg-red-100 text-red-800 hover:bg-red-100',
        [BillStatus.USER_RETURN_PENDING]: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
        [BillStatus.SELLER_RETURN_ACCEPTED]: 'bg-green-100 text-green-800 hover:bg-green-100',
        [BillStatus.SELLER_RETURN_REJECTED]: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    };


    const resultBillData = useQueries({
    
        queries: Object.entries(statusMap).map(([tab, status]) => ({
            queryKey: [`bill-${tab}`, user?.id, activeTab === tab],
            queryFn: () =>
                billService.getAllByBuyerId({
                    buyer_id: user?.id || '',
                    status: status,
                }),
            enabled: !!user?.id && activeTab === tab,
        })),
    });

    useEffect(() => {
        const tabIndex = Object.keys(statusMap).indexOf(activeTab);
        if (tabIndex >= 0 && resultBillData[tabIndex]?.isSuccess) {
            setTabData(resultBillData[tabIndex].data || []);
        }
    }, [resultBillData, activeTab, statusMap]);

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

    const handleUpdateStatus = (status: string, billId: string) => {
        updateStatusBillMutation.mutate({
            status,
            id: billId,
        });
    };

    const filteredBills = tabData.filter(
        (bill) =>
            bill.booth?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.list_sale_bill_detail?.some((detail) =>
                detail.product_detail?.product_name?.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
    );

    return (
        <div className="container py-8 space-y-6 bg-white w-full my-4">
            <h1 className="text-3xl font-bold tracking-tight">Đơn mua</h1>

            <div className="flex flex-col space-y-4">
                <div className="flex w-full items-center space-x-2">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm theo tên shop, sản phẩm..."
                            className="w-full pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 h-auto">
                        <TabsTrigger value="pending" className="py-2">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Chờ lấy hàng
                        </TabsTrigger>
                        <TabsTrigger value="userReturnPending" className="py-2">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Chờ hoàn hàng
                        </TabsTrigger>
                        <TabsTrigger value="shipping" className="py-2">
                            <Package className="mr-2 h-4 w-4" />
                            Vận chuyển
                        </TabsTrigger>
                        <TabsTrigger value="delivered" className="py-2">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Hoàn thành
                        </TabsTrigger>
                        <TabsTrigger value="sellerCancelled" className="py-2">
                            <XCircle className="mr-2 h-4 w-4" />
                            Đơn từ chối hủy
                        </TabsTrigger>
                        <TabsTrigger value="userCancelled" className="py-2">
                            <XCircle className="mr-2 h-4 w-4" />
                            Đã hủy
                        </TabsTrigger>
                        <TabsTrigger value="sellerReturnAccepted" className="py-2">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Trả hàng thành công
                        </TabsTrigger>
                        <TabsTrigger value="sellerReturnRejected" className="py-2">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Trả hàng thất bại
                        </TabsTrigger>
                    </TabsList>

                    {Object.keys(statusMap).map((tab) => (
                        <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
                            {filteredBills.length > 0 ? (
                                filteredBills.map((bill) => (
                                    <Card key={bill.id} className="overflow-hidden">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Store className="h-5 w-5" />
                                                    <CardTitle className="text-lg capitalize">
                                                        {bill.booth?.name || 'Shop'}
                                                    </CardTitle>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-orange-500 text-orange-500 hover:bg-orange-50"
                                                        >
                                                            <MessageCircle className="mr-2 h-4 w-4" />
                                                            Chat ngay
                                                        </Button>
                                                        <Button asChild variant="outline" size="sm">
                                                            <Link href={`/shop/${bill.booth?.id || '#'}`}>
                                                                <Store className="mr-2 h-4 w-4" />
                                                                Xem shop
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>

                                                <Badge
                                                    variant="outline"
                                                    className={statusColors[bill.status as keyof typeof statusColors]}
                                                >
                                                    {statusMessages[bill.status as keyof typeof statusMessages]}
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <Separator />

                                        <CardContent className="p-0">
                                            {bill.list_sale_bill_detail?.map((detail, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-4 p-4 border-b last:border-0"
                                                >
                                                    <div className="flex-shrink-0">
                                                        <Image
                                                            src={detail.product_detail?.image || ''}
                                                            alt={detail.product_detail?.product_name || 'Product'}
                                                            width={80}
                                                            height={80}
                                                            className="rounded-md object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium line-clamp-2">
                                                            {detail.product_detail?.product_name || 'Product'}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Phân loại: {detail.size} - {detail.color}
                                                        </p>
                                                        <p className="text-sm mt-1">x{detail.quantity}</p>
                                                    </div>

                                                    <div className="text-right">
                                                        {detail.product_detail?.promotional_price &&
                                                        detail.product_detail.promotional_price > 0 ? (
                                                            <div className="space-y-1">
                                                                <p className="text-sm line-through text-muted-foreground">
                                                                    {(
                                                                        detail.product_detail?.sale_price || 0
                                                                    ).toLocaleString()}
                                                                    đ
                                                                </p>
                                                                <p className="font-medium text-red-600">
                                                                    {(
                                                                        detail.product_detail?.promotional_price || 0
                                                                    ).toLocaleString()}
                                                                    đ
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="font-medium">
                                                                {(
                                                                    detail.product_detail?.sale_price || 0
                                                                ).toLocaleString()}
                                                                đ
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>

                                        <CardFooter className="p-4 flex flex-col items-end space-y-4">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium mr-2">Tổng tiền:</p>
                                                <p className="text-xl font-bold text-red-600">
                                                    {bill.total_bill.toLocaleString()}đ
                                                </p>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm">
                                                    Liên hệ người bán
                                                </Button>

                                                {bill.status === BillStatus.PENDING && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleUpdateStatus(BillStatus.USER_CANCELLED, bill.id)
                                                        }
                                                    >
                                                        Hủy đơn hàng
                                                    </Button>
                                                )}

                                                {bill.status === BillStatus.SHIPPING && (
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleUpdateStatus(BillStatus.DELIVERED, bill.id)
                                                        }
                                                    >
                                                        Đã nhận được hàng
                                                    </Button>
                                                )}

                                                {bill.status === BillStatus.USER_RETURN_PENDING && (
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => {
                                                            setOpenBackBillForm(true);
                                                            setBillSelected(bill);
                                                        }}
                                                    >
                                                        Lý do hoàn hàng
                                                    </Button>
                                                )}

                                                {bill.status === BillStatus.DELIVERED && (
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="ml-2 bg-orange-500 text-white"
                                                            onClick={() => {
                                                                setBillSelected(bill);
                                                                setOpenBackBillForm(true);
                                                            }}
                                                        >
                                                            <ArchiveRestore className="mr-2 h-4 w-4" />
                                                            Trả hàng
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            disabled={bill.is_evaluated}
                                                            onClick={() => {
                                                                setBillSelected(bill);
                                                                setOpenEvaluateForm(true);
                                                            }}
                                                        >
                                                            <Star className="mr-2 h-4 w-4" />
                                                            {bill.is_evaluated ? 'Đã đánh giá' : 'Đánh giá sản phẩm'}
                                                        </Button>
                                                    </div>
                                                )}

                                                {bill.status === BillStatus.DELIVERED && (
                                                    <Button variant="default" size="sm">
                                                        Mua lại
                                                    </Button>
                                                )}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center">
                                    <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">Không có đơn hàng nào</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Bạn chưa có đơn hàng nào trong mục này
                                    </p>
                                    <Button variant="outline" className="mt-4" asChild>
                                        <Link href="/">Tiếp tục mua sắm</Link>
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {billSelected && (
                <EvaluateForm bill={billSelected} open={openEvaluateForm} onOpenChange={setOpenEvaluateForm} />
            )}
            {billSelected && (
                <BackBillDForm
                    open={openBackBillForm}
                    onOpenChange={setOpenBackBillForm}
                    bill={billSelected}
                />
            )}
            <ToastContainer />
        </div>
    );
}
