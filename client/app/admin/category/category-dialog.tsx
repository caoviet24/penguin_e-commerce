"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { ICategory, ICategoryDetail } from "@/types";
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

interface CategoryDialogProps {
  categoryId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CategoryDialog({
  categoryId,
  open,
  onOpenChange,
}: CategoryDialogProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [subCategories, setSubCategories] = useState<ICategoryDetail[]>([]);
  const [newSubCategory, setNewSubCategory] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ICategory>();

  // Fetch category details
  const {
    data: category,
    isLoading,
    isError,
  } = useQuery<ICategory>({
    queryKey: ["category", categoryId],
    queryFn: () => categoryService.getById(categoryId as string),
    enabled: !!categoryId && open,
  });

  // Reset form and subcategories when category data changes
  useEffect(() => {
    if (category) {
      reset(category);
      setSubCategories(category.list_category_detail || []);
    }
  }, [category, reset]);

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<ICategory>) =>
      categoryService.update(categoryId as string, {
        ...data,
        list_category_detail: subCategories
      }),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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

  const onSubmit = (data: ICategory) => {
    updateMutation.mutate({
      ...data,
      list_category_detail: subCategories
    });
  };

  const handleDialogClose = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  const addSubCategory = () => {
    if (newSubCategory.trim() === "") return;

    // Create a new subcategory with a temporary ID
    // In a real app, you'd handle this differently
    const newSubCat: ICategoryDetail = {
      id: `temp-${Date.now()}`,
      name: newSubCategory.trim(),
      category_id: categoryId as string,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false
    };

    setSubCategories([...subCategories, newSubCat]);
    setNewSubCategory("");
  };

  const removeSubCategory = (id: string) => {
    setSubCategories(subCategories.filter(sub => sub.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa danh mục" : "Thông tin danh mục"}
          </DialogTitle>
        </DialogHeader>

        {isLoading && <div className="py-8 text-center">Đang tải...</div>}
        {isError && (
          <div className="py-8 text-center text-red-500">
            Có lỗi xảy ra khi tải thông tin danh mục. Vui lòng thử lại.
          </div>
        )}

        {category && !isLoading && !isError && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 py-4">
              {/* Category image and basic info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={category.image || "/default-category.png"}
                    alt={category.name}
                  />
                  <AvatarFallback>
                    {category.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-500">ID: {category.id.substring(0, 8)}...</p>
                </div>
              </div>

              {/* Category Details Form */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tên danh mục</label>
                  {isEditing ? (
                    <Input
                      {...register("name", { required: "Bắt buộc" })}
                      className="w-full"
                    />
                  ) : (
                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                      {category.name}
                    </div>
                  )}
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Hình ảnh URL</label>
                  {isEditing ? (
                    <Input
                      {...register("image")}
                      className="w-full"
                      placeholder="URL hình ảnh"
                    />
                  ) : (
                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                      {category.image || "Không có hình ảnh"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Danh mục con</label>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input 
                          value={newSubCategory}
                          onChange={(e) => setNewSubCategory(e.target.value)}
                          className="w-48"
                          placeholder="Tên danh mục con mới"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={addSubCategory}
                          size="sm"
                        >
                          Thêm
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="border rounded-md p-3 min-h-24 bg-gray-50">
                    {subCategories && subCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {subCategories.map((subCat) => (
                          <div key={subCat.id} className="flex items-center bg-white border rounded-full px-3 py-1 text-sm">
                            {subCat.name}
                            {isEditing && (
                              <button
                                type="button"
                                className="ml-2 text-red-500"
                                onClick={() => removeSubCategory(subCat.id)}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">Không có danh mục con</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ngày tạo</label>
                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                      {formatDate(category.created_at)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cập nhật lần cuối</label>
                    <div className="py-2 px-3 border rounded-md bg-gray-50">
                      {formatDate(category.last_updated || category.updated_at)}
                    </div>
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
                      reset(category);
                      setSubCategories(category.list_category_detail || []);
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