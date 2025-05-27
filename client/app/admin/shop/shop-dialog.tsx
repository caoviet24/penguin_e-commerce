"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boothService } from "@/services/booth.service";
import { IBooth } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ShopDialogProps {
  shopId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShopDialog({
  shopId,
  open,
  onOpenChange,
}: ShopDialogProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IBooth>();

  // Fetch shop details
  const {
    data: shop,
    isLoading,
    isError,
  } = useQuery<IBooth>({
    queryKey: ["shop", shopId],
    queryFn: () => boothService.getById(shopId as string),
    enabled: !!shopId && open,
  });

  // Reset form when shop data changes
  useEffect(() => {
    if (shop) {
      reset(shop);
    }
  }, [shop, reset]);

  // Update shop mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<IBooth>) =>
      boothService.update(shopId as string, data),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["shop", shopId] });
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      setIsEditing(false);
      onOpenChange(false);
    },
  });

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

  const onSubmit = (data: IBooth) => {
    updateMutation.mutate(data);
  };

  const handleDialogClose = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa thông tin cửa hàng" : "Thông tin cửa hàng"}
          </DialogTitle>
        </DialogHeader>

        {isLoading && <div className="py-8 text-center">Đang tải...</div>}
        {isError && (
          <div className="py-8 text-center text-red-500">
            Có lỗi xảy ra khi tải thông tin cửa hàng. Vui lòng thử lại.
          </div>
        )}

        {shop && !isLoading && !isError && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 py-4">
              {/* Avatar and basic info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={shop.avatar || "/default-avatar.png"}
                    alt={shop.name}
                  />
                  <AvatarFallback>
                    {shop.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{shop.name}</h3>
                  <p className="text-sm text-gray-500">ID: {shop.id.substring(0, 8)}...</p>
                </div>
              </div>

              {/* Shop Details Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Tên cửa hàng</label>
                  {isEditing ? (
                    <Input
                      {...register("name", { required: "Bắt buộc" })}
                      className="w-full"
                    />
                  ) : (
                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                      {shop.name}
                    </div>
                  )}
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Mô tả</label>
                  {isEditing ? (
                    <textarea
                      {...register("description")}
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                    />
                  ) : (
                    <div className="py-2 px-3 border rounded-md bg-gray-50 min-h-[60px]">
                      {shop.description || "Không có mô tả"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái hoạt động</label>
                  {isEditing ? (
                    <select
                      {...register("is_active")}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                    >
                      <option value="true">Đang hoạt động</option>
                      <option value="false">Không hoạt động</option>
                    </select>
                  ) : (
                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                      {shop.is_active ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          Không hoạt động
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái cấm</label>
                  {isEditing ? (
                    <select
                      {...register("is_banned")}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                    >
                      <option value="false">Không bị cấm</option>
                      <option value="true">Bị cấm</option>
                    </select>
                  ) : (
                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                      {shop.is_banned ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          Bị cấm
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Không bị cấm
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ngày tạo</label>
                  <div className="py-2 px-3 border rounded-md bg-gray-50">
                    {formatDate(shop.created_at)}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cập nhật lần cuối</label>
                  <div className="py-2 px-3 border rounded-md bg-gray-50">
                    {formatDate(shop.updated_at)}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Người tạo</label>
                  <div className="py-2 px-3 border rounded-md bg-gray-50">
                    {shop.created_by || "Không có thông tin"}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Người cập nhật</label>
                  <div className="py-2 px-3 border rounded-md bg-gray-50">
                    {shop.updated_by || "Không có thông tin"}
                  </div>
                </div>
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
                      reset(shop);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
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