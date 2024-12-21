import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { accountReducer } from "./slices/account.slice";



const rootReducer = combineReducers({
    account: accountReducer
});


export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;