import React from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import storage from "@/utils/storage";
import { useNavigate } from "react-router-dom";
import { setLoginState } from "@/store/slices/account";

export const useAuth = (): [boolean, () => void] => {
  const Navigator = useNavigate();
  const hasLogin = useAppSelector(state => state.account.hasLogin);

  const dispatch = useAppDispatch();
  const logout = () => {
    dispatch(setLoginState(false));
    storage.clearToken();
    Navigator("/");
  };

  return [hasLogin, logout];
};
