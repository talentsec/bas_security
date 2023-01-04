import React, { useState } from "react";
import { Button } from "antd";
import SiteDrawer from "@/components/SiteDrawer";
import Editor from "./Editor";

interface InputConfigPannelProps {
  value?: any;
  onChange?: any;
}

function InputConfigPannel({ value, onChange }: InputConfigPannelProps) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const confirm = (list: any) => {
    console.log(list);
    onChange({ content: list });
    setOpen(false);
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
        title="输入配置"
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
        <div className="flex h-full bg-slate-50 p-0">
          <Editor confirm={confirm} data={value?.content || []} cancel={onClose}></Editor>
        </div>
      </SiteDrawer>
      {/* {JSON.stringify(value)} */}
    </div>
  );
}

export default InputConfigPannel;
