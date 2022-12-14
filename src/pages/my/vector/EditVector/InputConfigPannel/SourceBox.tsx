import React, { memo, useCallback, useMemo, useState } from "react";
import type { CSSProperties, FC, ReactNode } from "react";
import type { DragSourceMonitor } from "react-dnd";
import { Input, Select, InputNumber, Radio, Checkbox, Upload } from "antd";
import { useDrag } from "react-dnd";
import { UploadOutlined, SettingOutlined } from "@ant-design/icons";

export const ComponentsList: Record<string, { label: string; component: (arg?: any) => ReactNode }> = {
  Input: {
    label: "单行文本",
    component: () => {
      return <Input className="w-full"></Input>;
    }
  },
  TextArea: {
    label: "多行文本",
    component: () => {
      return <Input.TextArea className="w-full" />;
    }
  },
  Select: {
    label: "下拉框",
    component: options => {
      return (
        <Select className="w-full">
          {options.map((item: string, key: number) => {
            return (
              <Select.Option key={key} value={item}>
                {item || "选项" + (key + 1)}
              </Select.Option>
            );
          })}
        </Select>
      );
    }
  },
  Radio: {
    label: "单选框",
    component: options => {
      return (
        <Radio.Group>
          {options.map((item: string, key: number) => {
            return (
              <Radio key={key} value={item}>
                {item || "选项" + (key + 1)}
              </Radio>
            );
          })}
        </Radio.Group>
      );
    }
  },
  Checkbox: {
    label: "多选框",
    component: options => {
      return (
        <div>
          {options.map((item: string, key: number) => {
            return <Checkbox key={key}>{item || "选项" + (key + 1)}</Checkbox>;
          })}
        </div>
      );
    }
  },
  // Str: {
  //   label: "str输入",
  //   component: <div className="font-xl"> Str</div>
  // },
  Int: {
    label: "int输入",
    component: () => {
      return <InputNumber className="w-full" />;
    }
  },
  Upload: {
    label: "文件上传",
    component: () => {
      return (
        <div className="flex justify-center">
          <Upload listType="picture-card" disabled>
            <div className="text-gray-400 w-96">
              <UploadOutlined className="text-2xl block " />
              文件上传
            </div>
          </Upload>
        </div>
      );
    }
  }
};

const style: CSSProperties = {
  border: "1px solid lightgray",
  padding: "0.5rem",
  width: "120px"
};

export interface SourceBoxProps {
  type: string;
  onToggleForbidDrag?: () => void;
  children?: ReactNode;
}

// eslint-disable-next-line react/prop-types
export const SourceBox: FC<SourceBoxProps> = memo(function SourceBox({ type, children }) {
  const [forbidDrag, setForbidDrag] = useState(false);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      forbidDrag,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [forbidDrag, type]
  );

  // const onToggleForbidDrag = useCallback(() => {
  //   setForbidDrag(!forbidDrag);
  // }, [forbidDrag, setForbidDrag]);

  const containerStyle = useMemo(
    () => ({
      ...style,
      opacity: isDragging ? 0.4 : 1,
      cursor: forbidDrag ? "default" : "move"
    }),
    [isDragging, forbidDrag]
  );

  return (
    <div ref={drag} style={containerStyle} role="SourceBox" className=" rounded bg-gray-100">
      {/* <input type="checkbox" checked={forbidDrag} onChange={onToggleForbidDrag} /> */}
      {/* <small>Forbid drag</small> */}
      <SettingOutlined />
      <span className="ml-2">{ComponentsList[type].label}</span>
      {/* {children} */}
    </div>
  );
});
