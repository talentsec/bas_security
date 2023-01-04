import React, { useState } from "react";
import { Divider, Drawer, Spin } from "antd";
import { useQuery } from "react-query";
import { GetVectorVersionDetail } from "@/api/vector";

interface DetailDrawerPropsType {
  id?: number;
  open: boolean;
  onClose: () => void;
}

export default function DetailDrawer({ id, open, onClose }: DetailDrawerPropsType) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ResponseType.GetVectorVersionDetailContent | null>(null);

  useQuery(["vector-version-detail"], () => GetVectorVersionDetail(String(id)), {
    select: data => {
      return data.data;
    },
    enabled: !!id,
    onSuccess: data => {
      setIsLoading(false);
      if (data) {
        setData(data);
      } else {
        // Noop
      }
    },
    onError: () => {
      setIsLoading(false);
    }
  });

  return (
    open &&
    data && (
      <Drawer title="向量详情" width={600} open={open} maskClosable={false} onClose={onClose} destroyOnClose>
        {isLoading ? (
          <Spin></Spin>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            <section>名称：{data.name}</section>
            <section>版本：{data.version}</section>
            <section>适用平台{data.platform}</section>
            <section>向量描述：{data.remark || "--"}</section>
            <section>执行权限：{data.roleType === "ADMIN" ? "管理员权限" : "普通权限"}</section>
            <section>ATT&CK ID：{data.attCkID}</section>
            <section>ATT&CK 归类：{data.attCkCategory}</section>
            <section>执行方式：{data.execMode === "LOCAL" ? "本地执行" : "远程执行"}</section>
            <section>靶场地址：{data.targetRangeURL || "--"}</section>
            {data.contents.map((item, key) => {
              return (
                <div className="flex flex-col gap-4" key={key}>
                  <Divider></Divider>
                  <section>文件存放路径；{item.filePath}</section>
                  <section>操作系统：{item.os}</section>
                  <section>操作系统版本；{item.osVersion.join("、")}</section>
                  <section>操作系统体系结构；{item.osArch.join("、")}</section>
                  <section>输入配置：</section>
                  <section>
                    {item.inputConfig.content.map((item, key) => {
                      return <div key={key}>9</div>;
                    })}
                  </section>
                </div>
              );
            })}
          </div>
        )}
      </Drawer>
    )
  );
}
