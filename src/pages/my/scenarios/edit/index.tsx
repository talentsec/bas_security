import React, { useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import VectorModal from "./VectorModal";

function EditScenarios() {
  const [modalVisible, setModalVisible] = useState(true);
  return (
    <div className="flex flex-col h-full bg-gray-100">
      <section className="bg-white border-t p-5 text-lg font-semibold ">
        <LeftOutlined className="mr-4 text-gray-500 hover:text-blue-500 hover:scale-105 cursor-pointer" />
        <span>未命名场景</span>
      </section>
      <section className="p-4 flex-1 overflow-auto">
        <section className="bg-white p-8 rounded-lg">
          <Button>ss</Button>
          <div>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
            <h1>jj</h1>
          </div>
        </section>
      </section>
      <VectorModal open={modalVisible}></VectorModal>
    </div>
  );
}

export default EditScenarios;
