import React, { useState, useContext, useEffect } from "react";
import { Drawer } from "antd";
import { LayoutContext } from "./Layout";

const DEFAULT_WIDTH = 640;

interface SiteDrawerPropsType {
  open: boolean;
  onClose: () => void;
  title?: string;
  destroyOnClose?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  extra?: React.ReactNode;
}
const SiteDrawer = ({ open, onClose, title, destroyOnClose = true, children, extra, footer }: SiteDrawerPropsType) => {
  const [widthMap, setWidthMap] = useState<Record<string, number>>({});

  const isExpand = !useContext(LayoutContext);

  useEffect(() => {
    const width: number = document.querySelector(".site-layout")?.clientWidth || DEFAULT_WIDTH;
    if (isExpand) {
      setWidthMap({
        isExpand: width,
        notExpand: width + 120
      });
    } else {
      setWidthMap({
        isExpand: width - 120,
        notExpand: width
      });
    }
  }, []);

  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={open}
      destroyOnClose={destroyOnClose}
      width={widthMap[isExpand ? "isExpand" : "notExpand"] || DEFAULT_WIDTH}
      mask={false}
      getContainer=".site-layout"
      extra={extra}
      footer={footer}
      contentWrapperStyle={{
        boxShadow: "none",
        borderLeft: "1px solid rgba(0,0,0,.1)"
      }}
      bodyStyle={{
        padding: "0px"
      }}
    >
      {children}
    </Drawer>
  );
};

export default SiteDrawer;
