import React, { useState, useCallback } from "react"
import { Breadcrumb, Input, Select, Drawer, Button, Tooltip, Table, Spin } from "antd"
import { Icon } from "@iconify/react"
import SearchIcon from "@iconify/icons-icon-park-outline/search"
import { PlusOutlined, CloseOutlined, SelectOutlined } from "@ant-design/icons"
import TemplateIcon from "@/assets/template.svg"
import TemplateCard from "./TemplateCard"
import type { ColumnsType } from "antd/es/table"

const mockData = {
  title: "主机命令-使用保留名称和备用数爽肤水大是大非上发生的",
  image: "",
  auther: "admin",
  time: "2022-03-19",
  count: "1",
  tag: "自定义",
  scene: "2",
  desc: "此验证动作还原了AI攻防机器人使用称为文件Windows NT 文件系统功能和一个保留的文件名来隐藏可执行文件。与使用备用数据流(ADS)的其他验证验证动作不…",
  link: ""
}

const mockList = [
  "Log4Shell (CVE-2021-44228) 基于签名的网页请求（多个负载）L基于签名的网页请求（多个负载）Lo…",
  "Log4Shell (CVE-2021-44228) 基于签名的网页请求（多个负载）Lo…"
]

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
}

const columns: ColumnsType<DataType> = [
  {
    title: "关联任务",
    dataIndex: "name",
    render: record => {
      return <span className="text-xs">{record}</span>
    }
  },
  {
    title: "最后运行时间",
    dataIndex: "age",
    render: record => {
      return <span className="text-xs">{record}</span>
    }
  },
  {
    title: "防御状态",
    dataIndex: "address",
    render: record => {
      return <span className="text-xs">{record}</span>
    }
  }
]

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park"
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park"
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park"
  }
]

const DrawerTitle = ({ data, close }: any) => {
  return (
    <div className="flex justify-between items-center">
      <section className="flex items-center">
        <img src={data.img} alt="" className="w-10 h-10 mr-4" />
        <div className="w-full ">
          <Tooltip title={data.title}>
            <div className="w-4/5 ellipsis">{data.title}</div>
          </Tooltip>
          <div className="text-xs text-gray-400 mt-1">{data.auther}</div>
        </div>
      </section>
      <span onClick={close}>
        <CloseOutlined className="text-sm text-gray-500 cursor-pointer hover:text-blue-600" />
      </span>
    </div>
  )
}

export default function Template() {
  const [detailDisplay, setDetailDisplay] = useState(false)
  const [curTemplate, setCurTemplate] = useState(null)

  const toggleDetail = useCallback((template: any) => {
    setCurTemplate(template)
    setDetailDisplay(true)
  }, [])

  const closeDetail = () => {
    setDetailDisplay(false)
  }

  return (
    <div className="h-full flex flex-col">
      <Breadcrumb>
        <Breadcrumb.Item>攻击任务</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">任务模版</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="bg-white rounded-lg mt-3 flex-1 px-4 py-6">
        <section className="flex gap-4">
          <span className="flex-1 gray-back">
            <Input placeholder="搜索关键词" suffix={<Icon icon={SearchIcon} />} />
          </span>
          <span className="flex gap-4 gray-back">
            <Select
              labelInValue
              defaultValue={{
                value: "lucy",
                label: "Lucy (101)"
              }}
              style={{
                width: 120
              }}
              options={[
                {
                  value: "jack",
                  label: "Jack (100)"
                },
                {
                  value: "lucy",
                  label: "Lucy (101)"
                }
              ]}
            />
          </span>
        </section>
        <section className="flex items-center bg-gray-50 w-48 text-sm px-5 py-4 my-4 rounded-md hover:scale-105 cursor-pointer">
          <img src={TemplateIcon} />
          <span className="mr-10 ml-2">新建任务</span>
          <PlusOutlined />
        </section>
        <section>
          <TemplateCard data={mockData} toggleDetail={toggleDetail}></TemplateCard>
        </section>
      </div>
      <Drawer
        width={560}
        placement="right"
        closable={false}
        destroyOnClose
        title={<DrawerTitle data={curTemplate} close={closeDetail} />}
        footer={
          <span className="float-right">
            <Button onClick={closeDetail} className="mr-2">
              取消
            </Button>
            <Button type="primary">创建任务</Button>
          </span>
        }
        open={detailDisplay}
      >
        {curTemplate ? (
          <div>
            <section className="p-4 bg-gray-50 leading-6 text-gray-500 text-xs rounded-lg">
              <section className="text-sm mb-3 text-black">描述</section>
              {curTemplate?.desc}
            </section>
            <section className="mt-8 shadow">
              <div className="py-3 px-4 bg-gray-50">
                攻击场景
                {curTemplate!.scene}
              </div>
              {mockList.map((item, key) => {
                return (
                  <div key={key} className="px-4 py-3 w-full flex border-b">
                    <span className="flex-1 ellipsis mr-8 text-xs">{item}</span>
                    <SelectOutlined className="cursor-pointer hover:text-blue-500" />
                  </div>
                )
              })}
            </section>
            <Table columns={columns} dataSource={data} size="small" pagination={false} className="mt-8" />
          </div>
        ) : (
          <Spin />
        )}
      </Drawer>
    </div>
  )
}
