import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";

export const useAuth = () => {
  const hasLogin = useAppSelector(state => state.account.hasLogin);

  return [hasLogin];
};
