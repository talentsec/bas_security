import React, { useState } from "react";
import { Breadcrumb, Input, Table, Popover, message } from "antd";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SearchIcon from "@iconify/icons-icon-park-outline/search";
import { PlusOutlined, ProfileFilled, MoreOutlined, DeleteFilled, EyeFilled, EditFilled } from "@ant-design/icons";
import RenameModal from "@/components/RenameModal";
import DeleteModal from "@/components/DeleteModal";
import type { ColumnsType } from "antd/es/table";
import { GetTemplateList, UpdateTemplate, DeleteTemplate } from "@/api/taskTemplate";
import { RequestStateEnum } from "@/type/api";
import { useAppSelector } from "@/hooks/redux";
import { format } from "date-fns";

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
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState<"PUBLISHED" | "UNPUBLISHED" | undefined>(undefined);
  const [curTemplate, setCurTemplate] = useState<null | ResponseType.GetTemplateListContent>(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const Navigater = useNavigate();
  const user = useAppSelector(state => state.account.user);

  const columns: ColumnsType<ResponseType.GetTemplateListContent> = [
    {
      title: "模板名称",
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
      title: "攻击场景",
      dataIndex: "scenarioNum",
      key: "scenarioNum"
    },
    {
      title: "版本数量",
      dataIndex: "pubNum",
      key: "pubNum"
    },
    {
      title: "模板引用次数",
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
                    onClick={() => Navigater(`/app/all/template/${record.id}?name=${record.name}`)}
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
    () => GetTemplateList({ limit, page, keyword, status: filterStatus }),
    {
      select: data => {
        return { list: data.data?.content || [], total: Number(data.data?.total) || 0 };
      }
    }
  );

  const { mutate: renameMutate } = useMutation((arg: any) => UpdateTemplate(arg.id, arg.data), {
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

  const { mutate: deleteMutate } = useMutation((arg: number) => DeleteTemplate(arg), {
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

  const handleEdit = (editType: EditType, template: ResponseType.GetTemplateListContent) => {
    switch (editType) {
      case "rename":
        toggleRenameModal();
        break;
      case "detail":
        Navigater(`/app/my/template/${template.id}?name=${template.name}`);
        break;
      case "delete":
        toggleDeleteModal();
        break;
      default:
        break;
    }
    setCurTemplate(template);
  };

  const handleRename = (name: string) => {
    renameMutate({ id: String(curTemplate?.id), data: { name } });
  };

  const handleDelete = () => {
    deleteMutate(curTemplate!.id);
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
        <Breadcrumb.Item>我的</Breadcrumb.Item>
        <Breadcrumb.Item>任务模板</Breadcrumb.Item>
      </Breadcrumb>
      <section className="rounded-lg bg-white w-full flex-1 mt-4 p-6">
        <section className="flex-1 gray-back mb-4">
          <Input placeholder="搜索关键词" suffix={<Icon icon={SearchIcon} />} onPressEnter={handleKeywordChange} />
        </section>
        <Table
          columns={columns}
          rowKey="id"
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
        message="您确定删除该模板吗？"
      ></DeleteModal>
    </div>
  );
};

export default Index;
