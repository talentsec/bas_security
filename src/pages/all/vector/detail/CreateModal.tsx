import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Table, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { useQuery } from "react-query";
import type { ColumnsType } from "antd/es/table";
import { RowSelectionType } from "antd/es/table/interface";
import { GetVectorDetail } from "@/api/vector";
import { VectorPublishStateMap } from "@/const/vector";

interface DeleteModalPropsType {
  open: boolean;
  handleOk: (id?: number, version?: string) => void;
  handleCancel?: () => void;
}

const columns: ColumnsType<ResponseType.GetVectorDetailContent> = [
  {
    title: "版本号",
    dataIndex: "version",
    key: "version"
  },
  {
    title: "最后编辑时间",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: _ => <>{format(new Date(_), "yyyy-MM-dd HH:mm")}</>
  },
  {
    title: "发布状态",
    dataIndex: "status",
    render: (_: PublishStateType) => <span>{VectorPublishStateMap[_]}</span>
  }
];

function CreateModal({ open, handleOk, handleCancel }: DeleteModalPropsType) {
  const { id } = useParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const { data: tableData } = useQuery(
    ["my-vector-detail", limit, page],
    () =>
      GetVectorDetail(id as string, {
        limit,
        page
      }),
    {
      select: data => {
        const list: ResponseType.GetVectorDetailContent[] =
          data.data?.content.map((item, key) => {
            return {
              key,
              ...item
            };
          }) || [];
        return { list, total: data.data?.total || 0 };
      }
    }
  );

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: true,
    type: "radio" as RowSelectionType
  };

  const handleConfirm = () => {
    if (selectedRowKeys.length) {
      const vector = tableData?.list[selectedRowKeys[0] as number];
      if (vector) {
        handleOk(vector.id);
      }
    } else {
      message.warning("请选择版本号，或选择空白模版");
    }
  };

  return (
    <Modal
      title="创建新版本"
      open={open}
      width={600}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
      closable={false}
      maskClosable={false}
    >
      <section
        className="w-full p-10 flex flex-col justify-center items-center rounded-lg bg-gray-100 text-gray-500 border cursor-pointer  active:bg-gray-50 my-4"
        onClick={() => handleOk()}
      >
        <PlusOutlined className="text-xl" />
        <section className="">空白模版</section>
      </section>
      <Table
        columns={columns}
        dataSource={tableData?.list || []}
        rowSelection={rowSelection}
        pagination={{
          total: tableData?.total,
          pageSize: limit,
          size: "small",
          showLessItems: false,
          onChange: function (page, pageSize) {
            setPage(page);
            setLimit(pageSize);
          }
        }}
        size="small"
      />
    </Modal>
  );
}

export default React.memo(CreateModal);
