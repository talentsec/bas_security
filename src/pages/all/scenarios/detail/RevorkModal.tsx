import React from "react";
import { Modal } from "antd";

interface RevorkModalPropsType {
  open: boolean;
  handleOk: () => void;
  handleCancel?: () => void;
}

function RevorkModal({ open, handleOk, handleCancel }: RevorkModalPropsType) {
  return (
    <Modal
      title="撤销向量版本"
      open={open}
      onOk={() => handleOk()}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
      closable={false}
      maskClosable={false}
    >
      <div className="py-8">您确定撤销该版本吗？</div>
    </Modal>
  );
}

export default React.memo(RevorkModal);
