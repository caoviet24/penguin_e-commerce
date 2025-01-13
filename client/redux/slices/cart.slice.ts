import { IOrderItem } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cart: [] as IOrderItem[],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCarts: (state, action) => {
            state.cart = action.payload;
        },
        setAddToCart: (state, action) => {
            state.cart.push(action.payload);
        },
        setDeleteToCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload.id);
        } 
    },
});

export const {
    setCarts,
    setAddToCart,
    setDeleteToCart,
} = cartSlice.actions;


export const cartReducer = cartSlice.reducer;
