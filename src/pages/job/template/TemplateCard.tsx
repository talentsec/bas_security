import React from "react";
import { MoreOutlined, FileSearchOutlined } from "@ant-design/icons";
import { Button } from "antd";

export interface TemplateCardProps {
  data: {
    title: string;
    image: string;
    auther: string;
    time: string;
    tag: string;
    count: string;
    scene: string;
    desc: string;
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  toggleDetail: Function;
}

export default function TemplateCard({ data, toggleDetail }: TemplateCardProps) {
  return (
    <div className="border border-solid border-gray-200 rounded-lg overflow-hidden w-72 text-gray-600 hover:shadow-lg">
      <section className="w-full flex justify-between p-4 items-center bg-gray-50">
        <span className="text-sm w-4/5 ellipsis">{data.title}</span>
        <MoreOutlined className="w-5 h-5 rounded-full cursor-pointer hover:bg-gray-200 hover:text-blue-700 pt-0.5" />
      </section>
      <section className="p-4">
        <div className="flex gap-2 justify-between mb-4 items-end">
          <div className="flex items-center">
            <img src={data.image} alt="" className="w-8 h-8 inline-block mr-2" />
            <span className="inline-block">
              <div className="text-gray-400 text-xs">{data.auther}</div>
              <div className="text-gray-700 text-xs">
                最近更新：
                {data.time}
              </div>
            </span>
          </div>
          <span className="text-xs text-white h-5 py-0.5 px-2 bg-orange-500 scale-90">{data.tag}</span>
        </div>
        <div className="flex gap-2 text-center border-gray-200 border-solid border-b pb-4 justify-between w-full">
          <section className="px-8 py-2 text-sm bg-gray-50 rounded flex-1">
            <span className="text-blue-700 text-xl">{data.count}</span>
            <div className="text-gray-400 text-xs mt-1">检测次数</div>
          </section>
          <section className="px-8 py-2 text-sm bg-gray-50 rounded flex-1">
            <span className="text-blue-700 text-xl">{data.scene}</span>
            <div className="text-gray-400 text-xs mt-1">检测次数</div>
          </section>
        </div>
      </section>
      <section className="px-4 pb-4">
        <section className="text-xs h-15 line-clamp-3 mb-4 text-gray-500 leading-5">{data.desc}</section>
        <Button type="primary" icon={<FileSearchOutlined />} onClick={() => toggleDetail(data)} className="w-full">
          查看详情
        </Button>
      </section>
    </div>
  );
}
