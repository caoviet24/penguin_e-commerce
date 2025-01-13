import { IBooth } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    my_booth: {} as IBooth,
};

export const boothSlice = createSlice({
    name: 'booth',
    initialState,
    reducers: {
        setBooth: (state, action) => {
            state.my_booth = action.payload;
        },
    },
});

export const { setBooth } = boothSlice.actions;
export const boothReducer = boothSlice.reducer;
