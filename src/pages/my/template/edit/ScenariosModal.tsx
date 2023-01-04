import React, { useState, useEffect } from "react";
import { Modal, Input, Table, Select } from "antd";
import { Icon } from "@iconify/react";
import SearchIcon from "@iconify/icons-icon-park-outline/search";
import { useQuery } from "react-query";
import type { ColumnsType } from "antd/es/table";
import { GetScenariosList } from "@/api/scenarios";

interface ScenariosConfigType {
  capTests: string[];
  compTechs: string[];
  name: string;
  scenarioID: number;
  version: string;
  id: number;
}

const columns: ColumnsType<ResponseType.GetScenariosListContent> = [
  {
    title: "场景名称",
    dataIndex: "name",
    key: "name",
    render: _ => <span className="text-blue-600">{_}</span>
  },
  {
    title: "兼容设备",
    dataIndex: "compTechs",
    key: "compTechs",
    render: _ => (_ ? _.join("、") : "--")
  },
  {
    title: "能力测试",
    dataIndex: "capTests",
    key: "capTests",
    render: _ => {
      return (
        <div>
          {_ && _.length > 4
            ? _.slice(0, 4).map((item: string, key: number) => {
                return (
                  <span key={key} className="p-2 ">
                    {item}
                  </span>
                );
              }) + <span className="p-2 bg-gray-100">+{_.length - 4}</span>
            : _
            ? _.map((item: string, key: number) => {
                return (
                  <span key={key} className="p-2 ">
                    {item}
                  </span>
                );
              })
            : "--"}
        </div>
      );
    }
  }
];

const StatusOption = [
  {
    label: "未发布",
    value: "UNPUBLISHED"
  },
  {
    label: "已发布",
    value: "PUBLISHED"
  }
];

interface VectorModalPropsType {
  open: boolean;
  handleOk: (arg: ScenariosConfigType[]) => void;
  handleCancel?: () => void;
  selected: ScenariosConfigType[];
}
function VectorModal({ open, handleOk, handleCancel, selected }: VectorModalPropsType) {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    selected?.length ? selected.map((_: ScenariosConfigType) => _.scenarioID) : []
  );
  const [selectedScenarios, setSelectedScenarios] = useState<ScenariosConfigType[]>(selected);

  useEffect(() => {
    setSelectedRowKeys(selected.map((_: ScenariosConfigType) => _.scenarioID));
    setSelectedScenarios(selected);
  }, [selected]);

  const { data: tableData } = useQuery(
    ["my-vector-list", keyword, limit, page, status],
    () => GetScenariosList({ limit, page, keyword, status: "PUBLISHED" }),
    {
      select: data => {
        const list: any[] =
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

  const onSelectChange = (target: ResponseType.GetScenariosListContent, state: boolean) => {
    if (state) {
      setSelectedRowKeys([...selectedRowKeys, target.id]);
      setSelectedScenarios([
        ...selectedScenarios,
        {
          capTests: target.capTests,
          compTechs: target.compTechs,
          name: target.name,
          scenarioID: target.id,
          version: target.version,
          id: target.id
        }
      ]);
    } else {
      const index = selectedRowKeys.findIndex(item => item === target.id);
      if (index >= 0) {
        selectedRowKeys.splice(index, 1);
        selectedScenarios.splice(index, 1);
        setSelectedRowKeys([...selectedRowKeys]);
        setSelectedScenarios([...selectedScenarios]);
      }
    }
    // setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleConfirm = () => {
    handleOk(selectedScenarios);
  };

  const rowSelection = {
    selectedRowKeys,
    onSelect: onSelectChange
  };

  return (
    <Modal
      title="场景选择"
      width={800}
      open={open}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <div className="py-4">
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="请输入场景名称"
            suffix={<Icon icon={SearchIcon} />}
            onPressEnter={handleKeywordChange}
          ></Input>
          {/* <Select
            style={{ width: 320 }}
            options={StatusOption}
            placeholder="所有状态"
            mode="multiple"
            onChange={handleStatusChange}
          /> */}
        </div>
        <div className="bg-gray-50 p-6 border-b">
          <span className="font-bold text-base mr-4">可选场景</span>
          <span className="text-gray-500">已选择({selectedScenarios.length})</span>
        </div>
        <Table
          columns={columns}
          rowSelection={rowSelection}
          rowKey="id"
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
    </Modal>
  );
}

export default React.memo(VectorModal);
