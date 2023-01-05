import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Breadcrumb, Table, Popover, message, Button } from "antd";
import { format } from "date-fns";
import { useQuery, useMutation } from "react-query";
import {
  MoreOutlined,
  SnippetsFilled,
  DeleteFilled,
  CheckSquareFilled,
  EditFilled,
  LeftOutlined,
  EyeFilled
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetTemplateDetail, DeleteTemplateVersion, PublishTemplateVersion } from "@/api/taskTemplate";
import { RequestStateEnum } from "@/type/api";
import { VectorPublishStateMap } from "@/const/vector";
import DeleteModal from "./DeleteModal";
import PublishModal from "./PublishModal";
import RevorkModal from "./RevorkModal";
import CreateModal from "./CreateModal";
import { useAppSelector } from "@/hooks/redux";

type EditType = "publish" | "edit" | "revork" | "delete";

interface EditMenuPropsMenu {
  edit: (arg: EditType) => void;
  state: "DRAFT" | "IN_AUDIT" | "AUDIT_REJECT" | "PUBLISHED";
}
const EditMenu = ({ edit, state }: EditMenuPropsMenu) => {
  const fullEditList: any[] = [
    {
      label: "发布",
      value: "publish",
      icon: <CheckSquareFilled />
    },
    {
      label: "撤销",
      value: "revork",
      icon: <SnippetsFilled />
    },
    {
      label: "编辑",
      value: "edit",
      icon: <EditFilled />
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
  const StateEditMap: Record<PublishStateType, number[]> = {
    AUDIT_REJECT: [0, 2, 3],
    DRAFT: [0, 2, 3],
    PUBLISHED: [2, 3],
    IN_AUDIT: [1]
  };

  const editList = StateEditMap[state].map(_ => fullEditList[_]);
  return (
    <div className="w-20">
      {editList.map(item => {
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

const StateColorMap: Record<PublishStateType, string> = {
  AUDIT_REJECT: "text-red-700",
  DRAFT: "text-gray-600",
  PUBLISHED: "text-blue-700",
  IN_AUDIT: "text-gray-600"
};

function VectorDetail() {
  const { id } = useParams();
  const Navigater = useNavigate();
  const [searchParams] = useSearchParams();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<undefined | PublishStateType>(undefined);
  const [curTemplate, setCurTemplate] = useState<null | ResponseType.GetTemplateDetailContent>(null);
  const [revorkModalVisible, setRevorkModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const name = searchParams.get("name");
  const user = useAppSelector(state => state.account.user);

  const columns: ColumnsType<ResponseType.GetTemplateDetailContent> = [
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
    // {
    //   title: "发布检查",
    //   dataIndex: "status",
    //   render: (_: PublishStateType) => <span className={StateColorMap[_]}>{VectorPublishStateMap[_]}</span>
    // },
    {
      title: "发布状态",
      dataIndex: "status",
      filters: [
        {
          text: "未发布",
          value: "DRAFT"
        },
        {
          text: "审核中",
          value: "IN_AUDIT"
        },
        {
          text: "审核拒绝",
          value: "AUDIT_REJECT"
        },
        {
          text: "已发布",
          value: "PUBLISHED"
        }
      ],
      filterMultiple: false,
      render: (_: PublishStateType) => <span className={StateColorMap[_]}>{VectorPublishStateMap[_]}</span>
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
              <span className="cursor-pointer">
                <Popover content={<EditMenu edit={edit} state={record.status} />} title="">
                  <MoreOutlined />
                </Popover>
              </span>
            ) : (
              <Popover
                content={
                  <div
                    className="flex w-full justify-between cursor-pointer rounded items-center p-2 hover:bg-gray-100"
                    onClick={() => openDetail(record)}
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
    ["my-template-detail", filterStatus, limit, page],
    () =>
      GetTemplateDetail(Number(id), {
        limit,
        page,
        status: filterStatus
      }),
    {
      select: data => {
        const list: ResponseType.GetTemplateDetailContent[] =
          data.data?.content.map((item, index) => {
            return {
              key: index,
              ...item
            };
          }) || [];
        return { list, total: data.data?.total || 0 };
      }
    }
  );

  const { mutate: deleteMutate } = useMutation(DeleteTemplateVersion, {
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
  const { mutate: publishMutate } = useMutation((arg: string) => PublishTemplateVersion(Number(arg), "PUBLISH"), {
    onSuccess: data => {
      togglePublishModal();
      if (data.code === RequestStateEnum.SUCCESS) {
        message.success(`发布请求发送成功`);
        refetch();
      } else {
        console.log(`发布失败`);
      }
    }
  });
  const { mutate: revorkMutate } = useMutation((arg: string) => PublishTemplateVersion(Number(arg), "CANCEL"), {
    onSuccess: data => {
      toggleRevorkModal();
      if (data.code === RequestStateEnum.SUCCESS) {
        message.success(`撤销成功`);
        refetch();
      } else {
        console.log(`撤销失败`);
      }
    }
  });

  const handleEdit = (editType: EditType, template: ResponseType.GetTemplateDetailContent) => {
    setCurTemplate(template);
    switch (editType) {
      case "publish":
        togglePublishModal();
        break;
      case "edit":
        Navigater(`/app/my/template/edit?v=${template.id}`);
        console.log("detail");
        break;
      case "revork":
        toggleRevorkModal();
        break;
      case "delete":
        toggleDeleteModal();
        break;
      default:
    }
  };

  const openDetail = (item: ResponseType.GetTemplateDetailContent) => {
    Navigater(`/app/my/template/edit?v=${item.id}`);
  };

  const toggleDeleteModal = () => {
    setDeleteModalVisible(!deleteModalVisible);
  };
  const toggleRevorkModal = () => {
    setRevorkModalVisible(!revorkModalVisible);
  };
  const togglePublishModal = () => {
    setPublishModalVisible(!publishModalVisible);
  };
  const toggleCreateModal = () => {
    setCreateModalVisible(!createModalVisible);
  };

  const toggleModal = () => {
    // TODO
  };

  const handleVersionEdit = (versionId?: number) => {
    toggleCreateModal();
    Navigater(
      `/app/my/template/edit?${id ? "id=" + id : ""}${versionId || versionId === 0 ? "&v=" + versionId : ""}${
        "&name=" + name
      }`
    );
  };

  const handleBack = () => {
    Navigater("/app/my/template");
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <Breadcrumb>
        <Breadcrumb.Item>我的</Breadcrumb.Item>
        <Breadcrumb.Item>攻击模板</Breadcrumb.Item>
        <Breadcrumb.Item>模板详情</Breadcrumb.Item>
      </Breadcrumb>
      <section className="rounded-lg bg-white w-full flex-1 mt-4 p-6">
        <section className="text-lg font-semibold flex justify-between py-2 mb-4">
          <span>
            <span className="mr-4 hover:text-blue-500 cursor-pointer" onClick={handleBack}>
              <LeftOutlined />
            </span>
            {name}
            <span className="text-xs font-normal text-blue-600 ml-1">{`（共发布${tableData?.total}个版本）`}</span>
          </span>
          {/* <Button type="primary" onClick={toggleCreateModal}>
            创建新版本
          </Button> */}
        </section>
        <section onClick={toggleModal}></section>
        <Table
          columns={columns}
          dataSource={tableData?.list || []}
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
      <DeleteModal
        open={deleteModalVisible}
        handleOk={() => deleteMutate(Number(curTemplate?.id))}
        handleCancel={toggleDeleteModal}
      ></DeleteModal>
      <RevorkModal
        open={revorkModalVisible}
        handleOk={() => revorkMutate(String(curTemplate?.id))}
        handleCancel={toggleRevorkModal}
      ></RevorkModal>
      <PublishModal
        open={publishModalVisible}
        handleOk={() => publishMutate(String(curTemplate?.id))}
        handleCancel={togglePublishModal}
      ></PublishModal>
      <CreateModal
        open={createModalVisible}
        handleCancel={toggleCreateModal}
        handleOk={handleVersionEdit}
      ></CreateModal>
    </div>
  );
}

export default VectorDetail;
