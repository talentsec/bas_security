import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { getToken } from "@/api/http";
import { LeftOutlined, InboxOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

interface UploadFileProps {
  value?: string;
  onChange?: (fileList: UploadFile<string>) => void;
  disabled?: boolean;
}

const UploadFileComp = ({ value, onChange, disabled }: UploadFileProps) => {
  const props: UploadProps = {
    name: "file",
    // action: import.meta.env.VITE_BASE_URL + "/api/oss/upload",
    action: "/api/oss/upload",
    maxCount: 1,
    multiple: false,
    directory: false,
    disabled,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDownload: () => {},
    defaultFileList: value
      ? [
          {
            uid: "1",
            name: value,
            status: "done",
            url: value
          }
        ]
      : [],
    headers: {
      Authorization: getToken()
    },
    onChange(info) {
      const { status, response } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if (response.code === 0) {
          message.success(`${info.file.name} 文件上传成功`);
          console.log(response.data.filePath);
          onChange?.(response.data.filePath as any);
        } else {
          message.error(`${info.file.name} 文件上传失败`);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    }
  };

  return (
    <Dragger {...props}>
      <div className="p-20">
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-hint">点击或拖拽上传文件</p>
      </div>
    </Dragger>
  );
};

export default UploadFileComp;
