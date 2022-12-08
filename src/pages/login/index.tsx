import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import BackImg from "@/assets/login_back.svg";

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
          <Form.Item name="username" rules={[{ required: true, message: "请输入邮箱" }]}>
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
            <Checkbox>记住我</Checkbox>
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

const RegisterPannel = ({ jumpToLogin }: RegisterPannelPropsType) => {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
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
          <Form.Item name="username" rules={[{ required: true, message: "请输入邮箱" }]}>
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
            <span className="border-b pb-2">
              <Input placeholder="验证码" className="w-60" size="large" bordered={false} />
            </span>
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
            <LoginPannel jumpToRegister={jumpToRegister} />
          ) : (
            <RegisterPannel jumpToLogin={jumpToLogin}></RegisterPannel>
          )}
        </section>
      </div>
    </div>
  );
}
