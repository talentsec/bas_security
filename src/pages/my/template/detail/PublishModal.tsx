import React from "react";
import { Modal } from "antd";

interface PublishModalPropsType {
  open: boolean;
  handleOk: () => void;
  handleCancel?: () => void;
}

function PublishModal({ open, handleOk, handleCancel }: PublishModalPropsType) {
  return (
    <Modal
      title="发布向量版本"
      open={open}
      onOk={() => handleOk()}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
      closable={false}
      maskClosable={false}
    >
      <div className="py-8">您确认发布该版本吗？</div>
    </Modal>
  );
}

export default React.memo(PublishModal);
