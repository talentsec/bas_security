import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import BackImg from "@/assets/login_back.svg";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setLoginState } from "@/store/slices/account";
import { GetCaptcha, Login as LoginApi, Register, VerifyCaptcha } from "@/api/account";
import { useMutation, useQuery } from "react-query";
import { RequestStateEnum } from "@/type/api";

const BaseUrl = "http://10.10.10.242:8051";

enum TabEnum {
  LOGIN = "login",
  REGISTOR = "registor"
}

const TabList = [TabEnum.LOGIN, TabEnum.REGISTOR];

interface LoginPannelPropsType {
  jumpToRegister: () => void;
}
interface RegisterPannelPropsType {
  jumpToLogin: () => void;
}

const LoginPannel = ({ jumpToRegister }: LoginPannelPropsType) => {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <section className="text-blue-500 text-center text-lg mb-8">密码登录</section>
      <section>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "请输入邮箱" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                  if (reg.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("请输入正确的邮箱"));
                }
              })
            ]}
          >
            <span className="border-b pb-2">
              <Input className="w-96" placeholder="邮箱" size="large" bordered={false} />
            </span>
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <span className="border-b pb-2">
              <Input.Password placeholder="请输入密码" className="w-96" size="large" bordered={false} />
            </span>
          </Form.Item>
          <div className="flex justify-between pb-8 px-2 w-full">
            {/* <Checkbox>记住我</Checkbox> */}
            <span></span>
            <div
              className=" text-gray-400 text-right  px-3 cursor-pointer hover:text-blue-500"
              onClick={() => jumpToRegister()}
            >
              账号注册
            </div>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-96" size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
};

interface FormType {
  password: string;
  password2: string;
  email: string;
  verifyCode: string;
}

const RegisterPannel = ({ jumpToLogin }: RegisterPannelPropsType) => {
  const { data: captchaData, refetch } = useQuery("get-captch", GetCaptcha, {
    select: data => data.data
  });

  const { mutate: RogisterMutate } = useMutation(Register, {
    onSuccess: data => {
      if (data.code === RequestStateEnum.SUCCESS) {
        message.success("注册成功");
      } else {
        // Noop
      }
    },
    onError: error => {
      console.log(error);
    }
  });

  const onFinish = (values: FormType) => {
    RogisterMutate(getCommitForm(values));
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  const getCommitForm = (form: FormType) => {
    return {
      captchaId: captchaData?.captchaId || "",
      captchaValue: form.verifyCode,
      name: form.email,
      password: form.password
    };
  };

  return (
    <div>
      <section className="text-blue-500 text-center text-lg mb-8">注册账号</section>
      <section>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                  if (reg.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("请输入正确的邮箱"));
                }
              })
            ]}
          >
            <span className="border-b pb-2">
              <Input className="w-96 border-b" placeholder="邮箱" size="large" bordered={false} />
            </span>
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <span className="border-b pb-2">
              <Input.Password placeholder="密码" className="w-96" size="large" bordered={false} />
            </span>
          </Form.Item>
          <Form.Item
            name="password2"
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入密码内容不一致"));
                }
              })
            ]}
          >
            <span className="border-b pb-2">
              <Input.Password placeholder="确认密码" className="w-96" size="large" bordered={false} />
            </span>
          </Form.Item>
          <Form.Item name="verifyCode" rules={[{ required: true, message: "请输入验证码" }]}>
            <div className="flex justify-between w-full">
              <span className="border-b pb-2 ">
                <Input placeholder="验证码" className="w-60" size="large" bordered={false} />
              </span>
              <span className="h-10 inline-block ml-4 border cursor-pointer" onClick={() => refetch()}>
                <img src={captchaData ? BaseUrl + captchaData.imageUrl : ""} alt="" className="h-full " />
              </span>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-96" size="large">
              同意条款并注册
            </Button>
          </Form.Item>
        </Form>
        <section className="text-gray-400 text-sm text-center">
          已有账号？点击
          <span className="text-blue-700 cursor-pointer" onClick={() => jumpToLogin()}>
            登录
          </span>
        </section>
      </section>
    </div>
  );
};

export default function Login() {
  const [curTab, setCurTab] = useState(TabList[0]);

  const jumpToRegister = () => {
    setCurTab(TabEnum.REGISTOR);
  };

  const jumpToLogin = () => {
    setCurTab(TabEnum.LOGIN);
  };

  const [state, setState] = useState(false);
  const dispatch = useAppDispatch();

  const Navigate = useNavigate();

  const aaa = () => {
    Navigate("/app/my/vector");
    setState(!state);
    dispatch(setLoginState(true));
  };

  return (
    <div className="w-screen h-screen bg-blue-500 relative">
      <div className="p-10 border z-10 absolute top-0" onClick={aaa}>
        jjjj
      </div>
      <img src={BackImg} alt="" className="w-full h-full absolute top-0 left-0" />
      <div className="absolute w-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
        <section className="text-center text-3xl tracking-widest">潮汐自动化模拟攻击安全管理平台</section>
        <section className="text-center uppercase font-thin tracking-1rem text-lg mt-4">
          breach attack simulation
        </section>
        <section className="w-96 rounded-lg bg-white mx-auto mt-8 p-14" style={{ width: "500px" }}>
          {curTab === TabEnum.LOGIN ? (
            <LoginPannel jumpToRegister={jumpToRegister} />
          ) : (
            <RegisterPannel jumpToLogin={jumpToLogin}></RegisterPannel>
          )}
        </section>
      </div>
    </div>
  );
}
