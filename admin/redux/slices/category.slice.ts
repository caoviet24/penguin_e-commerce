import { createSlice } from '@reduxjs/toolkit';
import { ICategory, ResponseData } from '@/types';

const initialState: { category: ICategory[] } = {
    category: [],
};

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.category = action.payload;
        },
    },
});

export const { setCategories } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;