import React from "react";
import { Modal } from "antd";

interface DeleteModalPropsType {
  open: boolean;
  handleOk: () => void;
  handleCancel?: () => void;
}

function DeleteModal({ open, handleOk, handleCancel }: DeleteModalPropsType) {
  return (
    <Modal
      title="删除向量版本"
      open={open}
      onOk={() => handleOk()}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <div className="py-8">
        <div className="py-8">您确认删除该版本吗？</div>
      </div>
    </Modal>
  );
}

export default DeleteModal;
