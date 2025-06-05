'use client'

import AnimatedNumber from '@/components/admin/NumberAnimate/numberAnimate'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, 
  Store, 
  Users, 
  Tag, 
  Package, 
  Ticket,
  Grid3X3,
  Activity
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { statisticalByAdminService } from '@/services/statistical.service'
import { IOverView } from '@/types'

export default function AdminPage() {
  const [statisticsData, setStatisticsData] = useState<IOverView | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await statisticalByAdminService.getOverView()
        setStatisticsData(data)
      } catch (error) {
        console.error('Error fetching admin overview:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    badge
  }: {
    title: string
    value: number | null
    description: string
    icon: React.ComponentType<{ className?: string }>
    badge?: { text: string; variant?: 'default' | 'secondary' | 'destructive' }
  }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            <AnimatedNumber count={value || 0} />
          </div>
          {badge && (
            <Badge variant={badge.variant || 'default'} className="ml-2">
              {badge.text}
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (!statisticsData) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Không thể tải dữ liệu</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Tổng Quan</h1>
            <p className="text-muted-foreground mt-1">
              Theo dõi các chỉ số quan trọng của hệ thống
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm text-muted-foreground">Đang hoạt động</span>
          </div>
        </div>

        {/* Accounts Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tài Khoản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statisticsData.account_count_active !== null && (
              <StatCard
                title="Tài khoản hoạt động"
                value={statisticsData.account_count_active}
                description="Người dùng đang hoạt động"
                icon={Activity}
                badge={{ text: "Hoạt động", variant: "default" }}
              />
            )}
            {statisticsData.account_count_banned !== null && (
              <StatCard
                title="Tài khoản bị cấm"
                value={statisticsData.account_count_banned}
                description="Tài khoản đã bị khóa"
                icon={Users}
                badge={{ text: "Bị cấm", variant: "destructive" }}
              />
            )}
            {statisticsData.account_count_deleted !== null && (
              <StatCard
                title="Tài khoản đã xóa"
                value={statisticsData.account_count_deleted}
                description="Tài khoản đã bị xóa"
                icon={Users}
                badge={{ text: "Đã xóa", variant: "secondary" }}
              />
            )}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sản Phẩm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Sản phẩm hoạt động"
              value={statisticsData.product_count_active}
              description="Đang bán trên hệ thống"
              icon={ShoppingBag}
              badge={{ text: "Hoạt động", variant: "default" }}
            />
            <StatCard
              title="Sản phẩm tạm ngưng"
              value={statisticsData.product_count_inactive}
              description="Tạm thời không bán"
              icon={Package}
              badge={{ text: "Tạm ngưng", variant: "secondary" }}
            />
            <StatCard
              title="Sản phẩm không khả dụng"
              value={statisticsData.product_count_unavailable}
              description="Hết hàng hoặc lỗi"
              icon={Package}
              badge={{ text: "Hết hàng", variant: "destructive" }}
            />
            {statisticsData.product_count_deleted !== null && (
              <StatCard
                title="Sản phẩm đã xóa"
                value={statisticsData.product_count_deleted}
                description="Đã bị xóa khỏi hệ thống"
                icon={Package}
                badge={{ text: "Đã xóa", variant: "secondary" }}
              />
            )}
          </div>
        </div>

        {/* Booths Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Store className="h-5 w-5" />
            Gian Hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statisticsData.booth_count_active !== null && (
              <StatCard
                title="Gian hàng hoạt động"
                value={statisticsData.booth_count_active}
                description="Đang kinh doanh"
                icon={Store}
                badge={{ text: "Hoạt động", variant: "default" }}
              />
            )}
            {statisticsData.booth_count_inactive !== null && (
              <StatCard
                title="Gian hàng tạm ngưng"
                value={statisticsData.booth_count_inactive}
                description="Tạm thời không hoạt động"
                icon={Store}
                badge={{ text: "Tạm ngưng", variant: "secondary" }}
              />
            )}
            {statisticsData.booth_count_pending !== null && (
              <StatCard
                title="Gian hàng chờ duyệt"
                value={statisticsData.booth_count_pending}
                description="Đang chờ phê duyệt"
                icon={Store}
                badge={{ text: "Chờ duyệt", variant: "secondary" }}
              />
            )}
            {statisticsData.booth_count_banned !== null && (
              <StatCard
                title="Gian hàng bị cấm"
                value={statisticsData.booth_count_banned}
                description="Đã bị khóa"
                icon={Store}
                badge={{ text: "Bị cấm", variant: "destructive" }}
              />
            )}
            {statisticsData.booth_count_deleted !== null && (
              <StatCard
                title="Gian hàng đã xóa"
                value={statisticsData.booth_count_deleted}
                description="Đã bị xóa"
                icon={Store}
                badge={{ text: "Đã xóa", variant: "secondary" }}
              />
            )}
          </div>
        </div>

        {/* Vouchers Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Voucher
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statisticsData.voucher_count_active !== null && (
              <StatCard
                title="Voucher hoạt động"
                value={statisticsData.voucher_count_active}
                description="Đang có thể sử dụng"
                icon={Tag}
                badge={{ text: "Hoạt động", variant: "default" }}
              />
            )}
            {statisticsData.voucher_count_inactive !== null && (
              <StatCard
                title="Voucher tạm ngưng"
                value={statisticsData.voucher_count_inactive}
                description="Tạm thời không sử dụng được"
                icon={Tag}
                badge={{ text: "Tạm ngưng", variant: "secondary" }}
              />
            )}
            {statisticsData.voucher_count_deleted !== null && (
              <StatCard
                title="Voucher đã xóa"
                value={statisticsData.voucher_count_deleted}
                description="Đã bị xóa khỏi hệ thống"
                icon={Tag}
                badge={{ text: "Đã xóa", variant: "secondary" }}
              />
            )}
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            Danh Mục
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statisticsData.category_count_active !== null && (
              <StatCard
                title="Danh mục hoạt động"
                value={statisticsData.category_count_active}
                description="Danh mục chính đang sử dụng"
                icon={Grid3X3}
                badge={{ text: "Hoạt động", variant: "default" }}
              />
            )}
            {statisticsData.category_detail_count !== null && (
              <StatCard
                title="Chi tiết danh mục"
                value={statisticsData.category_detail_count}
                description="Tổng số danh mục con"
                icon={Grid3X3}
                badge={{ text: "Chi tiết", variant: "secondary" }}
              />
            )}
            {statisticsData.category_count_deleted !== null && (
              <StatCard
                title="Danh mục đã xóa"
                value={statisticsData.category_count_deleted}
                description="Đã bị xóa khỏi hệ thống"
                icon={Grid3X3}
                badge={{ text: "Đã xóa", variant: "secondary" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
