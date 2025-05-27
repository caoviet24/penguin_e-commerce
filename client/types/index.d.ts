export interface StatisticalData2 {
    total: number,
    rate: number,
}

export interface StatisticalData {
    day: string;
    num: number;
}

export interface ChartData {
    data: StatisticalData[];
    title: string;
    lable: string;
    lineColor: string;
    backgroundColor: string;
}

export interface CardData {
    total: number;
    rate: number;
    title: string;
    icon: JSX.Element;
}

export interface Statistical {
    date: string;
    total: number;
    products_sold: number;
}



export interface ResponseData<T> {
    page_number: number;
    page_size: number;
    total_record: number;
    data: T[]; 
}


export interface IAccount {
    id: string;
    username: string;
    password: string;
    role: string;
    is_banned: boolean;
    full_name: string;
    nick_name: string;
    birth: Date;
    avatar: string;
    gender: string;
    address: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
    is_detele: boolean;
}


export interface IBooth {
    id: string;
    name: string;
    description: string;
    avatar: string;
    is_active: boolean;
    is_banned: boolean;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
    is_detele: boolean;
}

export interface ICategory {
    id: string;
    name: string;
    image: string;
    created_at: Date;
    created_by: string;
    last_updated?: Date; // Field in JSON response
    updated_at?: Date;   // Field in interface
    updated_by: string;
    is_deleted: boolean;
    list_category_detail: ICategoryDetail[];
}

export interface ICategoryDetail {
    id: string;
    name: string;
    category_id: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
}

export interface IProduct {
    id: string;
    product_desc: string;
    status: string;
    is_active: boolean;
    created_at: Date;
    booth_id: string;
    updated_at: Date;
    updated_by: string;
    is_detele: boolean;
    list_product_detail: IProductDetail[];
}

export interface IProductDetail {
    id: string;
    product_name: string;
    image: string;
    color: string;
    size: string;
    sale_price: number;
    promotional_price: number;
    sale_quantity: number;
    stock_quantity: number;
    image: string;
    created_at: Date;
    updated_at: Date;
    product_id: string;
    is_deleted: boolean;
}

export interface IProductReview {
    id: string;
    product_id: string;
    rating: number;
    comment: string;
    created_at: string;
    created_by: string;
    account: IAccount;
    review_medias: IReviewMedia[];
}

export interface IReviewMedia {
    id: string;
    review_id: string;
    created_at: Date;
    media_type: string;
    media_url: string;
}

export interface IOrderItem {
    id: string;
    product_detail_id: string;
    quantity: number;
    size: string;
    color: string;
    booth_id: string;
    created_at: Date;
    buyer_id: string;
    updated_by: string;
    last_updated: Date;
    product_detail: IProductDetail;
}


export interface IVoucher {
    id: string;
    voucher_type: string;
    voucher_name: string;
    voucher_code: string;
    expiry_date: Date;
    quantity_remain: number;
    quantity_used: number;
    discount: number;
    type_discount: string;
    status: number;
    apply_for: string;
    created_by: string;
    is_deleted: boolean;
}


export interface ISaleBill {
    id: string;
    buyer_id: string;
    seller_id: string;
    total_bill: number;
    status_bill: number;
    created_at: Date;
    updated_at: Date;
    booth: IBooth;
    list_sale_bill_detail: ISaleBillDetail[];
}


export interface ISaleBillDetail {
    id: string;
    sale_bill_id: string;
    product_detail_id: string;
    quantity: number;
    size: string;
    color: string;
    product_detail: IProductDetail;
}