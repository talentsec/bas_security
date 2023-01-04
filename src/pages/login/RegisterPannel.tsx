import React from "react";
import { Button, Form, Input, message } from "antd";
import { GetCaptcha, Register } from "@/api/account";
import { useMutation, useQuery } from "react-query";
import { RequestStateEnum } from "@/type/api";

const BaseUrl = "http://10.10.10.242:8051/api";

interface RegisterPannelPropsType {
  jumpToLogin: () => void;
}

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
        refetch();
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

export default RegisterPannel;
