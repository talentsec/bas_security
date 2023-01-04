import React, { useState } from "react";
import { Modal, Input } from "antd";

interface RenameModalPropsType {
  open: boolean;
  handleOk: (arg: string) => void;
  handleCancel?: () => void;
  message?: string;
  title?: string;
}

function RenameModal({ open, handleOk, handleCancel, message, title }: RenameModalPropsType) {
  const [name, setName] = useState("");

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = arg => {
    setName(arg.target.value);
  };
  return (
    <Modal
      title={title || "重新命名"}
      open={open}
      onOk={() => handleOk(name)}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <div className="py-8">
        <Input placeholder={message || "请输入新名称"} onChange={handleInput}></Input>
      </div>
    </Modal>
  );
}

export default React.memo(RenameModal);
