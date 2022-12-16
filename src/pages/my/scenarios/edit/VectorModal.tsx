import React, { useState } from "react";
import { Modal, Input, Table } from "antd";
import { useQuery } from "react-query";
import type { ColumnsType } from "antd/es/table";
import { GetVectorList } from "@/api/vector";

interface VectorModalPropsType {
  open: boolean;
  handleOk: (arg: string) => void;
  handleCancel?: () => void;
}

const columns: ColumnsType<ResponseType.GetVectorList> = [
  {
    title: "向量名称",
    dataIndex: "name",
    key: "name",
    render: _ => <span className="text-blue-600">{_}</span>
  },
  {
    title: "版本号",
    dataIndex: "version",
    key: "version"
  },
  {
    title: "执行方式",
    dataIndex: "version",
    key: "version",
    render: _ => <span className="text-blue-600">{_}</span>
  },
  {
    title: "发布状态",
    dataIndex: "pubNum",
    key: "status",
    filterMultiple: true,
    render: _ => {
      return (
        <>
          {_ > 0 ? (
            <span>
              已发布<span className="ml-2 text-blue-700">({_})</span>
            </span>
          ) : (
            <span>未发布</span>
          )}
        </>
      );
    }
  },
  {
    title: "版本数量",
    dataIndex: "versionNum",
    key: "versionNum"
  }
];

function VectorModal({ open, handleOk, handleCancel }: VectorModalPropsType) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const { data: tableData } = useQuery(
    ["my-vector-list", keyword, limit, page],
    () => GetVectorList({ limit, page, keyword }),
    {
      select: data => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const list: TableDateType[] =
          data.data?.content.map((item, index) => {
            return {
              key: index,
              ...item
            };
          }) || [];
        return { list, total: Number(data.data?.total) || 0 };
      }
    }
  );

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = arg => {
    setName(arg.target.value);
  };
  return (
    <Modal
      title="向量选择"
      width={800}
      open={open}
      onOk={() => handleOk(name)}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <div className="py-8">
        <Input placeholder="请输入场景新名称" onChange={handleInput}></Input>
        <Table
          columns={columns}
          size="small"
          dataSource={tableData?.list}
          pagination={{
            total: tableData?.total,
            pageSize: limit,
            showTotal: total => `共计 ${total} 条`,
            showSizeChanger: false,
            onChange: function (page, pageSize) {
              setPage(page);
              setLimit(pageSize);
            }
          }}
        ></Table>
      </div>
    </Modal>
  );
}

export default React.memo(VectorModal);
