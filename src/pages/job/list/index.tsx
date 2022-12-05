import React from 'react'
import { Breadcrumb, Input, Select } from 'antd';
import { PlusOutlined, ProfileFilled } from '@ant-design/icons'
import { Icon } from '@iconify/react'
import SearchIcon from '@iconify/icons-icon-park-outline/search'

import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '模版',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '资产',
    dataIndex: 'address',
    key: 'address',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '运行次数',
    dataIndex: 'address',
    key: 'address',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '创建时间',
    dataIndex: 'address',
    key: 'address',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '最后运行时间',
    dataIndex: 'address',
    key: 'address',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '防御',
    dataIndex: 'address',
    key: 'address',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '侦查',
    dataIndex: 'address',
    key: 'address',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];


export default function JobList() {
  return (
    <div className='h-full flex flex-col'>
      <Breadcrumb>
        <Breadcrumb.Item>攻击任务</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">任务列表</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className='bg-white rounded-lg mt-3 flex-1 px-4 py-6'>
        <section className='flex gap-4'>
          <span className='flex-1 gray-back'>
            <Input
              placeholder="搜索关键词"
              suffix={
                <Icon icon={SearchIcon} />
              }
            />
          </span>
          <span className='flex gap-4 gray-back'>
            <Select
              labelInValue
              defaultValue={{ value: 'lucy', label: 'Lucy (101)' }}
              style={{ width: 120 }}
              options={[
                {
                  value: 'jack',
                  label: 'Jack (100)',
                },
                {
                  value: 'lucy',
                  label: 'Lucy (101)',
                },
              ]}
            />
            <Select
              labelInValue
              defaultValue={{ value: 'lucy', label: 'Lucy (101)' }}
              style={{ width: 120 }}
              options={[
                {
                  value: 'jack',
                  label: 'Jack (100)',
                },
                {
                  value: 'lucy',
                  label: 'Lucy (101)',
                },
              ]}
            />
          </span>

        </section>
        <section className='flex items-center bg-gray-50 w-48 text-sm px-5 py-4 my-4 rounded-md hover:scale-105 cursor-pointer'>
          <ProfileFilled className="text-orange-500 " />
          <span className='mr-10 ml-2'>
            新建任务
          </span>
          <PlusOutlined />
        </section>
        <section>
          <Table size="small" columns={columns} dataSource={data} />
        </section>
      </div>
    </div>
  )
}
