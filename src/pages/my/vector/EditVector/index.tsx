import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LeftOutlined, InboxOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Button, Steps, Form, Result, Input, Select, Divider, Upload, Alert } from "antd";
import { GetVectorVersionDetail, CreateVector } from "@/api/vector";
import { GetDictData } from "@/api/dict";
import type { UploadProps } from "antd";
import InputConfigPannel from "./inputConfigPannel";
import OutputConfigPannel from "./outputConfigPannel";
import { RequestStateEnum } from "@/type/api";

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

const InitFom: RequestType.CreateVector = {
  attCkCategory: "",
  attCkID: "",
  categoryID: "",
  contents: [
    {
      inputConfig: {
        content: []
      },
      os: "",
      osArch: [],
      osVersion: [],
      outputConfig: {
        content: []
      },
      url: "sdfsdf"
    }
  ],
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

function EditVectorPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<ResponseType.GetVectorVersionDetailContent>(InitFom);
  const [curStep, setCurStep] = useState(0);

  const id = searchParams.get("id");
  const version = searchParams.get("v");
  const [form] = Form.useForm();

  const { data: originFormData } = useQuery(["vector-version-detail"], () => GetVectorVersionDetail(id as string), {
    select: data => {
      return data.data;
    },
    enabled: !!id,
    onSuccess: data => {
      if (data) {
        setFormData(data);
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

  const handleBack = data => {
    console.log(data);
    // TODO
  };

  const onFinish = (data: RequestType.CreateVector) => {
    if (!id) {
      CreateVectorMutate(data);
    }
    console.log(data);
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
                  <Form.Item name="name" label="攻击向量" rules={[{ required: true, message: "请输入名称" }]}>
                    <Input placeholder="请输入名称" />
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
                  <Form.List name="contents">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(field => (
                          <div
                            key={field.key}
                            className="flex w-full justify-between border border-dashed rounded-lg p-4 mb-2"
                          >
                            {/* <div>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                          }
                        >
                          {() => (
                            <Form.Item
                              {...field}
                              label="Sight"
                              name={[field.name, "sight"]}
                              rules={[{ required: true, message: "Missing sight" }]}
                            ></Form.Item>
                          )}
                        </Form.Item>
                      </div> */}
                            <div className="w-2/5">
                              <Form.Item name={[field.name, "os"]} label="添加平台" required labelAlign="left">
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
                              <Form.Item name={[field.name, "osVersion"]} label="选择版本" required>
                                <Select
                                  mode="multiple"
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
                              <Form.Item name={[field.name, "osArch"]} label="体系结构" required>
                                <Select
                                  mode="multiple"
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
                          <Button type="dashed" onClick={() => add()} block>
                            +
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                  <Divider></Divider>
                  <Form.Item name="targetRangeURL" label="靶场" rules={[{ required: true, message: "请输入靶场URL" }]}>
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
                  <Button type="primary" key="console">
                    返回
                  </Button>
                ]}
              />
            </div>
          </div>
          <div className={`bg-white p-4 flex justify-end gap-2 ${curStep !== 2 ? "block" : "hidden"}`}>
            {curStep === 2 ? null : <Button onClick={prev}>上一步</Button>}
            <Button type="primary" onClick={next}>
              下一步
            </Button>
          </div>
        </section>
      </section>
    </div>
  );
}

export default EditVectorPage;
