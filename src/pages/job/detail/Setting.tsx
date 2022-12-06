import React, { useState } from "react";
import { MoreOutlined, EditFilled } from "@ant-design/icons";
import { Input, Table } from "antd";

const data = {
  templateName: "模版名称xxx",
  name: "",
  desc: "此验证动作还原了AI攻防机器人使用称为文件Windows NT 文件系统功能和一个保留的文件名来隐藏可执行文件。与使用备用数据流(ADS)的其他验证验证动作不…"
};

const OverviewData = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号"
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号"
  }
];

const OverviewColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address"
  }
];

export default function Setting() {
  const [editName, setEditName] = useState(false);
  const [formData, setFormData] = useState(data);

  const toggleNameEdit = () => {
    setEditName(!editName);
  };

  const handleChangeName = (e: any) => {
    setFormData({
      ...formData,
      name: e.target.value
    });
    toggleNameEdit();
  };
  return (
    <div className="p-4 w-full h-full">
      <section className="flex justify-between w-full mb-4">
        <span className="text-xs text-gray-400">{formData.templateName}</span>
        <MoreOutlined className="cursor-pointer hover:text-blue-700" />
      </section>
      <section className="">
        <div className="flex items-center gap-4">
          <img src="" alt="" className="w-16 h-16" />
          {editName ? (
            <Input
              placeholder="Basic usage"
              defaultValue={formData.name}
              onBlur={handleChangeName}
              onPressEnter={handleChangeName}
            />
          ) : (
            <div>
              <span className="mr-4">{formData.name || "任务名称"}</span>
              <span className="cursor-pointer hover:text-blue-500" onClick={toggleNameEdit}>
                <EditFilled />
              </span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-400 leading-5 mt-4">模版描述：{data.desc}</div>
      </section>
      <section>
        <Table dataSource={OverviewData} columns={OverviewColumns} />
      </section>
    </div>
  );
}
