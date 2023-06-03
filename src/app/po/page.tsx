"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  GithubFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
} from "@ant-design/icons"
import { DownOutlined, PlusOutlined } from "@ant-design/icons"
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProLayout,
  ProSettings,
  TableDropdown,
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
import { Redo, Search } from "lucide-react"
import { useSession } from "next-auth/react"
import { exportWordDocx } from "@/lib/printdocx"
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
  goods_name: string
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
    filters: true,
    onFilter: true,
    key: "pay_status",
    render: (pay_status) =>
      pay_status === "Paid" ? (
        <Tag color="green">{pay_status}</Tag>
      ) : (
        <Tag color="volcano">{pay_status}</Tag>
      ),
  },
  {
    title: "操作",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <Button
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.purchase_id)
        }}
      >
        编辑
      </Button>,
      <Button key="view">查看</Button>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: "copy", name: "复制" },
          { key: "delete", name: "删除" },
        ]}
      />,
    ],
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    valueType: "dateRange",
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        }
      },
    },
  },
]
interface GoodsData {
  label: string
  value: string
}
const PO = () => {
  const { data: session, status } = useSession()
  const actionRef = useRef<ActionType>()
  //   if (status === "authenticated") {
  //     return <p>Signed in as {session.user.email}</p>
  //   }

  let date = new Date()
  if (!session) {
    return <p>加载中</p>
  }
  let data2print = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    purchase: [
      {
        purchase_id: 123456789,
        purchase_time: "2021-10-10",
        worker_id: 19,
        pay_status: "Paid",
        goods_id: 12,
        goods_name: "商品1",
        goods_num: 10,
        goods_price: 100,
        goods_total: 1000,
      },
      {
        purchase_id: 123499789,
        purchase_time: "2022-03-19",
        worker_id: 19,
        pay_status: "Paid",
        goods_id: 4,
        goods_name: "商品2",
        goods_num: 10,
        goods_price: 100,
        goods_total: 1000,
      },
    ],
    checker: "检查员1",
    waremanager: "张三",
    manager: "刘北",
  }
  const user = session.user
  return (
    <div className="container pt-10">
      <div className="h-2 w-full">
        <div className="container absolute right-4 top-4  md:right-6 md:top-6">
          <div className="absolute right-4 top-6">
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
            />
          </div>
        </div>
      </div>
      <div className="  w-full  rounded-md border  ">
        <ProTable<po_short>
          columns={columns}
          cardBordered
          actionRef={actionRef}
          request={async (params = {}, sort, filter) => {
            const res = await getTableData()
            console.log(params)
            res.list.filter((item) => {
              if (params.purchase_id !== null) {
                return item.purchase_id === params.purchase_id
              }
              if (params.worker_id !== null) {
                return item.worker_id === params.worker_id
              }

              return true
            })
            res.total = res.list.length
            console.log(res.list)

            return {
              data: res.list,
              total: res.total,
              success: true,
            }
          }}
          rowKey="purchase_id"
          search={{
            labelWidth: "auto",
            // filterType: "light",
            optionRender: ({ searchText }, { form }) => {
              // console.log(searchConfig, formProps, dom)
              return [
                <Button
                  key="reset"
                  icon={<Redo className="m-auto h-4 w-4" />}
                  onClick={() => {
                    form?.resetFields()
                  }}
                >
                  重置
                </Button>,
                <Button
                  key="sub"
                  icon={<Search className="m-auto h-4 w-4" />}
                  onClick={() => {
                    form?.submit()
                  }}
                >
                  {searchText}
                </Button>,
              ]
            },
          }}
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
            <Button
              key="print"
              onClick={() => {
                exportWordDocx("/caigou.docx", data2print, "caigoudan")
              }}
            >
              打印单据
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
                      title: "商品名称",
                      dataIndex: "goods_name",
                      key: "goods_name",
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
