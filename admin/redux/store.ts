import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { accountReducer } from "./slices/account.slice";
import { boothReducer } from "./slices/booth.slice";
import { categoryReducer } from "./slices/category.slice";

const rootReducer = combineReducers({
    account: accountReducer,
    booth: boothReducer,
    category: categoryReducer,
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
