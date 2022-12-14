import { CSSProperties, FC } from "react";
import React, { memo, useCallback, useState } from "react";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { cloneDeep, uniqueId } from "lodash-es";
import { Form, Input, Button, Space, Radio, message } from "antd";
import { Colors } from "./Colors";
import type { DragItem } from "./interfaces";
import { ComponentsList } from "./SourceBox";
import Item from "antd/es/list/Item";

const style: CSSProperties = {
  textAlign: "center"
};
interface ConfigBarPropsType {
  id: string;
  data: any;
  onChange: any;
}
const ConfigBar = ({ id, data, onChange }: ConfigBarPropsType) => {
  console.log("form重新渲染了", data);

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  if (!data) return null;
  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        key={id}
        // wrapperCol={{ span: 16 }}
        initialValues={data}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        onFieldsChange={(_, allFields) => {
          onChange(allFields);
        }}
      >
        {"name" in data && (
          <Form.Item label="字段名称" name="name" rules={[{ required: true, message: "" }]}>
            <Input placeholder="点击输入字段名称" />
          </Form.Item>
        )}

        {"help" in data && (
          <Form.Item label="字段提示" name="help" rules={[{ required: true, message: "" }]}>
            <Input placeholder="点击输入字段提示" />
          </Form.Item>
        )}

        {"required" in data && (
          <Form.Item label="是否必填" name="required" rules={[{ required: true, message: "" }]}>
            <Radio.Group
              options={[
                {
                  value: true,
                  label: "是"
                },
                {
                  value: false,
                  label: "否"
                }
              ]}
            />
          </Form.Item>
        )}

        {"options" in data && (
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} align="baseline">
                    <Form.Item {...field} label={"选项 " + (index + 1)} rules={[{ required: true, message: "" }]}>
                      <Input />
                    </Form.Item>

                    <MinusCircleOutlined className="mt-10" onClick={() => remove(field.name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加选项
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}
        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    </div>
  );
};

const MemoConfigBar = React.memo(ConfigBar);

const ComponentsConfigMap: Record<string, any> = {
  Input: {
    name: "",
    help: "",
    required: true
  },
  TextArea: {
    name: "",
    help: "",
    required: true
  },
  Select: {
    name: "",
    help: "",
    options: [],
    required: true
  },
  Int: {
    name: "",
    help: "",
    required: true
  },
  Radio: {
    name: "",
    help: "",
    options: [],
    required: true
  },
  Checkbox: {
    name: "",
    help: "",
    options: [],
    required: true
  },
  Upload: {
    name: "",
    help: "",
    required: true
  }
};

export interface TargetBoxProps {
  onDrop: (item: any) => void;
  lastDroppedColor?: string;
  children: React.ReactNode;
}

// eslint-disable-next-line react/prop-types
const TargetBox: FC<TargetBoxProps> = memo(function TargetBox({ onDrop, lastDroppedColor, children }) {
  const [{ isOver, draggingColor, canDrop }, drop] = useDrop(() => {
    return {
      accept: Object.keys(ComponentsList),
      drop(_item: DragItem, monitor) {
        onDrop(monitor.getItemType());
        return undefined;
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggingColor: monitor.getItemType() as string
      })
    };
  }, [onDrop]);

  const opacity = isOver ? 1 : 0.7;
  let backgroundColor = "#fff";
  switch (draggingColor) {
    case Colors.BLUE:
      backgroundColor = "lightblue";
      break;
    case Colors.YELLOW:
      backgroundColor = "lightgoldenrodyellow";
      break;
    default:
      break;
  }

  return (
    <div
      ref={drop}
      data-color={lastDroppedColor || "none"}
      style={{ ...style, backgroundColor, opacity }}
      role="TargetBox"
      className="border border-dashed rounded-lg p-8"
    >
      {/* <p>Drop here.</p> */}
      {children}
      {/* {!canDrop && lastDroppedColor && <p>Last dropped: {lastDroppedColor}</p>} */}
    </div>
  );
});

export interface StatefulTargetBoxState {
  lastDroppedColor: string | null;
}

interface PropsType {
  confirm: any;
  data: any;
  cancel: () => void;
}

export const StatefulTargetBox: FC<PropsType> = props => {
  const [lastDroppedColor, setLastDroppedColor] = useState<string | null>(null);
  const [list, setList] = useState<any[]>(props.data.map((_: any) => ({ ..._, id: uniqueId() })));
  const [curConfig, setCurConfig] = useState<any>({});
  const [errlist, setErrList] = useState<number[]>([]);

  const handleDrop = (type: string) => {
    setList([
      ...list,
      {
        type,
        id: uniqueId(),
        config: cloneDeep(ComponentsConfigMap[type])
      }
    ]);
    setLastDroppedColor(type);
  };

  const remove = (index: number) => {
    list.splice(index, 1);
    setList([...list]);
  };

  const handleConfigChange = useCallback(
    (value: any) => {
      const index = list.findIndex(item => item.id === curConfig.id);
      if (index >= 0) {
        const res: any = { id: curConfig.id };
        value.forEach((item: any) => {
          if (item.name.length === 1) {
            if (item.name[0] === "options" && !item.value) {
              res[item.name[0]] = [];
            } else {
              res[item.name[0]] = typeof item.value === "boolean" ? item.value : item.value || "";
            }
          }
        });
        setCurConfig({ ...curConfig, config: res });
        list.splice(index, 1, { ...curConfig, config: res });
        setList([...list]);
      }
    },
    [list, curConfig]
  );

  const getErrorList = () => {
    let res: number[] = [];
    list.forEach(components => {
      Object.keys(components.config).forEach(key => {
        if (key === "required") {
          // Noop
        } else if (key === "options") {
          if (!components.config[key].length || !components.config[key].some((option: any) => !!option)) {
            res.push(components.id);
          }
        } else {
          if (!components.config[key]) {
            res.push(components.id);
          } else {
            // Noop
          }
        }
      });
    });

    res = Array.from(new Set(res)) as number[];

    return res;
  };

  console.log(errlist, 333);

  const handleConfirm = () => {
    const errorList = getErrorList();
    console.log(errorList, 444);

    if (!errorList.length) {
      setErrList([]);
      const res = cloneDeep(list);
      res.forEach(item => delete item.id);
      props.confirm(res);
    } else {
      setErrList(errorList);
      message.error("请补全表单内容");
    }
  };

  // console.log(ComponentsList[list[0]].component);

  // console.log(handleDrop, lastDroppedColor, list, 22222);
  return (
    <div className="flex h-full gap-10 justify-between pl-10 ">
      {/* <div onClick={() => console.log(list)}>aaa</div> */}
      <div className="flex-1 flex flex-col gap-2 h-full scroll-mx-px scroll-p-1.5">
        <div className="bg-white p-6 flex-1 overflow-auto shadow ">
          {list.map((item, key) => {
            return (
              <div
                key={key}
                className={`p-4 border border-dashed mb-4 rounded cursor-pointer ${
                  errlist.includes(item.id) ? "border-red-300 border-2" : ""
                } bg-gray-50`}
                onClick={() => setCurConfig(item)}
              >
                <MinusCircleOutlined onClick={() => remove(key)} className="float-right" />
                <section className=" font-semibold mb-4">{ComponentsList[item.type].label}</section>
                <section className="text-xs text-gray-500 mb-1">{"字段名：" + item.config.name || ""}</section>
                <section className="py-1 text-gray-500 text-xs mb-3">字段提示：{item?.config.help}</section>
                {"options" in item.config
                  ? ComponentsList[item.type].component(item.config.options)
                  : ComponentsList[item.type].component()}
              </div>
            );
          })}
          <TargetBox {...props} lastDroppedColor={lastDroppedColor as string} onDrop={handleDrop}>
            <PlusOutlined className="text-2xl block mb-3 " />
            拖拽组件到此区域
          </TargetBox>
        </div>
        <div className="w-full px-6 py-3 flex-0 bg-white shadow ">
          <Button type="primary" className="float-right" onClick={handleConfirm}>
            保存
          </Button>
          <Button className="float-right mr-4" onClick={() => props.cancel()}>
            取消
          </Button>
        </div>
      </div>
      <div className="w-72 bg-white p-4 overflow-auto">
        <section className="font-bold text-base py-4">配置组件</section>
        <section>
          <MemoConfigBar id={curConfig.id} data={curConfig.config} onChange={handleConfigChange}></MemoConfigBar>
        </section>
        {/* <section>{Object.keys(curConfig).map()}</section> */}
      </div>
    </div>
  );
};
