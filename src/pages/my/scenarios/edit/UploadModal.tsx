import React, { useState } from "react";
import { Modal } from "antd";
import UploadFile from "@/components/UploadFile";

interface UploadModalProps {
  open: boolean;
  onConfirm: (url: string) => void;
  onCancel: () => void;
  disabled?: boolean;
  value?: string;
}
function UploadModal({ open, onConfirm, onCancel, disabled, value }: UploadModalProps) {
  const [url, setUrl] = useState("");
  const handleChange = (url: any) => {
    setUrl(url);
  };
  return (
    <Modal
      title="连接器配置"
      open={open}
      onOk={() => onConfirm(url)}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <div className="">
        <UploadFile disabled={disabled} value={value} onChange={handleChange}></UploadFile>
      </div>
    </Modal>
  );
}

export default UploadModal;
