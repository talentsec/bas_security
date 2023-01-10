import React, { useState, useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Spin } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import VectorModal from "./VectorModal";
import {
  GetScenarioVersionDetail,
  CreateScenariosVersion,
  CreateScenario,
  UpdateScenarioVersion
} from "@/api/scenarios";
import { useAppSelector } from "@/hooks/redux";
import { EditModeType, EditModeEnum } from "@/type/common";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { RequestStateEnum } from "@/type/api";
import { cloneDeep } from "lodash-es";
import VectorFlow, { CustomNodeData, FlowData } from "@/components/vectorflow";
import UploadModal from "./UploadModal";
import VectorConfigModal from "./VectorConfigModal";

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

const InitTempForm = {
  capTests: "",
  compTechs: "",
  contents: [],
  name: "",
  remark: "",
  vectorGraph: {
    contents: {}
  },
  version: ""
};

function EditScenarios() {
  const [searchParams] = useSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadModalVisible, setUploaModalVisible] = useState(false);
  const [seletedVector, setSelectedVector] = useState<VectorConfigType[]>([]);
  const [editMode, setEditMode] = useState<EditModeType>(EditModeEnum.CREATE);
  const [readonly, setReadonly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<FlowData | undefined>(undefined);
  const [CustomNodeList, setCustomNodeList] = useState<any[]>([]);
  const [curNode, setCurNode] = useState<CustomNodeData | null>(null);
  const [flow, setFlow] = useState<FlowData | undefined>(undefined);
  const [vectorModalDisplay, setVectorModalDisplay] = useState(false);

  const [form] = Form.useForm();
  const id = searchParams.get("id");
  const versionID = searchParams.get("v");
  const name = searchParams.get("name");
  const user = useAppSelector(state => state.account.user);

  const [formData, setFormData] = useState<any>({ ...InitTempForm, name });

  useEffect(() => {
    if (user && formData && versionID) {
      setReadonly(user.id !== (formData as ResponseType.GetVectorVersionDetailContent).createdBy);
    }
  }, [formData, user]);

  useEffect(() => {
    setCustomNodeList(seletedVector.map(item => ({ id: String(item.vectorID), label: item.name, type: "vector" })));
  }, [seletedVector]);

  useEffect(() => {
    if (id && versionID) {
      setEditMode(EditModeEnum.CREATE_VERSION_BASE_EXIST);
    } else if (versionID && !id) {
      setEditMode(EditModeEnum.EDIT_VERSION);
    } else if (id) {
      setEditMode(EditModeEnum.CREATE_VERSION);
      setIsLoading(false);
    } else {
      setEditMode(EditModeEnum.CREATE);
      setFormData(InitTempForm);
      setIsLoading(false);
    }
  }, []);

  useQuery(["scenario-version-detail"], () => GetScenarioVersionDetail(Number(versionID)), {
    enabled: !!versionID,
    onSuccess(data) {
      setSelectedVector(data.data?.contents || []);
      setFormData(data.data);
      setInitialValues(data.data?.vectorGraph as any);
      setIsLoading(false);
    }
  });

  const { mutate: CreateScenarioMutate } = useMutation(CreateScenario, {
    onSuccess: data => {
      if (data.code === RequestStateEnum.SUCCESS) {
        message.success("创建成功");
      } else {
        console.log("创建失败");
      }
    }
  });

  const { mutate: UpdateScenarioVersionsMutation } = useMutation(
    (val: { id: number; data: RequestType.UpdateScenarioVersion }) => UpdateScenarioVersion(val.id, val.data),
    {
      onSuccess: data => {
        if (data.code === RequestStateEnum.SUCCESS) {
          message.success("修改成功");
        } else {
          console.log("修改失败");
        }
      }
    }
  );

  const { mutate: CreateScenarioVersionMutation } = useMutation(CreateScenariosVersion, {
    onSuccess: data => {
      if (data.code === RequestStateEnum.SUCCESS) {
        message.success("创建成功");
      } else {
        console.log("创建失败");
      }
    }
  });

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const transContentData = () => {
    const resList: any[] = [];
    const sourceList = flow!.nodes
      .filter(item => item.type === "vector")
      .map(item => {
        return {
          vectorID: Number(item.data.vectorId),
          items: [
            {
              connectorConfig: {
                url: (item as any).data.connectorId
              },
              inputConfig: { content: item.data?.inputConfig || null },
              tag: String(item.data.tag)
            }
          ]
        };
      });

    sourceList.forEach(item => {
      const targetIndex = resList.findIndex(res => res.vectorID === item.vectorID);
      if (targetIndex >= 0) {
        sourceList[targetIndex].items.push(item.items[0]);
      } else {
        resList.push(item);
      }
    });

    return resList;
  };

  const onFinish = (values: any) => {
    // Todo
    if (!flow) {
      message.error("请配置向量执行逻辑及连接器");
      return;
    }
    if (!seletedVector.length) {
      message.error("向量选择不能为空");
    }
    const confirmData: any = cloneDeep(values);
    confirmData.compTechs = Array.isArray(values.compTechs) ? values.compTechs : values.compTechs.split(",");
    confirmData.capTests = Array.isArray(values.capTests) ? values.capTests : values.capTests.split(",");
    confirmData.vectorGraph = flow;

    confirmData.contents = transContentData();

    switch (editMode) {
      case EditModeEnum.CREATE:
        CreateScenarioMutate(confirmData);
        break;
      case EditModeEnum.CREATE_VERSION:
        delete confirmData.name;
        CreateScenarioVersionMutation(confirmData);
        break;
      case EditModeEnum.CREATE_VERSION_BASE_EXIST:
        delete confirmData.name;
        CreateScenarioVersionMutation(confirmData);
        break;
      case EditModeEnum.EDIT_VERSION:
        delete confirmData.name;
        delete confirmData.version;
        UpdateScenarioVersionsMutation({ id: Number(versionID), data: confirmData });
        break;
      default:
        break;
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleVectorSelected = (list: VectorConfigType[]) => {
    setSelectedVector(list);
    toggleModal();
  };

  const handleVectorDelete = (id: number) => {
    const newList = seletedVector.filter(item => item.vectorID !== id);
    setSelectedVector(newList);
  };

  const toggleUploadModal = () => {
    setUploaModalVisible(!uploadModalVisible);
  };

  const handleConnectorChange = (url: string) => {
    if (flow && curNode) {
      flow.nodes.forEach(e => {
        if (e.id === String(curNode.id)) {
          e.data = {
            ...e.data,
            connectorId: url
          };
        }
      });
      setInitialValues({ ...flow });
    }
    toggleUploadModal();
  };

  const handleConnectorConfig = (currentNode: CustomNodeData, edges: any[], flowData: FlowData) => {
    setCurNode(currentNode);
    setFlow(flowData);
    toggleUploadModal();
    console.log(currentNode, flowData);
  };

  const handleNodeClick = (currentNode: CustomNodeData) => {
    setCurNode(currentNode);
    toggleVectorModal();
  };

  const toggleVectorModal = () => {
    setVectorModalDisplay(!vectorModalDisplay);
  };

  const handleVectorConfig = (val: any) => {
    if (flow && curNode) {
      flow.nodes.forEach(e => {
        if (e.id === String(curNode.id)) {
          e.data = {
            ...e.data,
            inputConfig: val
          };
        }
      });
      setInitialValues({ ...flow });
    }
    toggleVectorModal();
  };

  const confirm = () => {
    form.submit();
  };

  useEffect(() => {
    setFlow(initialValues);
  }, [initialValues]);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <section className="bg-white border-t p-5 text-lg font-semibold ">
        <LeftOutlined
          className="mr-4 text-gray-500 hover:text-blue-500 hover:scale-105 cursor-pointer"
          onClick={() => history.back()}
        />
        <span>{name || formData.name || "未命名场景"}</span>
      </section>
      <section className="p-4 flex-1 overflow-auto">
        <section className="bg-white p-8 rounded-lg">
          {isLoading ? (
            <Spin className="w-full h-full flex-1"></Spin>
          ) : (
            <div>
              <Form
                name="basic"
                initialValues={formData}
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                disabled={readonly}
                layout="vertical"
              >
                <div className="flex gap-6">
                  <Form.Item
                    label="攻击场景名称"
                    name="name"
                    className="flex-1"
                    rules={[{ required: true, message: "请输入攻击场景名称" }]}
                  >
                    <Input disabled={editMode !== EditModeEnum.CREATE} />
                  </Form.Item>
                  <Form.Item
                    label="版本"
                    name="version"
                    className="flex-1"
                    rules={[{ required: true, message: "请输入版本" }]}
                  >
                    <Input disabled={editMode === EditModeEnum.EDIT_VERSION} />
                  </Form.Item>
                  <Form.Item
                    label="选择攻击向量"
                    className="flex-1"
                    rules={[{ required: true, message: "请选择攻击向量" }]}
                  >
                    <Button onClick={toggleModal} className="bg-gray-100">
                      选择攻击向量
                    </Button>
                  </Form.Item>
                </div>
                <div className="flex w-full gap-6">
                  <Form.Item
                    label="可兼容技术"
                    name="compTechs"
                    className="flex-1"
                    rules={[{ required: true, message: "请输入可兼容技术" }]}
                  >
                    <Input className="w-full" placeholder="请输入可兼容技术，使用英文,分割" />
                  </Form.Item>
                  <Form.Item
                    label="能力测试"
                    name="capTests"
                    className="flex-1 w-full"
                    rules={[{ required: true, message: "请输入能力测试" }]}
                  >
                    <Input className="w-full" placeholder="请输入能力测试，使用英文,分割" />
                  </Form.Item>
                </div>

                <Form.Item label="描述" name="remark" rules={[{ required: true, message: "请输入描述信息" }]}>
                  <Input />
                </Form.Item>
              </Form>
              <div className="p-4 bg-gray-50 rounded">
                {seletedVector.length
                  ? seletedVector.map((item, key) => {
                      return (
                        <section key={key} className="py-3 px-6 rounded hover:bg-gray-200 cursor-pointer">
                          <span className="inline-block w-32">{item.name}</span>
                          <span className="inline-block w-32">{item.version}</span>
                          <span className="inline-block w-32">{item.platforms.join("、")}</span>
                          <span onClick={() => handleVectorDelete(item.vectorID)}>
                            <DeleteFilled className="text-red-500 float-right" />
                          </span>
                        </section>
                      );
                    })
                  : "暂无信息"}
              </div>
            </div>
          )}
        </section>
        <section className="bg-white p-4 mt-2 rounded-lg">
          <VectorFlow
            simple={false}
            data={initialValues}
            presetNodes={CustomNodeList}
            onChange={(t, d) => {
              // setInitialValues(d);
              setFlow(d);
            }}
            onConnectorClick={handleConnectorConfig}
            onClear={() => {
              setInitialValues(undefined);
            }}
            onNodeClick={handleNodeClick}
            onSave={(s, d, e) => {
              // todo

              if (!s) {
                message.error(e);
              } else if (
                d?.nodes.filter(item => item.type === "vector").some(item => !(item as any).data.connectorId)
              ) {
                message.error("请完善连接器配置");
              } else {
                console.log(d);
                message.success("保存成功");
                setInitialValues(d as FlowData);
                console.log(d);
              }
              d && setInitialValues({ ...d });
            }}
          />
        </section>
        {readonly ? null : (
          <div className="flex justify-end p-4 bg-white mt-4">
            <Button type="primary" onClick={confirm}>
              保存
            </Button>
          </div>
        )}
      </section>
      {modalVisible ? (
        <VectorModal
          open={modalVisible}
          handleOk={handleVectorSelected}
          handleCancel={toggleModal}
          selected={seletedVector}
        ></VectorModal>
      ) : null}
      <UploadModal
        open={uploadModalVisible}
        onConfirm={handleConnectorChange}
        onCancel={toggleUploadModal}
        value={curNode?.connectorId}
      ></UploadModal>
      {vectorModalDisplay && (
        <VectorConfigModal
          open={true}
          onConfirm={handleVectorConfig}
          onCancel={toggleVectorModal}
          title={curNode?.label}
          id={curNode?.vectorId}
          originData={curNode}
        ></VectorConfigModal>
      )}
    </div>
  );
}

export default EditScenarios;
