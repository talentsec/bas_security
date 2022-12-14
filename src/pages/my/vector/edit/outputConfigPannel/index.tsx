import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import SiteDrawer from "@/components/SiteDrawer";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const options = [
  {
    value: "Number",
    label: "数字"
  },
  {
    value: "string",
    label: "字符串"
  },
  {
    value: "Array",
    label: "数组"
  },
  {
    value: "Boolean",
    label: "布尔型"
  },
  {
    value: "null",
    label: "null"
  },
  {
    value: "Object",
    label: "对象"
  }
];
interface InputConfigPannelProps {
  value?: any;
  onChange?: any;
}

function InputConfigPannel({ value, onChange }: InputConfigPannelProps) {
  const [open, setOpen] = useState(false);
  const [formData] = useState(value || { content: [] });
  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
    onChange({ content: values.content || [] });
    setOpen(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const confirm = () => {
    form.submit();
  };

  return (
    <div>
      <div
        onClick={showDrawer}
        className="bg-gray-100 px-8 py-1 rounded inline-block border border-dashed cursor-pointer"
      >
        配置
      </div>
      <SiteDrawer
        title="输出配置"
        destroyOnClose
        onClose={onClose}
        open={open}
        // extra={
        //   <div>
        //     <Button type="primary" onClick={() => confirm()}>
        //       提交
        //     </Button>
        //   </div>
        // }
      >
        <div className="bg-gray-100 h-full px-36 justify-between ">
          <section className="flex flex-col h-full gap-4">
            <Form
              name="basic"
              form={form}
              labelCol={{ span: 8 }}
              // wrapperCol={{ span: 16 }}
              initialValues={formData}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
              onFieldsChange={(_, allFields) => {
                onChange(allFields);
              }}
              className="flex-1 h-full overflow-auto shadow p-10 bg-white"
            >
              <Form.List name="content">
                {(fields, { add, remove }) => (
                  <div>
                    {fields.map((field, index) => (
                      <div key={field.key}>
                        <section className="font-bold text-base p-2">输出配置 {index + 1}</section>
                        <div className="border mb-4 rounded p-4 bg-gray-50">
                          <MinusCircleOutlined className="float-right" onClick={() => remove(field.name)} />
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                label={"名称"}
                                name={[field.name, "name"]}
                                rules={[{ required: true, message: "请填写名称" }]}
                              >
                                <Input />
                              </Form.Item>
                            )}
                          </Form.Item>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                name={[field.name, "type"]}
                                label={"输出类型"}
                                rules={[{ required: true, message: "请填写输出类型" }]}
                              >
                                <Select options={options}></Select>
                              </Form.Item>
                            )}
                          </Form.Item>

                          <Form.Item
                            {...field}
                            name={[field.name, "content"]}
                            label={"备注信息"}
                            rules={[{ required: true, message: "请填写备注信息" }]}
                          >
                            <Input.TextArea />
                          </Form.Item>
                        </div>
                      </div>
                    ))}

                    <Form.Item>
                      <Button type="dashed" size="large" onClick={() => add()} block icon={<PlusOutlined />}>
                        添加输出配置
                      </Button>
                    </Form.Item>
                  </div>
                )}
              </Form.List>

              {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
            </Form>
            <section className="px-8 py-3 shadow bg-white">
              <Button className="float-right" type="primary" onClick={() => confirm()}>
                保存
              </Button>
              <Button
                className="float-right mr-4"
                onClick={() => {
                  onClose();
                }}
              >
                取消
              </Button>
            </section>
          </section>
        </div>
      </SiteDrawer>
      {/* {JSON.stringify(value)} */}
    </div>
  );
}

export default InputConfigPannel;
