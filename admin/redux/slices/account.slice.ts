import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IAccount, ResponseData } from '@/types';

const initialState: { account: IAccount[] } = {
    account: [],
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccounts: (state, action) => {
            state.account = action.payload;
        },
    },
});

export const { setAccounts } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;
