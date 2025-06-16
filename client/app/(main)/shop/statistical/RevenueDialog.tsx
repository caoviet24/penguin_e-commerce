'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Eye, EyeOff, TrendingUp, ShoppingCart, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/format-currency';
import { IRevenueData } from '@/types';


interface RevenueDialogProps {
    data?: IRevenueData[];
    period: string;
    shopName?: string;
    trigger?: React.ReactNode;
}

export default function RevenueDialog({ data = [], period, shopName = 'Cửa hàng', trigger }: RevenueDialogProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    console.log('RevenueDialog data:', data);
    

    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
    const totalProducts = data.reduce((sum, item) => sum + item.product_sold, 0);
    const averageDaily = data.length > 0 ? Math.round(totalAmount / data.length) : 0;
    const maxRevenue = Math.max(...data.map((item) => item.amount));
    const maxRevenueDay = data.find((item) => item.amount === maxRevenue);


    const formatPeriod = (period: string) => {
        switch (period) {
            case 'today':
                return 'Hôm nay';
            case 'week':
                return 'Tuần này';
            case 'month':
                return 'Tháng này';
            case 'year':
                return 'Năm này';
            default:
                return period;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };

    const exportToExcel = () => {
        if (data.length === 0) {
            alert('Không có dữ liệu để xuất!');
            return;
        }


        const worksheetData = [
            ['BÁO CÁO DOANH THU CỬA HÀNG'],
            [`${shopName} - ${formatPeriod(period)}`],
            [''],
            ['Ngày', 'Doanh thu (VNĐ)', 'Sản phẩm bán'],
            ...data.map((item) => [formatDate(item.period), item.amount, item.product_sold]),
            [''],
            ['TỔNG KẾT'],
            ['Tổng doanh thu:', totalAmount, ''],
            ['Tổng sản phẩm bán:', totalProducts, ''],
            ['Doanh thu trung bình/ngày:', averageDaily, ''],
            ['Doanh thu cao nhất:', maxRevenue, maxRevenueDay ? formatDate(maxRevenueDay.period) : ''],
            [''],
            ['Báo cáo được tạo lúc:', new Date().toLocaleString('vi-VN'), ''],
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  
        ws['!cols'] = [
            { width: 30 }, 
            { width: 30 },
            { width: 18 }, 
        ];

     
        XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo doanh thu');

        const fileName = `bao-cao-doanh-thu-${formatPeriod(period)}-${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const defaultTrigger = (
        <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Báo cáo doanh thu
        </Button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Báo Cáo Doanh Thu - {formatPeriod(period)}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Tổng Doanh Thu
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4" />
                                    Sản Phẩm Bán
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    TB/Ngày
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">{formatCurrency(averageDaily)}</div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-orange-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Cao Nhất
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-bold text-orange-600">{formatCurrency(maxRevenue)}</div>
                                {maxRevenueDay && (
                                    <div className="text-xs text-muted-foreground">
                                        {formatDate(maxRevenueDay.period)}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

 
                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={() => setShowPreview(!showPreview)}
                            variant={showPreview ? 'secondary' : 'default'}
                            className="gap-2"
                        >
                            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            {showPreview ? 'Ẩn Chi Tiết' : 'Hiển Thị Chi Tiết'}
                        </Button>

                        <Button
                            onClick={exportToExcel}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                            disabled={data.length === 0}
                        >
                            <Download className="h-4 w-4" />
                            Xuất Excel
                        </Button>
                    </div>

           
                    {showPreview && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Chi Tiết Doanh Thu Theo Ngày</span>
                                    <Badge variant="secondary">{data.length} ngày</Badge>
                                </CardTitle>
                                <Separator />
                            </CardHeader>
                            <CardContent>
                                {data.length > 0 ? (
                                    <div className="rounded-md border">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b bg-muted/50">
                                                        <th className="px-4 py-3 text-left font-medium">Ngày</th>
                                                        <th className="px-4 py-3 text-left font-medium">Doanh Thu</th>
                                                        <th className="px-4 py-3 text-left font-medium">
                                                            Sản Phẩm Bán
                                                        </th>
                                                        <th className="px-4 py-3 text-left font-medium">Trạng Thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.map((item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-b transition-colors hover:bg-muted/50"
                                                        >
                                                            <td className="px-4 py-3 font-medium">
                                                               {item.period}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span
                                                                    className={`font-semibold ${
                                                                        item.amount > averageDaily
                                                                            ? 'text-green-600'
                                                                            : item.amount > 0
                                                                            ? 'text-blue-600'
                                                                            : 'text-gray-500'
                                                                    }`}
                                                                >
                                                                    {formatCurrency(item.amount)}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className="font-medium">{item.product_sold}</span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                {(item.amount === maxRevenue && item.amount > 0) ? (
                                                                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                                                        Cao nhất
                                                                    </Badge>
                                                                ) : item.amount > averageDaily ? (
                                                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                                                        Tốt
                                                                    </Badge>
                                                                ) : item.amount > 0 ? (
                                                                    <Badge variant="secondary">Bình thường</Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="text-gray-500">
                                                                        Chưa có doanh thu
                                                                    </Badge>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Không có dữ liệu doanh thu để hiển thị</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}


                    <div className="text-center text-sm text-muted-foreground border-t pt-4">
                        <p>Báo cáo được tạo lúc: {new Date().toLocaleString('vi-VN')}</p>
                        <p>Dữ liệu cho khoảng thời gian: {formatPeriod(period)}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
