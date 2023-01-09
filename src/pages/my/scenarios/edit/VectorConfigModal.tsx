import React, { useState } from "react";
import { Modal, Form, Spin, Select, message } from "antd";
import UploadFile from "@/components/UploadFile";
import { GetVectorVersionDetail } from "@/api/vector";
import { useQuery } from "react-query";

const options = [
  {
    label: "用户输入",
    value: "USER_INPUT"
  },
  {
    label: "连接器输入",
    value: "AUTO_INPUT"
  }
];

interface Props {
  open: boolean;
  onConfirm: (data: any) => void;
  onCancel: () => void;
  disabled?: boolean;
  id?: string;
  title?: string;
  originData?: any;
}
function VectorConfigModal({ open, onConfirm, onCancel, disabled, id, title, originData }: Props) {
  const [form] = Form.useForm();
  const { data, isLoading } = useQuery(["vector-version-detail", id], () => GetVectorVersionDetail(String(id)), {
    select: data => {
      return data.data;
    },
    enabled: !!id
    // onSuccess: data => {
    //   setIsLoading(false);
    //   if (data) {
    //     setFormData(data);
    //   } else {
    //     // Noop
    //   }
    // },
    // onError: () => {
    //   setIsLoading(false);
    // }
  });

  const onFinish = (values: any) => {
    console.log("Success:", values);
    onConfirm(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleOk = () => {
    form.submit();
  };

  return (
    <Modal
      title={title || ""}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <div className="overflow-auto" style={{ maxHeight: "500px" }}>
        {isLoading ? (
          <Spin></Spin>
        ) : (
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={originData?.inputConfig}
            key={originData?.id}
          >
            {(data?.inputConfig.content || []).map((item, key) => {
              return (
                <Form.Item
                  key={key}
                  rules={[{ required: true, message: "不可为空" }]}
                  name={item.config.name}
                  label={item.config.name}
                >
                  <Select options={options}></Select>
                </Form.Item>
              );
            })}
          </Form>
        )}
      </div>
    </Modal>
  );
}

export default VectorConfigModal;
