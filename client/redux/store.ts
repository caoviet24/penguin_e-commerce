import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { accountReducer } from "./slices/account.slice";
import { cartReducer } from "./slices/cart.slice";
import { billReducer } from "./slices/bill.slide";
import { boothReducer } from "./slices/booth.slice";

const rootReducer = combineReducers({
    account: accountReducer,
    cart: cartReducer,
    bill: billReducer,
    booth: boothReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, 
        }),
});


export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
