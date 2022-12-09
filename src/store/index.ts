import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./slices/account";

const store = configureStore({
  reducer: {
    account: globalSlice
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
