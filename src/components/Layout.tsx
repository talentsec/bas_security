import React, { useState } from "react";
import { HomeOutlined, MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "@icon/logo.svg";

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("我的", "my", <HomeOutlined />, [
    getItem("攻击向量", "/app/my/vector"),
    getItem("攻击场景", "/app/my/scene"),
    getItem("攻击任务", "/app/my/job")
  ]),
  getItem("所有", "all", <MailOutlined />, [
    getItem("攻击向量", "/app/all/vector"),
    getItem("攻击场景", "/app/all/scene"),
    getItem("任务模版", "/app/all/job")
  ])
];

type LayoutProps = {
  children: React.ReactNode;
};

const BaseLayout = ({ children }: LayoutProps) => {
  const Location = useLocation();
  const Navigator = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [initPath] = useState(Location.pathname);

  const handleSelectedChanged = ({ key }: any) => {
    Navigator(`${key}`);
  };

  return (
    <Layout className="h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        theme="light"
        trigger={
          collapsed ? (
            <span className="text-lg flex justify-end px-7">
              <MenuUnfoldOutlined />
            </span>
          ) : (
            <span className="text-lg flex justify-end px-7">
              <MenuFoldOutlined />
            </span>
          )
        }
        onCollapse={value => setCollapsed(value)}
      >
        <div className="h-14 flex w-full justify-center p-5 text-xl">
          <Logo className=""></Logo>
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={[initPath]}
          mode="inline"
          items={items}
          onSelect={handleSelectedChanged}
        />
      </Sider>
      <Layout className="site-layout">
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <div className="h-14 bg-white"></div>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
