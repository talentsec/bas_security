import React from "react";
import { Button, Form, Input } from "antd";
import { useMutation } from "react-query";
import { Login as LoginApi } from "@/api/account";
import { RequestStateEnum } from "@/type/api";

interface LoginPannelPropsType {
  jumpToRegister: () => void;
  success: (arg: string) => void;
}

interface Form {
  name: string;
  password: string;
}

const LoginPannel = ({ jumpToRegister, success }: LoginPannelPropsType) => {
  const { mutate } = useMutation(LoginApi, {
    onSuccess: data => {
      if (data.code === RequestStateEnum.SUCCESS) {
        success(data.data?.access_token || "");
      } else {
        // Noop
      }
    },
    onError: error => {
      console.log(error);
    }
  });

  const onFinish = (values: Form) => {
    mutate({
      ...values,
      app: "bas_security"
    });
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
            name="name"
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

export default LoginPannel;
