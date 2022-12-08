import { configureStore } from "@reduxjs/toolkit";
// import globalSlice from "./slices/global";

const store = configureStore({
  reducer: {
    // global: globalSlice
  }
});

export default store;
