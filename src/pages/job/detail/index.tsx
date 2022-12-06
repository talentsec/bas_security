import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumb } from "antd";
import { useState } from "react";
import Setting from "./Setting";

export enum ModeType {
  CREATE = "create"
}
enum TabEnum {
  SETTING = "setting",
  CONSOLE = "console",
  RES = "res"
}

const TabStyleMap = {
  selected: "rounded text-blue-700 mb-2 text-sm p-4 bg-gray-100 cursor-pointer",
  normal: "rounded text-gray-500 mb-2 text-sm p-4 cursor-pointer"
};

const ModeMap = {
  [ModeType.CREATE]: "创建任务"
};

const TabList: OrdinaryType[] = [
  {
    label: "设置",
    value: TabEnum.SETTING
  },
  {
    label: "控制台",
    value: TabEnum.CONSOLE
  },
  {
    label: "结果展示",
    value: TabEnum.RES
  }
];

export default function JobDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [curTab, setCurTab] = useState<OrdinaryType>(TabList[0]);

  const mode: ModeType = useMemo(() => {
    return searchParams.get("o") as ModeType;
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <Breadcrumb>
        <Breadcrumb.Item>攻击任务</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">{ModeMap[mode]}</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="bg-white rounded-lg w-full h-full flex mt-4">
        <section className="w-48 border-r p-4">
          <div>
            {TabList.map((item, key) => {
              return (
                <div
                  key={key}
                  className={curTab === item ? TabStyleMap.selected : TabStyleMap.normal}
                  onClick={() => setCurTab(item)}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </section>
        <section className="w-full h-full">
          {(function () {
            if (curTab.value === TabEnum.SETTING) {
              return <Setting></Setting>;
            } else if (curTab.value === TabEnum.CONSOLE) {
              return null;
            } else {
              return null;
            }
          })()}
        </section>
      </div>
    </div>
  );
}
