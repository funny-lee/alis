"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  GithubFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
} from "@ant-design/icons"
import { DownOutlined, PlusOutlined } from "@ant-design/icons"
import {
  PageContainer,
  ProCard,
  ProColumns,
  ProLayout,
  ProSettings,
} from "@ant-design/pro-components"
import { ProTable } from "@ant-design/pro-components"
import { invoke } from "@tauri-apps/api/tauri"
import { useAntdTable, useRequest } from "ahooks"
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd"
import type { ColumnsType } from "antd/es/table"
import Dropdown from "antd/lib/dropdown/dropdown"
import { useSession } from "next-auth/react"
import NewPoForm from "@/components/newpoform"
import { UserAccountNav } from "@/components/user-account-nav"

const { Option } = Select

// import BasicLayout from "../app/BasicLayout";
interface po_short {
  purchase_id: number
  purchase_time: string
  worker_id: number
  pay_status: string
  key: string
  po_details: po_detail[]
}
interface po_detail {
  purchase_id: number
  item_id: number
  goods_id: number
  goods_num: number
}
interface Result {
  total: number
  list: po_short[]
}
const getTableData = async (): Promise<Result> => {
  const res = await invoke("show_purchase")
  const res_1 = JSON.parse(JSON.parse(JSON.stringify(res)))
  return {
    total: res_1.length,
    list: res_1,
  }
}

const columns: ProColumns<po_short>[] = [
  Table.SELECTION_COLUMN,
  Table.EXPAND_COLUMN,
  {
    title: "采购单号",
    dataIndex: "purchase_id",
    key: "purchase_id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "采购时间",
    dataIndex: "purchase_time",
    key: "purchase_time",
    sorter: (a, b) => a.purchase_time.localeCompare(b.purchase_time),
  },
  {
    title: "采购员工号",
    dataIndex: "worker_id",
    key: "worker_id",
  },
  {
    title: "支付状态",
    dataIndex: "pay_status",
    key: "pay_status",
    render: (pay_status) =>
      pay_status === "Paid" ? (
        <Tag color="green">{pay_status}</Tag>
      ) : (
        <Tag color="volcano">{pay_status}</Tag>
      ),
  },
]

const PO = () => {
  const { data: session, status } = useSession()

  //   if (status === "authenticated") {
  //     return <p>Signed in as {session.user.email}</p>
  //   }

  if (!session) {
    return <p>You need to sign in first</p>
  }
  const user = session.user
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="h-2 w-full">
        <div className="container absolute right-4 top-4  md:right-6 md:top-6">
          <UserAccountNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
          />
        </div>
      </div>
      <div className=" flex w-full flex-col rounded-md border  ">
        <ProTable<po_short>
          columns={columns}
          bordered
          request={async (params = {}, sort, filter) => {
            const res = await getTableData()
            // console.log(res);

            return {
              data: res.list,
              total: res.total,
              success: true,
            }
          }}
          rowKey="purchase_id"
          search={false}
          pagination={{
            showQuickJumper: true,
          }}
          dateFormatter="string"
          headerTitle="采购表"
          editable={{
            type: "multiple",
          }}
          rowSelection={{
            // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
            // 注释该行则默认不显示下拉选项
            // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            defaultSelectedRowKeys: [],
          }}
          tableAlertRender={({
            selectedRowKeys,
            selectedRows,
            onCleanSelected,
          }) => {
            console.log(selectedRowKeys, selectedRows)
            return (
              <Space size={20}>
                <span>
                  已选 {selectedRowKeys.length} 项
                  <a className="ms-2" onClick={onCleanSelected}>
                    取消选择
                  </a>
                </span>
                {/* <span>{`容器数量: ${selectedRows.reduce(
              (pre, item) => pre + 1,
              0,
            )} 个`}</span> */}
              </Space>
            )
          }}
          tableAlertOptionRender={() => {
            return (
              <Space size={16}>
                <a>批量删除</a>
                <a>导出数据</a>
              </Space>
            )
          }}
          toolBarRender={() => [
            <Button key="show">查看日志</Button>,
            <Button key="out">
              导出数据
              <DownOutlined />
            </Button>,
            <NewPoForm key={"newpoform"} />,
          ]}
          expandable={{
            expandedRowRender: (record) => {
              console.log(record)
              return (
                <ProTable<po_detail>
                  columns={[
                    {
                      title: "序号",
                      dataIndex: "item_id",
                      key: "item_id",
                    },
                    {
                      title: "商品编号",
                      dataIndex: "goods_id",
                      key: "goods_id",
                    },
                    {
                      title: "商品数量",
                      dataIndex: "goods_num",
                      key: "goods_num",
                    },
                  ]}
                  dataSource={record.po_details}
                  headerTitle={false}
                  search={false}
                  options={false}
                  pagination={false}
                />
              )
            },
          }}
        />
      </div>
    </div>
  )
}

const ShowPO = () => {
  return <PO />
}
export default ShowPO
