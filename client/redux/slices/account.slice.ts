import { IAccount } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    my_account: {} as IAccount,
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setMyAcount: (state, action: PayloadAction<IAccount>) => {
            state.my_account = action.payload;
        },
    },
});

export const { setMyAcount } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;
