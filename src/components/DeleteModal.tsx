import React from "react";
import { Modal } from "antd";

interface RenameModalPropsType {
  open: boolean;
  handleOk: () => void;
  handleCancel?: () => void;
  message?: string;
  title?: string;
}

function DeleteModal({ open, handleOk, handleCancel, message, title }: RenameModalPropsType) {
  return (
    <Modal
      title={title || "确认信息"}
      open={open}
      onOk={() => handleOk()}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <div className="py-8">{message}</div>
    </Modal>
  );
}

export default React.memo(DeleteModal);
