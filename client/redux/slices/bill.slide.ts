import { ISaleBill } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bill_waiting: [] as ISaleBill[],
    bill_shipping: [] as ISaleBill[],
    bill_cancel: [] as ISaleBill[],
    bill_success: [] as ISaleBill[],
}


const billSlide = createSlice({
    name: 'bill',
    initialState,
    reducers: {
        setBillWaiting: (state, action) => {
            state.bill_waiting = action.payload;
        },
        setBillShipping: (state, action) => {
            state.bill_shipping = action.payload;
        },
        setBillCancel: (state, action) => {
            state.bill_cancel = action.payload;
        },
        setBillSuccess: (state, action) => {
            state.bill_success = action.payload;
        },
    }
});

export const {
    setBillWaiting,
    setBillShipping,
    setBillCancel,
    setBillSuccess,
} = billSlide.actions;

export const billReducer = billSlide.reducer;