import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import storage from "@/utils/storage";

interface AccountState {
  hasLogin: boolean;
  user: ResponseType.GetUserDetail | null;
}

const initialState: AccountState = {
  hasLogin: storage.getToken()?.expiration > new Date().getTime(),
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
      state.hasLogin = Action.payload;
    }
  }
});

export const { setUser, setLoginState } = AccountSlice.actions;
export default AccountSlice.reducer;
