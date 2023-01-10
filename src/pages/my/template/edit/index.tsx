import { useState, useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Form, Input, Table, Spin, message } from "antd";
import ScenariosModal from "./ScenariosModal";
import type { ColumnsType } from "antd/es/table";
import {
  GetTemplateVersionDetail,
  UpdateTemplateVersion,
  CreateTemplate,
  CreateTemplateVersion
} from "@/api/taskTemplate";
import { useQuery, useMutation } from "react-query";
import { useSearchParams } from "react-router-dom";
import { EditModeType, EditModeEnum } from "@/type/common";
import { cloneDeep } from "lodash-es";
import { RequestStateEnum } from "@/type/api";
import { useAppSelector } from "@/hooks/redux";

interface ScenariosConfigType {
  capTests: string[];
  compTechs: string[];
  name: string;
  scenarioID: number;
  version: string;
  id: number;
}

const InitTempForm: RequestType.CreateTemplate = {
  contents: [],
  name: "",
  remark: "",
  version: ""
};

function EditScenarios() {
  const [searchParams] = useSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [seletedScenarios, setSelectedScenarios] = useState<ScenariosConfigType[]>([]);
  const [editMode, setEditMode] = useState<EditModeType>(EditModeEnum.CREATE);
  const [readonly, setReadonly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [form] = Form.useForm();
  const id = searchParams.get("id");
  const versionID = searchParams.get("v");
  const name = searchParams.get("name");
  const user = useAppSelector(state => state.account.user);

  const [formData, setFormData] = useState<any>({ ...InitTempForm, name: name || "" });

  useEffect(() => {
    if (user && formData && versionID) {
      setReadonly(user.id !== (formData as ResponseType.GetVectorVersionDetailContent).createdBy);
    }
  }, [formData, user]);

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

  useQuery(["template-version-detail"], () => GetTemplateVersionDetail(Number(versionID)), {
    enabled: !!versionID,
    onSuccess(data) {
      setSelectedScenarios(data.data?.contents || []);
      setFormData(data.data);
      setIsLoading(false);
    }
  });

  const { mutate: CreateTemplateMutate } = useMutation(CreateTemplate, {
    onSuccess: data => {
      if (data.code === RequestStateEnum.SUCCESS) {
        message.success("创建成功");
      } else {
        console.log("创建失败");
      }
    }
  });

  const { mutate: UpdateTemplateVersionsMutation } = useMutation(
    (val: { id: number; data: RequestType.UpdateTemplateVersion }) => UpdateTemplateVersion(val.id, val.data),
    {
      onSuccess: data => {
        if (data.code === RequestStateEnum.SUCCESS) {
          message.success("创建成功");
        } else {
          console.log("创建失败");
        }
      }
    }
  );

  const { mutate: CreateTemplateVersionMutation } = useMutation(CreateTemplateVersion, {
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
  const onFinish = (values: any) => {
    const confirmData: any = cloneDeep(values);
    confirmData.contents = seletedScenarios.map(item => ({ scenarioID: item.scenarioID }));

    switch (editMode) {
      case EditModeEnum.CREATE:
        CreateTemplateMutate(confirmData);
        break;
      case EditModeEnum.CREATE_VERSION:
        delete confirmData.name;
        confirmData.taskTemplateID = Number(id);
        CreateTemplateVersionMutation(confirmData);
        break;
      case EditModeEnum.CREATE_VERSION_BASE_EXIST:
        delete confirmData.name;
        confirmData.taskTemplateID = Number(id);
        CreateTemplateVersionMutation(confirmData);
        break;
      case EditModeEnum.EDIT_VERSION:
        delete confirmData.name;
        delete confirmData.version;
        confirmData.vectorID = Number(id);
        UpdateTemplateVersionsMutation({ id: Number(versionID), data: confirmData });
        break;
      default:
        break;
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleVectorSelected = (list: ScenariosConfigType[]) => {
    setSelectedScenarios(list);
    toggleModal();
  };

  const columns: ColumnsType<ScenariosConfigType> = [
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
                    <span key={key} className="px-2 py-1 rounded border">
                      {item}
                    </span>
                  );
                }) + <span className="p-2 bg-gray-100">+{_.length - 4}</span>
              : _
              ? _.map((item: string, key: number) => {
                  return (
                    <span key={key} className="px-2 py-1 rounded border">
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

  const handleConfirm = () => {
    form.submit();
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <section className="bg-white border-t p-5 text-lg font-semibold ">
        <LeftOutlined
          className="mr-4 text-gray-500 hover:text-blue-500 hover:scale-105 cursor-pointer"
          onClick={() => history.back()}
        />
        <span>未命名模板</span>
      </section>
      <section className="p-4 flex-1 overflow-auto">
        <section className="bg-white p-8 rounded-lg">
          {isLoading ? (
            <Spin className="w-full h-full flex-1"></Spin>
          ) : (
            <div>
              <Form
                form={form}
                initialValues={formData}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // autoComplete="off"
                disabled={readonly}
                layout="vertical"
              >
                <div className="flex gap-8">
                  <Form.Item
                    label="模板名称"
                    name="name"
                    className="flex-1"
                    rules={[{ required: true, message: "请输入模板名称" }]}
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
                    label="选择攻击场景"
                    className="flex-1"
                    rules={[{ required: true, message: "请选择攻击场景" }]}
                  >
                    <Button onClick={toggleModal} className="bg-gray-100">
                      选择攻击场景
                    </Button>
                    <span className="text-gray-400 ml-4">
                      {seletedScenarios.length ? `已选择 ${seletedScenarios.length} 个场景` : null}
                    </span>
                  </Form.Item>
                </div>
                <Form.Item label="描述" name="remark" rules={[{ required: true, message: "请输入描述信息" }]}>
                  <Input className="w-full flex" />
                </Form.Item>
              </Form>
              <div>
                <Table
                  columns={columns}
                  dataSource={seletedScenarios.map((item, key) => ({ key, ...item }))}
                  pagination={false}
                ></Table>
              </div>
              {readonly ? null : (
                <section className="flex justify-end pt-40">
                  <Button className="" type="primary" onClick={handleConfirm}>
                    提交
                  </Button>
                </section>
              )}
            </div>
          )}
        </section>
      </section>
      <ScenariosModal
        open={modalVisible}
        handleOk={handleVectorSelected}
        handleCancel={toggleModal}
        selected={seletedScenarios}
      ></ScenariosModal>
    </div>
  );
}

export default EditScenarios;
