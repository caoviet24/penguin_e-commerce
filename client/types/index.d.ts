export interface StatisticalData2 {
    total: number;
    rate: number;
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
    updated_at?: Date; // Field in interface
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
    is_deleted: boolean;
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
    status: string;
    pay_method: string;
    buyer_id: string;
    seller_id: string;
    total_bill: number;
    is_evaluated: boolean;
    created_at: Date;
    updated_at: Date;
    booth: IBooth;
    delivery_address: IDeliveryAddress;
    list_sale_bill_detail: ISaleBillDetail[];
    back_bill: IBackBill | null;
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

export interface IDeliveryAddress {
    id: string;
    full_name: string;
    phone: string;
    address: string;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    is_deleted: boolean;
}

export interface IBackBill {
    id: string;
    bill_id: string;
    reason_back: string;
    image: string;
    video: string;
    reply_content: string;
    reply_image: string;
    reply_video: string;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
    account: IAccount;
}

export interface IOverView {
    total_bill_success: number;
    total_bill_pending: number;
    total_bill_cancel: number;
    total_bill_back_pending: number;
    total_bill_back_success: number;
    total_bill_back_cancel: number;
    voucher_count_active: number | null;
    voucher_count_inactive: number | null;
    voucher_count_deleted: number | null;
    product_count_active: number;
    product_count_inactive: number;
    product_count_deleted: number | null;
    product_count_unavailable: number;
    booth_count_active: number | null;
    booth_count_inactive: number | null;
    booth_count_deleted: number | null;
    booth_count_pending: number | null;
    booth_count_banned: number | null;
    account_count: number | null;
    account_count_banned: number | null;
    account_count_active: number | null;
    account_count_deleted: number | null;
    category_count_deleted: number | null;
    category_count_active: number | null;
    category_detail_count: number | null;
}

export interface IStatistical {
    previous: string;
    amount: number;
    product_sold: number;
}

export interface IStatisticalData {
    date: string;
    revenue: number;
    orders: number;
    products_sold: number;
}

export interface StatisticalDto {
    previous: string;
    amount: number;
    product_sold: number;
}