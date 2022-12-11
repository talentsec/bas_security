import React, { useState } from "react";
import { Breadcrumb, Input, Table, Popover, message } from "antd";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SearchIcon from "@iconify/icons-icon-park-outline/search";
import { PlusOutlined, ProfileFilled, MoreOutlined, DeleteFilled, EyeFilled, EditFilled } from "@ant-design/icons";
import RenameModal from "./RenameModal";
import type { ColumnsType } from "antd/es/table";
import { GetMyVectorList, UpdateVector, GetVectorList } from "@/api/vector";
import { RequestStateEnum } from "@/type/api";

interface TableDateType {
  id: number;
  name: string;
  pubNum: number;
  versionNum: number;
  key: number;
}
type EditType = "rename" | "detail" | "delete";

const EditMenu = ({ edit }: { edit: (type: EditType) => void }) => {
  const EditList: any[] = [
    {
      label: "重命名",
      value: "rename",
      icon: <EditFilled />
    },
    {
      label: "查看",
      value: "detail",
      icon: <EyeFilled />
    },
    {
      label: <span className="text-red-500">删除</span>,
      value: "delete",
      icon: (
        <span className="text-red-500">
          <DeleteFilled />
        </span>
      )
    }
  ];
  return (
    <div className="w-20">
      {EditList.map(item => {
        return (
          <section
            key={item.value}
            onClick={() => edit(item.value)}
            className="flex w-full justify-between cursor-pointer rounded items-center p-2 hover:bg-gray-100"
          >
            {item.icon}
            {item.label}
          </section>
        );
      })}
    </div>
  );
};

const Index = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [curVector, setCurVector] = useState<null | TableDateType>(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const Navigater = useNavigate();

  const columns: ColumnsType<TableDateType> = [
    {
      title: "攻击向量名称",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "发布状态",
      dataIndex: "pubNum",
      key: "pubNum",
      render: _ => (
        <>
          {_ > 0 ? (
            <span>
              已发布<span className="ml-2 text-blue-700">({_})</span>
            </span>
          ) : (
            <span></span>
          )}
        </>
      )
    },
    {
      title: "版本数量",
      dataIndex: "versionNum",
      key: "versionNum"
    },
    {
      title: "操作",
      key: "edit",
      dataIndex: "edit",
      render: (_, record) => {
        const edit = (editType: EditType) => {
          handleEdit(editType, record);
        };
        return (
          <span className="cursor-pointer">
            <Popover content={<EditMenu edit={edit} />} title="">
              <MoreOutlined />
            </Popover>
          </span>
        );
      }
    }
  ];

  const { data: tableData, refetch } = useQuery(["my-vector-list"], () => GetVectorList({ limit, page }), {
    select: data => {
      const list: TableDateType[] =
        data.data?.content.map((item, index) => {
          return {
            key: index,
            ...item
          };
        }) || [];
      return { list, total: data.data?.total || 0 };
    }
  });

  const { mutate: renameMutate } = useMutation((arg: any) => UpdateVector(arg.id, arg.data), {
    onSuccess: data => {
      toggleRenameModal();
      if (data.code === RequestStateEnum.SUCCESS) {
        message.success(`修改成功`);
        refetch();
      } else {
        console.log(`修改失败`);
      }
    }
  });

  const handleEdit = (editType: EditType, vector: TableDateType) => {
    switch (editType) {
      case "rename":
        toggleRenameModal();
        break;
      case "detail":
        Navigater(`/app/my/vector/${vector.id}?name=${vector.name}`);
        break;
      case "delete":
        console.log("delete");
        break;
      default:
        break;
    }
    setCurVector(vector);
  };

  const handleRename = (name: string) => {
    renameMutate({ id: String(curVector?.id), name: { name } });
  };

  const toggleRenameModal = () => {
    setRenameModalVisible(!renameModalVisible);
  };

  const toggleModal = () => {
    // TODO
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Breadcrumb>
        <Breadcrumb.Item>我的</Breadcrumb.Item>
        <Breadcrumb.Item>攻击向量</Breadcrumb.Item>
      </Breadcrumb>
      <section className="rounded-lg bg-white w-full flex-1 mt-4 p-6">
        <section className="flex-1 gray-back">
          <Input placeholder="搜索关键词" suffix={<Icon icon={SearchIcon} />} />
        </section>
        <section
          className="flex items-center bg-gray-50 w-52 text-sm px-5 py-4 my-4 rounded-md hover:scale-105 cursor-pointer"
          onClick={toggleModal}
        >
          <ProfileFilled className="text-orange-500 " />
          <span className="mr-10 ml-2">创建攻击向量</span>
          <PlusOutlined />
        </section>
        <Table
          columns={columns}
          dataSource={tableData?.list}
          pagination={{
            total: tableData?.list.length
          }}
        />
      </section>
      <RenameModal open={renameModalVisible} handleOk={handleRename} handleCancel={toggleRenameModal}></RenameModal>
    </div>
  );
};

export default Index;
