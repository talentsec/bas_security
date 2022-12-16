import React from "react";
import { Modal } from "antd";

interface RenameModalPropsType {
  open: boolean;
  handleOk: () => void;
  handleCancel?: () => void;
}

function DeleteModal({ open, handleOk, handleCancel }: RenameModalPropsType) {
  return (
    <Modal
      title="确认信息"
      open={open}
      onOk={() => handleOk()}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <div className="py-8">确认删除此场景吗？</div>
    </Modal>
  );
}

export default React.memo(DeleteModal);