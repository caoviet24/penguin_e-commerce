"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { IProduct } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

interface ProductDialogProps {
  productId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDialog({
  productId,
  open,
  onOpenChange,
}: ProductDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeVariant, setActiveVariant] = useState<number>(0);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IProduct>();

  // Fetch product details
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<IProduct>({
    queryKey: ["product", productId],
    queryFn: () => productService.getById(productId as string),
    enabled: !!productId && open,
  });

  // Reset form when product data changes
  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  // Format date for display
  const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    } catch {
      return "Invalid Date";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const onSubmit = () => {
    // In a real implementation, you would update the product here
    toast.success("Cập nhật sản phẩm thành công");
    setIsEditing(false);
    onOpenChange(false);
  };

  const handleDialogClose = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa sản phẩm" : "Thông tin sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        {isLoading && <div className="py-8 text-center">Đang tải...</div>}
        {isError && (
          <div className="py-8 text-center text-red-500">
            Có lỗi xảy ra khi tải thông tin sản phẩm. Vui lòng thử lại.
          </div>
        )}

        {product && !isLoading && !isError && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 py-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mô tả sản phẩm</label>
                    {isEditing ? (
                      <textarea
                        {...register("product_desc", { required: "Bắt buộc" })}
                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                      />
                    ) : (
                      <div className="py-2 px-3 border rounded-md bg-gray-50 min-h-[60px]">
                        {product.product_desc}
                      </div>
                    )}
                    {errors.product_desc && (
                      <p className="text-sm text-red-500">{errors.product_desc.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ID Cửa hàng</label>
                      <div className="py-2 px-3 border rounded-md bg-gray-50">
                        {product.booth_id}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Trạng thái</label>
                      {isEditing ? (
                        <select
                          {...register("status")}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                        >
                          <option value="AVAILABLE">Có sẵn</option>
                          <option value="UNAVAILABLE">Không có sẵn</option>
                        </select>
                      ) : (
                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'AVAILABLE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.status === 'AVAILABLE' ? 'Có sẵn' : 'Không có sẵn'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ngày tạo</label>
                      <div className="py-2 px-3 border rounded-md bg-gray-50">
                        {formatDate(product.created_at)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cập nhật lần cuối</label>
                      <div className="py-2 px-3 border rounded-md bg-gray-50">
                        {formatDate(product.updated_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Variants */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Biến thể sản phẩm</h3>
                
                {product.list_product_detail && product.list_product_detail.length > 0 ? (
                  <div className="space-y-4">
                    {/* Variant Tabs */}
                    <div className="flex flex-wrap gap-2">
                      {product.list_product_detail.map((variant, index) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setActiveVariant(index)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            activeVariant === index
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {variant.product_name.split(' ').slice(-2).join(' ')}
                        </button>
                      ))}
                    </div>

                    {/* Active Variant Details */}
                    {product.list_product_detail[activeVariant] && (
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-1/3">
                            <div className="aspect-square rounded-md overflow-hidden">
                              <img
                                src={product.list_product_detail[activeVariant].image}
                                alt={product.list_product_detail[activeVariant].product_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          <div className="w-full sm:w-2/3 space-y-3">
                            <div>
                              <label className="text-sm font-medium">Tên sản phẩm</label>
                              <div className="py-2 px-3 border rounded-md bg-gray-50">
                                {product.list_product_detail[activeVariant].product_name}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm font-medium">Màu sắc</label>
                                <div className="py-2 px-3 border rounded-md bg-gray-50 flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: product.list_product_detail[activeVariant].color.toLowerCase() }}
                                  ></div>
                                  {product.list_product_detail[activeVariant].color}
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Kích thước</label>
                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                  {product.list_product_detail[activeVariant].size}
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm font-medium">Giá bán</label>
                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                  {formatCurrency(product.list_product_detail[activeVariant].sale_price)}
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Giá khuyến mãi</label>
                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                  {formatCurrency(product.list_product_detail[activeVariant].promotional_price)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm font-medium">Tồn kho</label>
                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                  {product.list_product_detail[activeVariant].stock_quantity}
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Đã bán</label>
                                <div className="py-2 px-3 border rounded-md bg-gray-50">
                                  {product.list_product_detail[activeVariant].sale_quantity}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Không có biến thể sản phẩm
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      reset(product);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">
                    Lưu thay đổi
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    Đóng
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}