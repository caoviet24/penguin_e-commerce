import { createSlice } from '@reduxjs/toolkit';
import { IBooth, ResponseData } from '@/types';

const initialState: { booth: IBooth[] } = {
    booth: [],
};

export const boothSlice = createSlice({
    name: 'booth',
    initialState,
    reducers: {
        setBooths: (state, action) => {
            state.booth = action.payload;
        },
    },
});

export const { setBooths } = boothSlice.actions;
export const boothReducer = boothSlice.reducer;