"use client";

import Loader from "@/components/Loader/loader";
import useHookMutation from "@/hooks/useHookMutation";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";
import { IBooth, ICategory, ResponseData } from "@/types";
import { getUrlImage } from "@/utils/getUrlImage";
import { Avatar, colors, Modal } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { AiOutlinePicture } from "react-icons/ai";
import { BiMinusCircle, BiPlusCircle, BiPlusMedical } from "react-icons/bi";


interface IProductDetailPayload {
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

export default function CreateProduct({ booth, onSuccess }: { booth: IBooth; onSuccess: () => void }) {
  const [payLoadProdetail, setPayLoadProdetail] = useState<IProductDetailPayload>({
    product_name: "",
    image: "",
    sale_price: 0,
    promotional_price: 0,
    stock_quantity: 0,
    color: "",
    sizes: [],
  });

  const [payload, setPayload] = useState<IProductPayload>({
    booth_id: booth.id,
    product_desc: "",
    category_detail_id: "",
    list_product_detail: [],
  });

  const [openModal, setOpenModal] = useState(false);

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
  const createProductMutation = useHookMutation((data: any) => {
    return productService.create(data);
  });

  const handleCreateProduct = () => {
    createProductMutation.mutate(payload, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  const [size, setSize] = useState<string>("");

  const handleOnChangeProductDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayLoadProdetail({ ...payLoadProdetail, [e.target.name]: e.target.value });
  }

  const handleAddProductDetail = () => {
    setPayload({ ...payload, list_product_detail: [...payload.list_product_detail, payLoadProdetail] });
    setPayLoadProdetail({
      product_name: "",
      image: "",
      sale_price: 0,
      promotional_price: 0,
      stock_quantity: 0,
      color: "",
      sizes: [],
    });
    setOpenModal(false);

  }

  return (
    <div className="w-[1000px] p-5 rounded-lg bg-white">
      <p className="text-2xl pb-3">Thêm sản phẩm</p>

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
            value={payload.product_desc}
            type="text"
            id="product_desc"
            name="product_desc"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-5">
        <p className="font-bold">Danh sách sản phẩm</p>
        <button
          onClick={() => setOpenModal(true)}
          className={`flex items-center opacity-100 justify-center gap-2 space-y-1 text-base font-semibold text-white bg-orange-500 rounded-lg px-4 py-2`}
        >
          <BiPlusCircle size={24} />
          Thêm chi tiết sản phẩm
        </button>
      </div>

      <div className="border border-solid border-gray-300 mt-3 min-h-[200px]">
        <div className="grid grid-cols-8 text-center border-b py-3 border-solid border-gray-300">
          <p className="font-semibold">Ảnh</p>
          <p className="font-semibold">Tên sản phẩm</p>
          <p className="font-semibold">Giá bán</p>
          <p className="font-semibold">Giá khuyến mại</p>
          <p className="font-semibold">Màu sắc</p>
          <p className="font-semibold">Số lượng</p>
          <p className="font-semibold">Kích cỡ</p>
          <p className="font-semibold">Thao tác</p>
        </div>
        <div className="flex flex-col gap-3 py-3">
          {payload.list_product_detail.length > 0 && payload.list_product_detail.map((pd, idx) => (
            <div key={idx} className="grid grid-cols-8 items-center text-center pr-2">
              <div className="flex items-center justify-center">
                <Avatar src={pd.image} alt={pd.product_name} className="mr-2" />
              </div>
              <span>{pd.product_name}</span>
              <span>{pd.sale_price}</span>
              <span>{pd.promotional_price}</span>
              <span>{pd.color}</span>
              <span>{pd.stock_quantity}</span>
              <span>{pd.sizes.join(", ")}</span>
              <button
                className="flex items-center justify-center"
                onClick={() =>
                  setPayload({
                    ...payload,
                    list_product_detail: payload.list_product_detail.filter((_, index) => index !== idx),
                  })
                }
              >
                <BiMinusCircle size={24} className="bg-red-500 rounded-full text-white" />
              </button>
            </div>

          ))}
        </div>
      </div>



      <div className="flex justify-end">
        <button onClick={handleCreateProduct} className="bg-blue-500 text-white rounded-lg px-5 py-2 mt-5">
          Xác nhận
        </button>
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
                {" "}
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
    </div>
  );
}
