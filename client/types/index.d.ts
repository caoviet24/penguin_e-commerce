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
    created_at: Date;
    updated_at: Date;
    user: IUser;
}

export interface IUser {
    user_id: string;
    full_name: string;
    nick_name: string;
    birth: Date;
    avatar: string;
    address: string;
    phone: string;
    acc_id: string;
}

export interface IBooth {
    id: string;
    booth_name: string;
    booth_description: string;
    booth_avatar: string;
    is_active: boolean;
    is_banned: boolean;
    created_at: Date;
    created_by: string;
    updated_at: Date;
    updated_by: string;
}

export interface IProduct {
    id: string;
    product_desc: string;
    booth_id: string;
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
}

export interface IOrderItem {
    id: string;
    product_detail_id: string;
    quantity: number;
    size: string;
    color: string;
    seller_id: string;
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
    status_voucher: number;
    apply_for: string;
    created_by: string;
    boot_id: string;
}


export interface ISaleBill {
    id: string;
    buyer_id: string;
    seller_id: string;
    total_price: number;
    status: number;
    created_at: Date;
    updated_at: Date;
    booth: IBooth;
    sale_bill_detail: ISaleBillDetail[];
}


export interface ISaleBillDetail {
    id: string;
    sale_bill_id: string;
    product_detail_id: string;
    quantity: number;
    size: string;
    color: string;
    product_detail: IProductDetail[];
}