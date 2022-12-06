import React, { useState } from "react";
import { Menu } from "antd";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("Navigation One", "sub1", <MailOutlined />),

  getItem("Navigation Two", "sub2", <AppstoreOutlined />),

  getItem("Navigation Three", "sub4", <SettingOutlined />)
];

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: MainLayoutProps) {
  const [open, setOpen] = useState(false);

  const onClick: MenuProps["onClick"] = e => {
    console.log("click ", e);
  };

  return (
    <div className="w-screen h-screen ">
      <section className="w-full h-12 border-b flex justify-between p-3">
        <div>logo</div>
        <div>
          <MailOutlined />
          <MailOutlined />
          <MailOutlined />
        </div>
      </section>
      <section
        className="h-fit flex"
        style={{
          height: "calc(100vh - 48px)"
        }}
      >
        <div className="h-full">
          <Menu
            onClick={onClick}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
            style={{
              width: open ? "260px" : "70px",
              transform: "all"
            }}
            className="w-7 h-full"
          />
          {/* <div onClick={() => setOpen(!open)}>change</div> */}
        </div>
        <div className="flex-1">{children}</div>
      </section>
    </div>
  );
}
