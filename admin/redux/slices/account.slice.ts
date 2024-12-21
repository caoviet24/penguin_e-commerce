import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IAcountState {
  my_account: any,
  access_token: any,
}

const initialState: IAcountState = {
  my_account: null,
  access_token: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountState: (state, action: PayloadAction<IAcountState>) => {
      state.my_account = action.payload.my_account;
      state.access_token = action.payload.access_token;
    },
  },
});

export const { setAccountState } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;