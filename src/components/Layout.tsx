import React, { useState, createContext, useEffect } from "react";
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

const MenuPathList = [
  "/app/my/vector",
  "/app/my/scenario",
  "/app/my/template",
  "/app/all/vector",
  "/app/all/scenario",
  "/app/all/template"
];

const GetMatchPath = (path: string) => {
  const res = MenuPathList.find(item => path.startsWith(item));
  return res || MenuPathList[0];
};

const items: MenuProps["items"] = [
  getItem("我的", "my", <HomeOutlined />, [
    getItem("攻击向量", MenuPathList[0]),
    getItem("攻击场景", MenuPathList[1]),
    getItem("任务模板", MenuPathList[2])
  ]),
  getItem("所有", "all", <MailOutlined />, [
    getItem("攻击向量", MenuPathList[3]),
    getItem("攻击场景", MenuPathList[4]),
    getItem("任务模版", MenuPathList[5])
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
            <Button key="1" className="mr-4" onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" key="2" danger onClick={onOk}>
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
  const [selectedKey, setSelectedKey] = useState(GetMatchPath(Location.pathname));
  const [initPath] = useState<string>(GetMatchPath(Location.pathname));

  const handleSelectedChanged = ({ key }: any) => {
    setSelectedKey(key);
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

  useEffect(() => {
    setSelectedKey(GetMatchPath(Location.pathname));
    console.log(Location);
  }, [Location]);

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
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
          onSelect={handleSelectedChanged}
        />
      </Sider>
      <div className="h-screen site-layout w-full">
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <div className="h-14 bg-white"></div>
        <LayoutContext.Provider value={collapsed}>
          <Content style={{ height: "calc(100vh - 56px)" }} className="">
            {children}
          </Content>
        </LayoutContext.Provider>
      </div>
      <LogoutModal open={modalOpen} onOk={confirmLogout} onCancel={toggleModalDisplay}></LogoutModal>
    </Layout>
  );
};

export const LayoutContext = createContext(false);
export default BaseLayout;
