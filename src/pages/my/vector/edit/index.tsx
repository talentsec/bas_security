import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LeftOutlined, InboxOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Button, Steps, Form, Result, Input, Select, Divider, Upload, Alert, message, Spin } from "antd";
import { GetVectorVersionDetail, CreateVector, CreateVectorVersions, UpdateVectorVersions } from "@/api/vector";
import { GetDictData } from "@/api/dict";
import type { UploadProps } from "antd";
import InputConfigPannel from "./inputConfigPannel";
import OutputConfigPannel from "./outputConfigPannel";
import { RequestStateEnum } from "@/type/api";
import { cloneDeep } from "lodash-es";

const StepItems = [
  {
    title: "攻击向量设置"
  },
  {
    title: "详情编辑"
  },
  {
    title: "完成"
  }
];

const DefaultContents = {
  inputConfig: {
    content: []
  },
  os: "",
  osArch: [],
  osVersion: [],
  outputConfig: {
    content: []
  },
  url: ""
};

const InitFom: RequestType.CreateVector = {
  attCkCategory: "",
  attCkID: "",
  categoryID: "",
  contents: [cloneDeep(DefaultContents)],
  execMode: "LOCAL",
  name: "",
  platform: "",
  remark: "",
  roleType: "NORMAL",
  targetRangeURL: "",
  version: ""
};

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  }
};

const CheckContents = (value: any) => {
  const errorList = [];
  Object.keys(value).forEach(item => {
    if (item === "inputConfig" || item === "outputConfig") {
      if (value[item].content.length === 0) {
        errorList.push(item);
      } else if (Array.isArray(value[item]) && value[item].length === 0) {
        errorList.push(item);
      } else {
        if (!value[item]) errorList.push(item);
      }
    }
  });
  return !errorList.length;
};
enum EditModeEnum {
  CREATE_VECTOR = "CREATE_VECTOR",
  CREATE_VERSION = "CREATE_VERSION",
  EDIT_VERSION = "EDIT_VERSION",
  CREATE_VERSION_BASE_EXIST = "CREATE_VERSION_BASE_EXIST"
}

type EditModeType =
  | EditModeEnum.CREATE_VECTOR
  | EditModeEnum.CREATE_VERSION
  | EditModeEnum.CREATE_VERSION_BASE_EXIST
  | EditModeEnum.EDIT_VERSION;

function EditVectorPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<ResponseType.GetVectorVersionDetailContent | RequestType.CreateVector>(
    InitFom
  );
  const [curStep, setCurStep] = useState(0);
  const [editMode, setEditMode] = useState<EditModeType>(EditModeEnum.CREATE_VECTOR);
  const [dictKey, setDictKey] = useState("os");
  const [osList, setOsList] = useState<{ label: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [osVersionMap, setOsVersionMap] = useState<Record<string, { label: string; value: string }[]>>({});

  const Navigator = useNavigate();
  const id = searchParams.get("id");
  const versionID = searchParams.get("v");
  const [form] = Form.useForm();
  const contents = Form.useWatch("contents", form);

  useQuery(["vector-version-detail"], () => GetVectorVersionDetail(versionID as string), {
    select: data => {
      return data.data;
    },
    enabled: !!versionID,
    onSuccess: data => {
      setIsLoading(false);
      if (data) {
        setFormData(data);
      } else {
        // Noop
      }
    },
    onError: () => {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (id && versionID) {
      setEditMode(EditModeEnum.CREATE_VERSION_BASE_EXIST);
    } else if (versionID && !id) {
      setEditMode(EditModeEnum.EDIT_VERSION);
    } else if (id) {
      setEditMode(EditModeEnum.CREATE_VERSION);
      setIsLoading(false);
    } else {
      setEditMode(EditModeEnum.CREATE_VECTOR);
      setIsLoading(false);
    }
  }, []);

  useQuery(["dictData", dictKey], () => GetDictData(dictKey), {
    onSuccess: data => {
      if (data.code === RequestStateEnum.SUCCESS) {
        if (dictKey === "os") {
          const res = (data?.data || []).map(item => ({ label: item.name, value: item.value }));
          setOsList(res);
        } else {
          setOsVersionMap({
            ...osVersionMap,
            dictKey: (data?.data || []).map(item => ({ label: item.name, value: item.value }))
          });
        }
      } else {
        // Noop
      }
    }
  });

  const { mutate: CreateVectorMutate } = useMutation(CreateVector, {
    onSuccess: data => {
      if (data.code === RequestStateEnum.SUCCESS) {
        setCurStep(2);
      } else {
        console.log("创建失败");
      }
    },
    onError: error => {
      console.log(error);
    }
  });

  const { mutate: UpdateVectorVersionsMutation } = useMutation(
    (val: { id: string; data: RequestType.updateVectorVersions }) => UpdateVectorVersions(val.id, val.data),
    {
      onSuccess: data => {
        if (data.code === RequestStateEnum.SUCCESS) {
          setCurStep(2);
        } else {
          console.log("创建失败");
        }
      },
      onError: error => {
        console.log(error);
      }
    }
  );

  const { mutate: CreateVectorVersionsMutation } = useMutation(CreateVectorVersions, {
    onSuccess: data => {
      if (data.code === RequestStateEnum.SUCCESS) {
        setCurStep(2);
      } else {
        console.log("创建失败");
      }
    },
    onError: error => {
      console.log(error);
    }
  });

  const handleBack = () => {
    window.history.back();
  };

  const onFinish = (data: RequestType.CreateVector) => {
    const confirmData: any = cloneDeep(data);

    switch (editMode) {
      case EditModeEnum.CREATE_VECTOR:
        CreateVectorMutate(data);
        break;
      case EditModeEnum.CREATE_VERSION:
        delete confirmData.name;
        confirmData.vectorID = Number(id);
        CreateVectorVersionsMutation(confirmData);
        break;
      case EditModeEnum.CREATE_VERSION_BASE_EXIST:
        delete confirmData.name;
        confirmData.vectorID = Number(id);
        CreateVectorVersionsMutation(confirmData);
        break;
      case EditModeEnum.EDIT_VERSION:
        delete confirmData.name;
        delete confirmData.version;
        confirmData.vectorID = Number(id);
        UpdateVectorVersionsMutation({ id: versionID as string, data: confirmData });
        break;
      default:
        break;
    }
  };

  const next = () => {
    if (curStep === 1) {
      form.submit();
    } else {
      setCurStep(curStep + 1);
    }
  };

  const prev = () => {
    if (curStep === 0) return;
    setCurStep(curStep - 1);
  };

  return (
    <div className="w-full h-full flex flex-col border-t">
      <section className="bg-white p-5 text-lg font-semibold flex justify-between mb-4 rounded-lg">
        <span className="w-1/4 inline-block">
          <span className="mr-4 hover:text-blue-500 cursor-pointer" onClick={handleBack}>
            <LeftOutlined />
          </span>
          <span>{"" || "未命名向量"}</span>
          {/* <span className="text-gray-400 font-normal text-sm ml-2">｜新建攻击向量</span> */}
        </span>
        <span className="w-1/2 inline-block">
          <Steps items={StepItems} current={curStep}></Steps>
        </span>
        <span className="w-1/4 inline-block"></span>
      </section>
      <section className="overflow-auto">
        <section className="borderd mx-auto  w-3/4 flex-1 flex flex-col gap-2">
          {isLoading ? (
            <Spin className="w-full h-full flex-1"></Spin>
          ) : (
            <div className="flex-1 bg-white p-8">
              <Form
                form={form}
                initialValues={formData}
                name="dynamic_form_complex"
                onFinish={onFinish}
                layout="vertical"
              >
                <>
                  <div className={`${curStep === 0 ? "block" : "hidden"}`}>
                    <Form.Item
                      name="name"
                      label="攻击向量"
                      rules={[{ required: editMode === EditModeEnum.CREATE_VECTOR, message: "请输入名称" }]}
                    >
                      <Input placeholder="请输入名称" disabled={editMode !== EditModeEnum.CREATE_VECTOR} />
                    </Form.Item>
                    <Form.Item name="version" label="版本号" rules={[{ required: true, message: "请输入版本号" }]}>
                      <Input placeholder="请输入版本号" />
                    </Form.Item>
                    <Form.Item name="execMode" label="执行方式" rules={[{ required: true, message: "请选择执行方式" }]}>
                      <Select
                        options={[
                          {
                            value: "REMOTE",
                            label: "远程执行"
                          },
                          {
                            value: "LOCAL",
                            label: "本地执行"
                          }
                        ]}
                      ></Select>
                    </Form.Item>
                    <Form.Item name="roleType" label="权限要求" rules={[{ required: true, message: "请选择执行方式" }]}>
                      <Select
                        options={[
                          {
                            value: "NORMAL",
                            label: "普通用户"
                          },
                          {
                            value: "ADMIN",
                            label: "管理员"
                          }
                        ]}
                      ></Select>
                    </Form.Item>
                    <Divider></Divider>
                    <Form.List
                      name="contents"
                      rules={[
                        {
                          validator: async (_: any, values) => {
                            if (!values || values.length < 1) {
                              return Promise.reject(new Error("至少有一项配置内容"));
                            } else if (values.some((item: any) => !CheckContents(item))) {
                              console.log(88888);
                              return Promise.reject(new Error("请将以上内容补充完整"));
                            }
                          }
                        }
                      ]}
                    >
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map(field => (
                            <div
                              key={field.key}
                              className="flex w-full justify-between border border-dashed rounded-lg p-4 mb-2"
                            >
                              <div className="w-2/5">
                                <Form.Item name={[field.name, "os"]} label="添加平台" required labelAlign="left">
                                  <Select options={osList} onChange={value => setDictKey(value)}></Select>
                                </Form.Item>
                                <Form.Item name={[field.name, "osVersion"]} label="选择版本" required>
                                  <Select
                                    mode="multiple"
                                    options={
                                      contents && contents[field.key]?.os ? osVersionMap[contents[field.key]?.os] : []
                                    }
                                  ></Select>
                                </Form.Item>
                                <Form.Item name={[field.name, "osArch"]} label="体系结构" required>
                                  <Select
                                    mode="multiple"
                                    options={[
                                      {
                                        value: "x86",
                                        label: "x86"
                                      },
                                      {
                                        value: "x64",
                                        label: "x64"
                                      },
                                      {
                                        value: "arm",
                                        label: "arm"
                                      }
                                    ]}
                                  ></Select>
                                </Form.Item>
                                {/* <Form.Item name={[field.name, "inputConfig"]} label="输入" required>
                            {field.key}
                          </Form.Item> */}
                                <Form.Item name={[field.name, "inputConfig"]} label="输入" required>
                                  <InputConfigPannel />
                                </Form.Item>
                                <Form.Item name={[field.name, "outputConfig"]} label="输出" required>
                                  <OutputConfigPannel />
                                </Form.Item>
                              </div>
                              <div className="w-1/2">
                                <MinusCircleOutlined onClick={() => remove(field.name)} className="float-right" />
                                <Form.Item name={[field.name, "url"]} label="二进制文件" required labelAlign="left">
                                  <Dragger {...props}>
                                    <div className="p-28">
                                      <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                      </p>
                                      <p className="ant-upload-hint">点击或拖拽上传文件</p>
                                    </div>
                                  </Dragger>
                                </Form.Item>
                              </div>
                            </div>
                          ))}

                          <Form.Item>
                            <Button type="dashed" onClick={() => add(cloneDeep(DefaultContents))} block>
                              +
                            </Button>
                          </Form.Item>
                          <div className="text-red-500">
                            <Form.ErrorList errors={errors} />
                          </div>
                        </>
                      )}
                    </Form.List>
                    <Divider></Divider>
                    <Form.Item
                      name="targetRangeURL"
                      label="靶场"
                      rules={[{ required: true, message: "请输入靶场URL" }]}
                    >
                      <Input placeholder="请输入靶场URL" />
                    </Form.Item>
                    <Alert
                      message="需校验"
                      type="info"
                      action={
                        <Button size="small" type="text" className="my-2">
                          开始校验
                        </Button>
                      }
                      showIcon
                    ></Alert>
                  </div>
                  <div className={`${curStep === 1 ? "block" : "hidden"}`}>
                    <Form.Item name="attCkID" label="ATT&CK ID" rules={[{ required: true, message: "请输入attackID" }]}>
                      <Input placeholder="请输入ATT&CK ID" />
                    </Form.Item>
                    <Form.Item name="categoryID" label="大类 ID" rules={[{ required: true, message: "请输入类别ID" }]}>
                      <Input placeholder="请输入类别ID" />
                    </Form.Item>
                    <Form.Item
                      name="attCkCategory"
                      label="ATT&CK 归类"
                      rules={[{ required: true, message: "请输入ATT&CK 归类" }]}
                    >
                      <Input placeholder="请输入类别ID" />
                    </Form.Item>
                    <Form.Item name="platform" label="适用平台" rules={[{ required: true, message: "请输入类别ID" }]}>
                      <Input placeholder="请输入适用平台" />
                    </Form.Item>
                    <Form.Item name="remark" label="描述" rules={[{ required: true, message: "请输入类别ID" }]}>
                      <Input placeholder="请输入描述" />
                    </Form.Item>
                  </div>
                </>
              </Form>
              <div className={`${curStep === 2 ? "block" : "hidden"} h-full`}>
                <Result
                  status="success"
                  title="新建向量成功"
                  extra={[
                    <Button type="primary" key="console" onClick={() => window.history.back()}>
                      返回
                    </Button>
                  ]}
                />
              </div>
            </div>
          )}

          <div className={`bg-white p-4 flex justify-end gap-2 ${curStep !== 2 ? "block" : "hidden"}`}>
            {curStep === 1 ? <Button onClick={prev}>上一步</Button> : null}
            <Button type="primary" onClick={next}>
              {curStep === 1 ? "提交" : "下一步"}
            </Button>
          </div>
        </section>
      </section>
    </div>
  );
}

export default EditVectorPage;
