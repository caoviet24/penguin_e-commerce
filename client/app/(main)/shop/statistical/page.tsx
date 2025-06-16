'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    ShoppingCart,
    Package,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    RefreshCw,
    CornerDownLeft,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { statisticalBySellerService } from '@/services/statistical.service';
import { StatisticalChart, MetricCard, StatCard } from '@/components/charts/StatisticalCharts';
import { useUser } from '@/hooks/useAuth';
import { boothService } from '@/services/booth.service';
import Link from 'next/link';
import RevenueDialog from './RevenueDialog';

export default function Statistical() {
    const [period, setPeriod] = useState<string>('week');
    const [refreshKey, setRefreshKey] = useState(0);
    const { user } = useUser();
    const { data: boothData } = useQuery({
        queryKey: ['get-booth-by-id', !!user?.id],
        queryFn: () => boothService.getByAccId(user?.id || ''),
        enabled: !!user?.id,
        retry: 2,
    });

    // Get overview data
    const { data: overviewData, refetch: refetchOverview } = useQuery({
        queryKey: ['overview-seller', boothData?.id, refreshKey],
        queryFn: () => statisticalBySellerService.getOverView(boothData?.id || ''),
        enabled: !!boothData?.id,
    });

    // Get statistical data for charts
    const {
        data: statisticalData,
        isLoading: statisticalLoading,
        refetch: refetchStatistical,
    } = useQuery({
        queryKey: ['statistical-seller', boothData?.id, period, refreshKey],
        queryFn: () =>
            statisticalBySellerService.getStatistical({
                seller_id: boothData?.id || '',
                period: period,
            }),
        enabled: !!boothData?.id,
    });

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
        refetchOverview();
        refetchStatistical();
    };

    if (!boothData?.id) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">Vui lòng đăng ký gian hàng để xem thống kê</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Prepare chart data for bills
    const billsChartData = overviewData
        ? [
              { name: 'Thành công', value: overviewData.total_bill_success, label: 'Đơn hàng thành công' },
              { name: 'Chờ xử lý', value: overviewData.total_bill_pending, label: 'Đơn hàng chờ xử lý' },
              { name: 'Đã hủy', value: overviewData.total_bill_cancel, label: 'Đơn hàng đã hủy' },
          ]
        : [];

    // Prepare chart data for products
    const productsChartData = overviewData
        ? [
              { name: 'Hoạt động', value: overviewData.product_count_active, label: 'Sản phẩm hoạt động' },
              {
                  name: 'Không hoạt động',
                  value: overviewData.product_count_inactive,
                  label: 'Sản phẩm không hoạt động',
              },
              {
                  name: 'Không khả dụng',
                  value: overviewData.product_count_unavailable,
                  label: 'Sản phẩm không khả dụng',
              },
          ]
        : [];

    // Prepare chart data for return bills
    const returnBillsChartData = overviewData
        ? [
              {
                  name: 'Trả hàng thành công',
                  value: overviewData.total_bill_back_success,
                  label: 'Trả hàng thành công',
              },
              { name: 'Trả hàng chờ xử lý', value: overviewData.total_bill_back_pending, label: 'Trả hàng chờ xử lý' },
              { name: 'Trả hàng bị hủy', value: overviewData.total_bill_back_cancel, label: 'Trả hàng bị hủy' },
          ]
        : [];

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Thống kê cửa hàng</h1>
                    <p className="text-muted-foreground">Theo dõi hiệu suất kinh doanh của bạn</p>
                </div>
                <div className="flex gap-2">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chọn khoảng thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hôm nay</SelectItem>
                            <SelectItem value="week">Tuần này</SelectItem>
                            <SelectItem value="month">Tháng này</SelectItem>
                            <SelectItem value="year">Năm này</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex justify-center ">
                        <RevenueDialog
                            data={statisticalData || []}
                            period={period}
                            shopName={boothData?.name || 'Cửa hàng'}
                        />
                    </div>
                    <Button onClick={handleRefresh} variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Link href={`/shop/dashboard`}>
                            <CornerDownLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <MetricCard
                    title="Tổng doanh thu"
                    value={statisticalData?.reduce((sum, item) => sum + item.amount, 0) || 0}
                    color="bg-emerald-500"
                    icon={<DollarSign className="h-6 w-6" />}
                    suffix="đ"
                />

                <MetricCard
                    title="Đơn hàng chờ xử lý"
                    value={overviewData?.total_bill_pending || 0}
                    color="bg-yellow-500"
                    icon={<Calendar className="h-6 w-6" />}
                />

                <MetricCard
                    title="Đơn hàng thành công"
                    value={overviewData?.total_bill_success || 0}
                    color="bg-green-500"
                    icon={<TrendingUp className="h-6 w-6" />}
                />

                <MetricCard
                    title="Đơn hàng chờ hoàn"
                    value={overviewData?.total_bill_back_pending || 0}
                    color="bg-red-500"
                    icon={<TrendingUp className="h-6 w-6" />}
                />

                <MetricCard
                    title="Sản phẩm đã bán"
                    value={statisticalData?.reduce((sum, item) => sum + item.product_sold, 0) || 0}
                    color="bg-purple-500"
                    icon={<ShoppingCart className="h-6 w-6" />}
                />

                <MetricCard
                    title="Sản phẩm hoạt động"
                    value={overviewData?.product_count_active || 0}
                    color="bg-blue-500"
                    icon={<Package className="h-6 w-6" />}
                />
            </div>

         
            <Tabs defaultValue="revenue" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                    <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
                    <TabsTrigger value="products">Sản phẩm</TabsTrigger>
                    <TabsTrigger value="returns">Trả hàng</TabsTrigger>
                    <TabsTrigger value="vouchers">Voucher</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-4">
                    {statisticalLoading ? (
                        <Card>
                            <CardContent className="flex items-center justify-center h-64">
                                <div className="flex items-center space-x-2">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    <p>Đang tải dữ liệu doanh thu...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <StatisticalChart
                                    data={
                                        statisticalData?.map((item) => ({
                                            name: item.period,
                                            value: item.amount,
                                            label: `${item.amount.toLocaleString()}đ`,
                                        })) || []
                                    }
                                    title="Doanh thu theo thời gian"
                                    description="Biểu đồ doanh thu theo khoảng thời gian"
                                    type="line"
                                    color="#10B981"
                                />
                                <StatisticalChart
                                    data={
                                        statisticalData?.map((item) => ({
                                            name: item.period,
                                            value: item.product_sold,
                                            label: `${item.product_sold} sản phẩm`,
                                        })) || []
                                    }
                                    title="Sản phẩm bán ra"
                                    description="Số lượng sản phẩm bán theo thời gian"
                                    type="bar"
                                    color="#3B82F6"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard
                                    title="Tổng doanh thu"
                                    value={statisticalData?.reduce((sum, item) => sum + item.amount, 0) || 0}
                                    description="Doanh thu trong khoảng thời gian đã chọn"
                                    icon={<DollarSign className="h-4 w-4" />}
                                    formatValue={(value) => `${(value as number).toLocaleString()}đ`}
                                />
                                <StatCard
                                    title="Sản phẩm đã bán"
                                    value={statisticalData?.reduce((sum, item) => sum + item.product_sold, 0) || 0}
                                    description="Tổng số sản phẩm đã bán"
                                    icon={<ShoppingCart className="h-4 w-4" />}
                                />
                                <StatCard
                                    title="Doanh thu trung bình"
                                    value={
                                        statisticalData && statisticalData.length > 0
                                            ? Math.round(
                                                  statisticalData.reduce((sum, item) => sum + item.amount, 0) /
                                                      statisticalData.length,
                                              )
                                            : 0
                                    }
                                    description="Doanh thu trung bình mỗi ngày"
                                    icon={<TrendingUp className="h-4 w-4" />}
                                    formatValue={(value) => `${(value as number).toLocaleString()}đ`}
                                />
                            </div>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StatisticalChart
                            data={billsChartData}
                            title="Trạng thái đơn hàng"
                            description="Phân bố trạng thái đơn hàng"
                            type="pie"
                        />
                        <StatisticalChart
                            data={billsChartData}
                            title="So sánh đơn hàng"
                            description="Biểu đồ cột thể hiện số lượng đơn hàng"
                            type="bar"
                            color="#10B981"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Tổng đơn hàng"
                            value={
                                (overviewData?.total_bill_success || 0) +
                                (overviewData?.total_bill_pending || 0) +
                                (overviewData?.total_bill_cancel || 0)
                            }
                            description="Tổng số đơn hàng đã tạo"
                            icon={<ShoppingCart className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Tỷ lệ thành công"
                            value={
                                overviewData
                                    ? `${(
                                          ((overviewData.total_bill_success || 0) /
                                              Math.max(
                                                  1,
                                                  (overviewData.total_bill_success || 0) +
                                                      (overviewData.total_bill_pending || 0) +
                                                      (overviewData.total_bill_cancel || 0),
                                              )) *
                                          100
                                      ).toFixed(1)}%`
                                    : '0%'
                            }
                            description="Tỷ lệ đơn hàng thành công"
                            icon={<TrendingUp className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Đơn chờ xử lý"
                            value={overviewData?.total_bill_pending || 0}
                            description="Đơn hàng cần xử lý"
                            icon={<Calendar className="h-4 w-4" />}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="products" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StatisticalChart
                            data={productsChartData}
                            title="Trạng thái sản phẩm"
                            description="Phân bố trạng thái sản phẩm"
                            type="pie"
                        />
                        <StatisticalChart
                            data={productsChartData}
                            title="So sánh sản phẩm"
                            description="Biểu đồ cột thể hiện số lượng sản phẩm"
                            type="bar"
                            color="#3B82F6"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Tổng sản phẩm"
                            value={
                                (overviewData?.product_count_active || 0) +
                                (overviewData?.product_count_inactive || 0) +
                                (overviewData?.product_count_unavailable || 0)
                            }
                            description="Tổng số sản phẩm"
                            icon={<Package className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Sản phẩm hoạt động"
                            value={overviewData?.product_count_active || 0}
                            description="Sản phẩm đang bán"
                            icon={<TrendingUp className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Sản phẩm không khả dụng"
                            value={overviewData?.product_count_unavailable || 0}
                            description="Sản phẩm hết hàng"
                            icon={<TrendingDown className="h-4 w-4" />}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="returns" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <StatisticalChart
                            data={returnBillsChartData}
                            title="Trạng thái trả hàng"
                            description="Phân bố trạng thái trả hàng"
                            type="pie"
                        />
                        <StatisticalChart
                            data={returnBillsChartData}
                            title="So sánh trả hàng"
                            description="Biểu đồ cột thể hiện số lượng trả hàng"
                            type="bar"
                            color="#EF4444"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Tổng yêu cầu trả hàng"
                            value={
                                (overviewData?.total_bill_back_success || 0) +
                                (overviewData?.total_bill_back_pending || 0) +
                                (overviewData?.total_bill_back_cancel || 0)
                            }
                            description="Tổng số yêu cầu trả hàng"
                            icon={<RefreshCw className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Trả hàng thành công"
                            value={overviewData?.total_bill_back_success || 0}
                            description="Đã xử lý thành công"
                            icon={<TrendingUp className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Trả hàng chờ xử lý"
                            value={overviewData?.total_bill_back_pending || 0}
                            description="Cần xử lý"
                            icon={<Calendar className="h-4 w-4" />}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="vouchers" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Voucher hoạt động"
                            value={overviewData?.voucher_count_active || 'N/A'}
                            description="Voucher đang có hiệu lực"
                            icon={<DollarSign className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Voucher không hoạt động"
                            value={overviewData?.voucher_count_inactive || 'N/A'}
                            description="Voucher đã hết hạn"
                            icon={<TrendingDown className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Voucher đã xóa"
                            value={overviewData?.voucher_count_deleted || 'N/A'}
                            description="Voucher đã bị xóa"
                            icon={<TrendingDown className="h-4 w-4" />}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {statisticalLoading && (
                <Card>
                    <CardContent className="flex items-center justify-center h-64">
                        <div className="flex items-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <p>Đang tải dữ liệu thống kê...</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
