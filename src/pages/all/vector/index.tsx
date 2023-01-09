import React, { useState } from "react";
import { Breadcrumb, Input, Table, Popover, message } from "antd";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SearchIcon from "@iconify/icons-icon-park-outline/search";
import { MoreOutlined, DeleteFilled, EyeFilled, EditFilled } from "@ant-design/icons";
import RenameModal from "@/components/RenameModal";
import DeleteModal from "@/components/DeleteModal";
import type { ColumnsType } from "antd/es/table";
import { GetVectorList, UpdateVector, DeleteVector } from "@/api/vector";
import { RequestStateEnum } from "@/type/api";
import { useAppSelector } from "@/hooks/redux";
import { format } from "date-fns";

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
  // const [user, setUser] = useState({});
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState<"PUBLISHED" | "UNPUBLISHED" | undefined>(undefined);
  const [curVector, setCurVector] = useState<null | ResponseType.GetVectorListContent>(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const Navigater = useNavigate();
  const user = useAppSelector(state => state.account.user);

  const columns: ColumnsType<ResponseType.GetVectorListContent> = [
    {
      title: "攻击向量名称",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "版本号",
      dataIndex: "version",
      key: "version"
    },
    {
      title: "创建人",
      dataIndex: "createdName",
      key: "createdName"
    },
    {
      title: "历史版本数",
      dataIndex: "pubNum",
      key: "pubNum"
    },
    {
      title: "向量引用次数",
      dataIndex: "usedNum",
      key: "usedNum"
    },
    {
      title: "最近发布时间",
      dataIndex: "pubTime",
      key: "pubTime",
      render: _ => <>{_ ? format(new Date(_), "yyyy-MM-dd HH:mm") : "--"}</>
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
            {user && user.id === record.createdBy ? (
              <Popover content={<EditMenu edit={edit} />} title="">
                <MoreOutlined />
              </Popover>
            ) : (
              <Popover
                content={
                  <div
                    className="flex w-full justify-between cursor-pointer rounded items-center p-2 hover:bg-gray-100"
                    onClick={() => Navigater(`/app/all/vector/${record.id}?name=${record.name}`)}
                  >
                    <EyeFilled className="mr-4" />
                    查看
                  </div>
                }
                title=""
              >
                <MoreOutlined />
              </Popover>
            )}
          </span>
        );
      }
    }
  ];

  const { data: tableData, refetch } = useQuery(
    ["my-vector-list", keyword, limit, page, filterStatus],
    () => GetVectorList({ limit, page, keyword, status: filterStatus }),
    {
      select: data => {
        return { list: data.data?.content || [], total: Number(data.data?.total) || 0 };
      }
    }
  );

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

  const { mutate: deleteMutate } = useMutation((arg: string) => DeleteVector(arg), {
    onSuccess: data => {
      toggleDeleteModal();
      if (data.code === RequestStateEnum.SUCCESS) {
        message.success(`删除成功`);
        refetch();
      } else {
        console.log(`删除失败`);
      }
    }
  });

  const handleEdit = (editType: EditType, vector: ResponseType.GetVectorListContent) => {
    switch (editType) {
      case "rename":
        toggleRenameModal();
        break;
      case "detail":
        Navigater(`/app/my/vector/${vector.id}?name=${vector.name}`);
        break;
      case "delete":
        toggleDeleteModal();
        break;
      default:
        break;
    }
    setCurVector(vector);
  };

  const handleRename = (name: string) => {
    renameMutate({ id: String(curVector?.id), data: { name } });
  };

  const handleDelete = () => {
    deleteMutate(String(curVector?.id));
  };

  const toggleRenameModal = () => {
    setRenameModalVisible(!renameModalVisible);
  };

  const toggleDeleteModal = () => {
    setDeleteModalVisible(!deleteModalVisible);
  };

  const handleKeywordChange: React.KeyboardEventHandler<HTMLInputElement> = (arg: any) => {
    setKeyword(arg.target?.value || "");
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <Breadcrumb>
        <Breadcrumb.Item>所有</Breadcrumb.Item>
        <Breadcrumb.Item>攻击向量</Breadcrumb.Item>
      </Breadcrumb>
      <section className="rounded-lg bg-white w-full flex-1 mt-4 p-6">
        <section className="flex-1 gray-back mb-4">
          <Input placeholder="搜索关键词" suffix={<Icon icon={SearchIcon} />} onPressEnter={handleKeywordChange} />
        </section>
        <Table
          columns={columns}
          dataSource={tableData?.list}
          rowKey="id"
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
          onChange={(pagination, filters) => {
            if (filters.status?.length === 1) {
              setFilterStatus(filters.status[0] as any);
            } else {
              setFilterStatus(undefined);
            }
          }}
        />
      </section>
      <RenameModal open={renameModalVisible} handleOk={handleRename} handleCancel={toggleRenameModal}></RenameModal>
      <DeleteModal
        open={deleteModalVisible}
        handleOk={handleDelete}
        handleCancel={toggleDeleteModal}
        message="您确定删除该向量吗？"
      ></DeleteModal>
    </div>
  );
};

export default Index;
