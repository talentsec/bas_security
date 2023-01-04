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
import { GetVectorDetail, DeleteVectorVersions, PublishVectorVersions } from "@/api/vector";
import { RequestStateEnum } from "@/type/api";
import { VectorPublishStateMap } from "@/const/vector";
import DeleteModal from "./DeleteModal";
import PublishModal from "./PublishModal";
import RevorkModal from "./RevorkModal";
import { useAppSelector } from "@/hooks/redux";
import DetailDrawer from "./DetailDrawer";

type EditType = "publish" | "edit" | "revork" | "delete";

interface EditMenuPropsMenu {
  edit: (arg: EditType) => void;
  state: PublishStateType;
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
  const [curVector, setCurVector] = useState<null | ResponseType.GetVectorDetailContent>(null);
  const [revorkModalVisible, setRevorkModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  const name = searchParams.get("name");
  const user = useAppSelector(state => state.account.user);

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
    ["my-vector-detail", filterStatus, limit, page],
    () =>
      GetVectorDetail(id as string, {
        limit,
        page,
        status: filterStatus
      }),
    {
      select: data => {
        const list: ResponseType.GetVectorDetailContent[] =
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

  const { mutate: deleteMutate } = useMutation(DeleteVectorVersions, {
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
  const { mutate: publishMutate } = useMutation((arg: string) => PublishVectorVersions(arg, "PUBLISH"), {
    onSuccess: data => {
      togglePublishModal();
      if (data.code === RequestStateEnum.SUCCESS) {
        message.success(`发布成功`);
        refetch();
      } else {
        console.log(`发布失败`);
      }
    }
  });
  const { mutate: revorkMutate } = useMutation((arg: string) => PublishVectorVersions(arg, "CANCEL"), {
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

  const handleEdit = (editType: EditType, vector: ResponseType.GetVectorDetailContent) => {
    setCurVector(vector);
    switch (editType) {
      case "publish":
        togglePublishModal();
        break;
      case "edit":
        Navigater(`/app/my/vector/edit?v=${vector.id}`);
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

  const openDetail = (item: ResponseType.GetVectorDetailContent) => {
    Navigater(`/app/my/vector/edit?v=${item.id}`);
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

  const toggleDetailDrawer = () => {
    setDetailDrawerOpen(!detailDrawerOpen);
  };

  const toggleModal = () => {
    // TODO
  };

  const handleBack = () => {
    Navigater("/app/my/vector");
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <Breadcrumb>
        <Breadcrumb.Item>所有</Breadcrumb.Item>
        <Breadcrumb.Item>攻击向量</Breadcrumb.Item>
        <Breadcrumb.Item>向量详情</Breadcrumb.Item>
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
        handleOk={() => deleteMutate(String(curVector?.id))}
        handleCancel={toggleDeleteModal}
      ></DeleteModal>
      <RevorkModal
        open={revorkModalVisible}
        handleOk={() => revorkMutate(String(curVector?.id))}
        handleCancel={toggleRevorkModal}
      ></RevorkModal>
      <PublishModal
        open={publishModalVisible}
        handleOk={() => publishMutate(String(curVector?.id))}
        handleCancel={togglePublishModal}
      ></PublishModal>
      {/* <DetailDrawer open={detailDrawerOpen} id={curVector?.id} onClose={toggleDetailDrawer}></DetailDrawer> */}
    </div>
  );
}

export default VectorDetail;