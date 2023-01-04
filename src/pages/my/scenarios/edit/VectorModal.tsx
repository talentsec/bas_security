import React, { useState, useEffect } from "react";
import { Modal, Input, Table, Select } from "antd";
import { Icon } from "@iconify/react";
import SearchIcon from "@iconify/icons-icon-park-outline/search";
import { useQuery } from "react-query";
import type { ColumnsType } from "antd/es/table";
import { GetVectorList } from "@/api/vector";
import { ExecModeMap, RoleTypeMap } from "@/const/vector";

const columns: ColumnsType<ResponseType.GetVectorListContent> = [
  {
    title: "向量名称",
    dataIndex: "name",
    key: "name",
    render: _ => <span className="text-blue-600">{_}</span>
  },
  {
    title: "版本号",
    dataIndex: "version",
    key: "version",
    render: _ => _ || "--"
  },
  {
    title: "执行方式",
    dataIndex: "version",
    key: "version",
    render: (_: "REMOTE" | "LOCAL") => <span>{ExecModeMap[_] || "--"}</span>
  },
  {
    title: "权限要求",
    dataIndex: "roleType",
    key: "roleType",
    render: (_: "ADMIN" | "NORMAL") => <span>{RoleTypeMap[_] || "--"}</span>
  },
  {
    title: "操作系统",
    dataIndex: "platforms",
    key: "platforms",
    render: (_: string[]) => <span>{_.join("、")}</span>
  }
];

const ExecModeOption = [
  {
    label: "本地执行",
    value: "LOCAL"
  },
  {
    label: "远程执行",
    value: "REMOTE"
  }
];

interface VectorConfigType {
  connectorConfig?: {
    contents: any;
  };
  execMode: string;
  name: string;
  platforms: string[];
  roleType: string;
  vectorID: number;
  version: string;
}
interface VectorModalPropsType {
  open: boolean;
  handleOk: (arg: VectorConfigType[]) => void;
  handleCancel?: () => void;
  selected: VectorConfigType[];
}
function VectorModal({ open, handleOk, handleCancel, selected }: VectorModalPropsType) {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [execMode, setExecMode] = useState<"REMOTE" | "LOCAL" | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    selected ? selected.map((_: VectorConfigType) => _.vectorID) : []
  );
  const [selectedVectors, setSelectedVectors] = useState<VectorConfigType[]>([]);

  useEffect(() => {
    setSelectedRowKeys(selected.map((_: VectorConfigType) => _.vectorID));
    setSelectedVectors(selected);
  }, [selected]);

  const { data: tableData } = useQuery(
    ["my-vector-list", keyword, limit, page, execMode],
    () => GetVectorList({ limit, page, keyword, execMode, status: "PUBLISHED" }),
    {
      select: data => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const list: TableDateType[] =
          data.data?.content.map(item => {
            return {
              key: item.id,
              ...item
            };
          }) || [];
        return { list, total: Number(data.data?.total) || 0 };
      }
    }
  );

  const handleKeywordChange: React.KeyboardEventHandler<HTMLInputElement> = (arg: any) => {
    setKeyword(arg.target?.value || "");
  };
  const handleExecModeChange = (selected: ("REMOTE" | "LOCAL")[]) => {
    if (selected.length === 1) {
      setExecMode(selected[0]);
    } else {
      setExecMode(undefined);
    }
  };

  const onSelectChange = (target: ResponseType.GetVectorListContent, state: boolean) => {
    if (state) {
      setSelectedRowKeys([...selectedRowKeys, target.id]);
      setSelectedVectors([
        ...selectedVectors,
        {
          execMode: target.execMode,
          name: target.name,
          platforms: target.platforms,
          roleType: target.roleType,
          vectorID: target.id,
          version: target.version
        }
      ]);
    } else {
      const index = selectedRowKeys.findIndex(item => item === target.id);
      if (index >= 0) {
        selectedRowKeys.splice(index, 1);
        selectedVectors.splice(index, 1);
        setSelectedRowKeys([...selectedRowKeys]);
        setSelectedVectors([...selectedVectors]);
      }
    }
    // setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onSelect: onSelectChange
  };
  const handleConfirm = () => {
    handleOk(selectedVectors);
  };

  return (
    <Modal
      title="向量选择"
      width={800}
      open={open}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      {open ? (
        <div className="py-4">
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="请输入向量名称"
              suffix={<Icon icon={SearchIcon} />}
              onPressEnter={handleKeywordChange}
            ></Input>
            <Select
              style={{ width: 320 }}
              options={ExecModeOption}
              placeholder="执行方式"
              mode="multiple"
              onChange={handleExecModeChange}
            />
          </div>
          <div className="bg-gray-50 p-6 border-b">
            <span className="font-bold text-base mr-4">可选向量</span>
            <span className="text-gray-500">已选择({selectedVectors.length})</span>
          </div>
          <Table
            columns={columns}
            rowSelection={rowSelection}
            size="small"
            dataSource={tableData?.list}
            pagination={{
              total: tableData?.total,
              pageSize: limit,
              showSizeChanger: false,
              onChange: function (page, pageSize) {
                setPage(page);
                setLimit(pageSize);
              }
            }}
          ></Table>
        </div>
      ) : null}
    </Modal>
  );
}

export default React.memo(VectorModal);
