import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { setLoginState } from "@/store/slices/account";
import RegisterPannel from "./RegisterPannel";
import LoginPannel from "./LoginPannel";
import BackImg from "@/assets/login_back.svg";
import storage from "@/utils/storage";

enum TabEnum {
  LOGIN = "login",
  REGISTOR = "registor"
}

const TabList = [TabEnum.LOGIN, TabEnum.REGISTOR];

export default function Login() {
  const [curTab, setCurTab] = useState(TabList[0]);

  const jumpToRegister = () => {
    setCurTab(TabEnum.REGISTOR);
  };

  const jumpToLogin = () => {
    setCurTab(TabEnum.LOGIN);
  };

  const dispatch = useAppDispatch();

  const Navigate = useNavigate();

  const login = (token: string) => {
    storage.setToken({
      token,
      expiration: new Date().getTime() + 60 * 60 * 6 * 1000
    });
    dispatch(setLoginState(true));
    Navigate("/app/my/vector");
  };

  return (
    <div className="w-screen h-screen bg-blue-500 relative">
      <img src={BackImg} alt="" className="w-full h-full absolute top-0 left-0" />
      <div className="absolute w-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
        <section className="text-center text-3xl tracking-widest">潮汐自动化模拟攻击安全管理平台</section>
        <section className="text-center uppercase font-thin tracking-1rem text-lg mt-4">
          breach attack simulation
        </section>
        <section className="w-96 rounded-lg bg-white mx-auto mt-8 p-14" style={{ width: "500px" }}>
          {curTab === TabEnum.LOGIN ? (
            <LoginPannel jumpToRegister={jumpToRegister} success={login} />
          ) : (
            <RegisterPannel jumpToLogin={jumpToLogin}></RegisterPannel>
          )}
        </section>
      </div>
    </div>
  );
}
