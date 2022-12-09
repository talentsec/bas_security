import React, { useState } from "react";
import { Modal, Input } from "antd";

interface RenameModalPropsType {
  open: boolean;
  handleOk: (arg: string) => void;
  handleCancel?: () => void;
}

function RenameModal({ open, handleOk, handleCancel }: RenameModalPropsType) {
  const [name, setName] = useState("");

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = arg => {
    setName(arg.target.value);
  };
  return (
    <Modal
      title="修改攻击向量名称"
      open={open}
      onOk={() => handleOk(name)}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <div className="py-8">
        <Input placeholder="请输入攻击向量新名称" onChange={handleInput}></Input>
      </div>
    </Modal>
  );
}

export default React.memo(RenameModal);
