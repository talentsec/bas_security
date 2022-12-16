import React, { useState, createContext } from "react";
import { HomeOutlined, MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PoweroffOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, Modal, Result, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "@icon/logo.svg";
import { useAuth } from "@/hooks/auth";

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
    getItem("攻击场景", "/app/my/scenario"),
    getItem("攻击任务", "/app/my/job")
  ]),
  getItem("所有", "all", <MailOutlined />, [
    getItem("攻击向量", "/app/all/vector"),
    getItem("攻击场景", "/app/all/scenario"),
    getItem("任务模版", "/app/all/job")
  ])
];

interface LogoutModal {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
}
const LogoutModal: React.FC<LogoutModal> = ({ open, onCancel, onOk }) => {
  return (
    <Modal title="" open={open} onCancel={onCancel} footer={null} closable={false}>
      <Result
        status="warning"
        subTitle="您确定要退出登录吗？"
        extra={
          <div>
            <Button key="console" className="mr-4" onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" danger key="console" onClick={onOk}>
              确定
            </Button>
          </div>
        }
      />
      <div></div>
    </Modal>
  );
};

type LayoutProps = {
  children: React.ReactNode;
};
const BaseLayout = ({ children }: LayoutProps) => {
  const Location = useLocation();
  const Navigator = useNavigate();
  const [, logout] = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [initPath] = useState(Location.pathname);

  const handleSelectedChanged = ({ key }: any) => {
    Navigator(`${key}`);
  };

  const handleLogout: React.MouseEventHandler = e => {
    e.stopPropagation();
    toggleModalDisplay();
  };

  const confirmLogout = () => {
    logout();
  };

  const toggleModalDisplay = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Layout className="h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        theme="light"
        trigger={
          collapsed ? (
            <span className="text-lg">
              <MenuUnfoldOutlined />
            </span>
          ) : (
            <span className="mb-4">
              <div className="flex justify-between w-full px-7">
                <span className="text-red-500 hover:scale-105" onClick={handleLogout}>
                  <PoweroffOutlined className="mr-2" />
                  退出登录
                </span>
                <MenuFoldOutlined className="text-lg" />
              </div>
            </span>
          )
        }
        onCollapse={value => setCollapsed(value)}
      >
        <div className="h-14 flex w-full justify-center p-5 text-xl items-center gap-2 italic">
          <Logo />
          BAS
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={[initPath]}
          mode="inline"
          items={items}
          onSelect={handleSelectedChanged}
        />
      </Sider>
      <Layout className="h-screen site-layout">
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <div className="h-14 bg-white flex-shrink-0"></div>
        <LayoutContext.Provider value={collapsed}>
          <Content>{children}</Content>
        </LayoutContext.Provider>
      </Layout>
      <LogoutModal open={modalOpen} onOk={confirmLogout} onCancel={toggleModalDisplay}></LogoutModal>
    </Layout>
  );
};

export const LayoutContext = createContext(false);
export default BaseLayout;
