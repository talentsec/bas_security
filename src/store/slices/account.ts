import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AccountState {
  hasLogin: boolean;
  user: ResponseType.GetUserDetail | null;
}

const initialState: AccountState = {
  hasLogin: false,
  user: null
};

const AccountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUser: (state, Action: PayloadAction<ResponseType.GetUserDetail>) => {
      state.user = Action.payload;
    },
    setLoginState: (state, Action: PayloadAction<boolean>) => {
      console.log("改变了", Action.payload);
      state.hasLogin = Action.payload;
    }
  }
});

export const { setUser, setLoginState } = AccountSlice.actions;
export default AccountSlice.reducer;
