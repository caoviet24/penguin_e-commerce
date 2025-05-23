"use client";

import Loader from "@/components/Loader/loader";
import useHookMutation from "@/hooks/useHookMutation";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";
import { productDetailService } from "@/services/productdetail.service";
import { IBooth, ICategory, IProduct, IProductDetail, ResponseData } from "@/types";
import { getUrlImage } from "@/utils/getUrlImage";
import { Avatar, colors, Modal } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePicture } from "react-icons/ai";
import { BiEditAlt, BiMinusCircle, BiPlusCircle, BiPlusMedical } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import ProductDetail from "../ProductDetail/ProductDetail";


interface IProductDetailPayload {
    product_id: string;
    product_name: string;
    image: string;
    sale_price: number;
    promotional_price: number;
    stock_quantity: number;
    color: string;
    sizes: string[];
}

interface IProductPayload {
    booth_id: string;
    product_desc: string;
    category_detail_id: string;
    list_product_detail: IProductDetailPayload[];
}

interface IProps {
    mode: 'update' | 'delete' | 'view';
    product: IProduct;
    onSuccess?: (product: IProduct) => void;
    onClose?: () => void;
}

export default function Product({ mode, product, onSuccess, onClose }: IProps) {

    const [payLoadProdetail, setPayLoadProdetail] = useState<IProductDetailPayload>({
        product_id: product.id,
        product_name: "",
        image: "",
        sale_price: 0,
        promotional_price: 0,
        stock_quantity: 0,
        color: "",
        sizes: [],
    });

    const [payload, setPayload] = useState<IProductPayload>({
        booth_id: product.booth_id,
        product_desc: "",
        category_detail_id: "",
        list_product_detail: [],
    });

    const [dataProduct, setDataProduct] = useState<IProduct>();
    useEffect(() => {
        if (product) {
            setDataProduct(product);
        }


    }, [product, dataProduct]);

    const [openModal, setOpenModal] = useState(false);
    const [productDetailSelected, setProductDetailSelected] = useState<IProductDetail>();
    const [openDialog, setOpenDialog] = useState(false);

    const { data: cgData } = useQuery<ResponseData<ICategory>>({
        queryKey: ["category-detail"],
        queryFn: () => categoryService.getWithPagination({ page_number: 1, page_size: 100 }),
    });

    const [imagePreview, setImagePreview] = useState("");
    const inputImageRef = useRef<HTMLInputElement>(null);

    const handleGetImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPayLoadProdetail({ ...payLoadProdetail, image: "" });
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            const url = await getUrlImage(file);
            if (url) {
                setPayLoadProdetail({ ...payLoadProdetail, image: url });
                setImagePreview("");
            }
        }
    };



    const [size, setSize] = useState<string>("");

    const handleOnChangeProductDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPayLoadProdetail({ ...payLoadProdetail, [e.target.name]: e.target.value });
    }

    const createProductDetailMutation = useHookMutation((data: any) => {
        return productDetailService.create(data);
    });
    const handleAddProductDetail = () => {
        createProductDetailMutation.mutate(payLoadProdetail, {
            onSuccess: (data) => {
                setDataProduct((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        list_product_detail: [...prev.list_product_detail, data],
                    };
                });
                toast.success("Tạo sản phẩm thành công", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setPayLoadProdetail({
                    product_id: product.id,
                    product_name: "",
                    image: "",
                    sale_price: 0,
                    promotional_price: 0,
                    stock_quantity: 0,
                    color: "",
                    sizes: [],
                });
                setOpenModal(false);
            },
        });
    }

    const deleteSoftProductMutation = useHookMutation((id: string) => {
        return productService.deleteSoft(id);
    })

    const handleDeleteSoftProduct = () => {
        deleteSoftProductMutation.mutate(product.id, {
            onSuccess: (data) => {
                onSuccess && onSuccess(data);
            }
        })
    }

    const deleteSoftProductDetailMutation = useHookMutation((id: string) => {
        return productDetailService.deleteSoft(id);
    });

    const handleDeleteProductDetail = (pd: IProductDetail) => {
        deleteSoftProductDetailMutation.mutate(pd.id, {
            onSuccess: (data: IProductDetail) => {
                let idx = dataProduct?.list_product_detail.findIndex((prod) => prod.id === data.id);
                if (idx !== -1) {
                    setDataProduct((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            list_product_detail: idx !== undefined ? [...prev.list_product_detail, prev.list_product_detail[idx] = data] : prev.list_product_detail,
                        };
                    });
                };

                toast.success(`Xóa chi tiết sản phẩm ${data.product_name} thành công`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
            },
        });
    };

    const restoreProductDetailMutation = useHookMutation((id: string) => {
        return productDetailService.restore(id);
    });

    const HandleRestoreProductDetail = (pd: IProductDetail) => {
        restoreProductDetailMutation.mutate(pd.id, {
            onSuccess: (data: IProductDetail) => {
                let idx = dataProduct?.list_product_detail.findIndex((prod) => prod.id === data.id);
                if (idx !== -1) {
                    setDataProduct((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            list_product_detail: idx !== undefined ? [...prev.list_product_detail, prev.list_product_detail[idx] = data] : prev.list_product_detail,
                        };
                    });
                };

                toast.success(`Khôi phục sản phẩm ${data.product_name} thành công`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
            },
        });
    }

    const handleUpdateProductDetailSuccess = (data: IProductDetail) => {
        let idx = dataProduct?.list_product_detail.findIndex((prod) => prod.id === data.id);
        if (idx !== -1) {
            setDataProduct((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    list_product_detail: idx !== undefined ? [...prev.list_product_detail, prev.list_product_detail[idx] = data] : prev.list_product_detail,
                };
            });
        };

        toast.success(`Cập nhật sản phẩm ${data.product_name} thành công`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });

        setProductDetailSelected(undefined);
    }

    return (
        <div className="w-[1000px] p-5 rounded-lg bg-white">
            <p className="text-2xl pb-3">
                {mode === "update" && "Cập nhật sản phẩm"}
                {mode === "delete" && "Xóa sản phẩm"}
                {mode === "view" && "Xem sản phẩm"}
            </p>
            <div className="flex flex-col gap-5">
                <div>
                    <label htmlFor="product_name" className="block text-sm font-medium text-gray-900 ">
                        Danh mục
                    </label>
                    <select
                        className="w-full p-2.5 mt-3 border border-gray-300 rounded-lg"
                        onChange={(e) => setPayload({ ...payload, category_detail_id: e.target.value })}
                    >
                        {cgData &&
                            cgData.data.map((cg) => (
                                <optgroup className="font-normal" key={cg.id} label={cg.category_name}>
                                    {cg.list_category_detail.map((cd) => (
                                        <option key={cd.id} value={cd.id}>
                                            {cd.category_detail_name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="product_name" className="block mb-2 text-sm font-medium text-gray-900 ">
                        Mô tả chi tiết sản phẩm
                    </label>
                    <input
                        onChange={(e) => setPayload({ ...payload, product_desc: e.target.value })}
                        value={payload.product_desc ? payload.product_desc : dataProduct?.product_desc ?? ""}
                        type="text"
                        id="product_desc"
                        name="product_desc"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center mt-5">
                <p className="font-bold">Danh sách sản phẩm</p>
                {mode === "update" && <button
                    onClick={() => setOpenModal(true)}
                    className={`flex items-center opacity-100 justify-center gap-2 space-y-1 text-base font-semibold text-white bg-orange-500 rounded-lg px-4 py-2`}
                >
                    <BiPlusCircle size={24} />
                    Thêm chi tiết sản phẩm
                </button>}
            </div>

            <div className="border border-solid border-gray-300 mt-3 h-[200px] overflow-y-auto">
                <div className="grid grid-cols-9 text-center border-b py-3 border-solid border-gray-300">
                    <p className="font-semibold">Ảnh</p>
                    <p className="font-semibold">Tên sản phẩm</p>
                    <p className="font-semibold">Giá bán</p>
                    <p className="font-semibold">Giá khuyến mại</p>
                    <p className="font-semibold">Màu sắc</p>
                    <p className="font-semibold">Số lượng</p>
                    <p className="font-semibold">Đã bán</p>
                    <p className="font-semibold">Kích cỡ</p>
                    <p className="font-semibold">Thao tác</p>
                </div>
                <div className="flex flex-col gap-3 py-3">
                    {dataProduct && dataProduct.list_product_detail.map((pd, idx) => (
                        <div key={idx} className="grid grid-cols-9 items-center text-center pr-2">
                            <div className="flex items-center justify-center">
                                <Avatar src={pd.image} alt={pd.product_name} className="mr-2" />
                            </div>
                            <span>{pd.product_name}</span>
                            <span>{pd.sale_price.toLocaleString()}đ</span>
                            <span>{pd.promotional_price.toLocaleString()}đ</span>
                            <span>{pd.color}</span>
                            <span>{pd.stock_quantity}</span>
                            <span>{pd.sale_quantity}</span>
                            <span>{pd.size}</span>
                            <div className="flex items-center justify-center gap-3">
                                {mode === 'update' && !pd.is_deleted && <button
                                    className="flex items-center justify-center"
                                    onClick={() => handleDeleteProductDetail(pd)}
                                >
                                    <BiMinusCircle size={24} className="bg-red-500 rounded-full text-white" />
                                </button>}
                                {mode === 'update' && pd.is_deleted && <button
                                    className="flex items-center justify-center"
                                    onClick={() => HandleRestoreProductDetail(pd)}
                                >
                                    <BiPlusCircle size={24} className="bg-green-500 rounded-full text-white" />
                                </button>}

                                {mode === 'update' && !pd.is_deleted && <button
                                    className="flex items-center justify-center"
                                    onClick={() => setProductDetailSelected(pd)}
                                >
                                    <BiEditAlt size={24} className="bg-green-500 rounded-full text-white" />
                                </button>}
                            </div>
                        </div>

                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                {mode === "update" && <button onClick={onClose} className="bg-blue-500 text-white rounded-lg px-5 py-2 mt-5">
                    Cập nhật sản phẩm
                </button>}

                {mode === "delete" && <button onClick={() => setOpenDialog(true)} className="bg-red-500 text-white rounded-lg px-5 py-2 mt-5 ml-3">
                    Xóa sản phẩm
                </button>
                }
            </div>

            <Modal open={openModal} onClose={() => setOpenModal(false)} className="flex items-center justify-center">
                <div className="w-[600px] p-5 rounded-lg bg-white">
                    <p className="text-2xl pb-3">Thông tin sản phẩm</p>
                    <div>
                        <label htmlFor="product_name" className="block mb-2 text-sm font-medium text-gray-900 ">
                            Tên sản phẩm
                        </label>
                        <input
                            value={payLoadProdetail.product_name}
                            onChange={handleOnChangeProductDetail}
                            placeholder="Tên sản phẩm"
                            type="text"
                            id="product_name"
                            name="product_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div className="flex  justify-between gap-5 mt-3">
                        <div className="flex-1">
                            <label htmlFor="sale_price" className="block mb-2 text-sm font-medium text-gray-900 ">
                                Giá bán
                            </label>
                            <input
                                value={payLoadProdetail.sale_price}
                                onChange={handleOnChangeProductDetail}
                                type="number"
                                id="sale_price"
                                name="sale_price"
                                placeholder="0"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="promotional_price" className="block mb-2 text-sm font-medium text-gray-900 ">
                                Giá khuyến mại
                            </label>
                            <input
                                type="number"
                                value={payLoadProdetail.promotional_price}
                                onChange={handleOnChangeProductDetail}
                                id="promotional_price"
                                placeholder="0"
                                name="promotional_price"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                    </div>

                    <div className="flex  justify-between gap-5 mt-3">
                        <div className="flex-1">
                            <label htmlFor="color" className="block mb-2 text-sm font-medium text-gray-900 ">
                                Màu sắc
                            </label>
                            <input
                                value={payLoadProdetail.color}
                                onChange={handleOnChangeProductDetail}
                                placeholder="Màu sắc"
                                type="text"
                                id="color"
                                name="color"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="stock_quantity" className="block mb-2 text-sm font-medium text-gray-900 ">
                                Số lượng có sẵn
                            </label>
                            <input
                                type="text"
                                id="stock_quantity"
                                name="stock_quantity"
                                value={payLoadProdetail.stock_quantity}
                                onChange={handleOnChangeProductDetail}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-3 bg-gray-100 p-4 rounded-lg shadow-md">
                        <div className="flex flex-row items-center gap-2">
                            <label htmlFor="product_name" className="block w-[80px] text-sm font-semibold text-gray-700">
                                Kích cỡ
                            </label>
                            <div className="flex flex-wrap gap-2 flex-1">
                                {payLoadProdetail.sizes.length > 0 &&
                                    payLoadProdetail.sizes.map((s, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 bg-gray-300 text-gray-700 px-3 py-1 rounded-full shadow-sm"
                                        >
                                            <span className="text-sm font-medium">{s}</span>
                                            <button
                                                onClick={() =>
                                                    setPayLoadProdetail((prev) => ({
                                                        ...prev,
                                                        sizes: prev.sizes.filter((_, index) => index !== idx),
                                                    }))
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                            <input
                                type="text"
                                onChange={(e) => setSize(e.target.value)}
                                value={size}
                                name="color"
                                className="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                placeholder="Thêm kích cỡ..."
                            />
                            <button
                                onClick={() => {
                                    setPayLoadProdetail({ ...payLoadProdetail, sizes: [...payLoadProdetail.sizes, size] });
                                    setSize("");
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center gap-1"
                            >
                                <BiPlusMedical size={16} />
                                Thêm
                            </button>
                        </div>
                    </div>

                    <div
                        className="mt-4"
                        onClick={() => {
                            if (inputImageRef.current) {
                                inputImageRef.current.click();
                            }
                        }}
                    >
                        <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                            Ảnh sản phẩm
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            {!imagePreview && !payLoadProdetail.image && (
                                <div className="text-center flex flex-col items-center justify-between">
                                    <AiOutlinePicture size={50} className="text-gray-500" />
                                    <div className="mt-4 flex text-sm/6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                onChange={handleGetImage}
                                                ref={inputImageRef}
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}

                            {imagePreview && (
                                <div className="relative">
                                    <Image src={imagePreview} width={120} height={120} alt="preview" className="blur-[2px]" />
                                    <Loader size="sm" />
                                </div>
                            )}

                            {payLoadProdetail.image && <Image src={payLoadProdetail.image} width={120} height={120} alt="product" />}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={handleAddProductDetail} className="bg-blue-500 text-white rounded-lg px-5 py-2 mt-5">Thêm</button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={!!productDetailSelected || openDialog}
                onClose={() => {
                    setProductDetailSelected(undefined);
                    setOpenDialog(false);
                }}
                className="flex items-center justify-center"
            >
                <div>
                    {productDetailSelected ? (<ProductDetail productDetail={productDetailSelected} onSuccess={handleUpdateProductDetailSuccess} />) : null}

                    {openDialog &&
                        <div>
                            <div className="flex items-center justify-center">
                                <div className="w-[400px] p-5 rounded-lg bg-white">
                                    <p className="text-2xl pb-3">Xác nhận xóa sản phẩm </p>
                                    <p>Bạn có chắc chắn muốn xóa sản phẩm {productDetailSelected?.product_name} không?</p>
                                    <div className="flex justify-end gap-3 mt-5">
                                        <button onClick={() => setOpenDialog(false)} className="bg-gray-500 text-white rounded-lg px-5 py-2">Hủy</button>
                                        <button onClick={handleDeleteSoftProduct} className="bg-red-500 text-white rounded-lg px-5 py-2">Xóa</button>
                                    </div>
                                </div>
                            </div>
                        </div>}
                </div>

            </Modal>
            <ToastContainer />
        </div>
    );
}
