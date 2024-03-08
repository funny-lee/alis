"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ActionType,
  PageContainer,
  ParamsType,
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
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import domtoimage from "dom-to-image"
import JsBarcode from "jsbarcode"
import { Redo, Search } from "lucide-react"
import { useSession } from "next-auth/react"
import { DOMParser,DOMImplementation, XMLSerializer } from "@xmldom/xmldom"
import { string } from "zod"
import { exportWordDocx } from "@/lib/printdocx"
import NewPoForm from "@/components/newpoform"
import { UserAccountNav } from "@/components/user-account-nav"

const { Option } = Select
const imgwidth = 200 // Replace with the desired width of the image
const imgheight = 100 // Replace with the desired height of the image
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
const blob2Url = (blob: Blob) => {
  return URL.createObjectURL(blob)
}

const getTableData = async (): Promise<Result> => {
  const res = await invoke("show_purchase")
  const res_1 = JSON.parse(JSON.parse(JSON.stringify(res)))
  return {
    total: res_1.length,
    list: res_1,
  }
}

const getTableDataWithParams = async (params: ParamsType): Promise<Result> => {
  console.log(params.startTime)
  if (params.startTime === undefined || params.endTime === undefined) {
    params.startTime = "2021-01-01"
    params.endTime = "2023-12-31"
  }
  dayjs.extend(utc)
  const realParams = {
    po: {
      worker_id: Number(params.worker_id),
      // pay_status: params.pay_status,
      purchase_id: Number(params.purchase_id),
      start_time: dayjs.utc(params.startTime).format(),
      end_time: dayjs.utc(params.endTime).format(),
    },
  }
  console.log(realParams)
  const res = await invoke("query_purchase", realParams)
  const res_1 = JSON.parse(JSON.parse(JSON.stringify(res)))

  console.log(params)
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
    render: (time) => (
      <text>{dayjs.utc(time).format("YYYY-MM-DD").toString()}</text>
    ),
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
        <Tag color="green">已支付</Tag>
      ) : (
        <Tag color="volcano">未支付</Tag>
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
  let [items, setItems] = useState<po_short[]>([])
  let [detail_items, setDetailItems] = useState<po_detail[]>([])
  const { data: session, status } = useSession()
  const actionRef = useRef<ActionType>()
  const xmlSerializer = new XMLSerializer()
  const document = new DOMImplementation().createDocument(null, "svg", null)
  // const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg")

  let date = new Date()
  let data2print = {
    // imglist: [],
    imgUrl: "",
    purchaseid: "SE1214514",
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    supplier_name: "食品公司",
    po_details: [
      {
        purchase_id: 846532,
        purchase_time: "2021-10-10",
        worker_id: 1,
        pay_status: "Paid",
        goods_id: 12,
        goods_name: "手机壳",
        goods_size: "小",
        goods_num: 100,
        goods_note: "适用于华为mate10",
        goods_price: 20,
        goods_total: 2000,
      },
      {
        purchase_id: 123499789,
        purchase_time: "2022-03-19",
        worker_id: 19,
        pay_status: "Paid",
        goods_id: 4,
        goods_name: "音响",
        goods_size: "中",
        goods_num: 10,
        goods_price: 100,
        goods_total: 1000,
      },
    ],
    checker: "检查员1",
    waremanager: "张三",
    manager: "刘北",
    total_price: 3000,
  }
  JsBarcode(document.documentElement, data2print.purchaseid.toString(), {
    xmlDocument: document,
    // width: 1,
    height: 80,
  })

  const svgText = xmlSerializer.serializeToString(document)

  const svgElement = new DOMParser().parseFromString(
    svgText,
    "image/svg+xml"
  ).documentElement

  domtoimage
    .toPng(svgElement, {
      quality: 1.0,
      width: imgwidth * 2,
      height: imgheight * 2,
      imagePlaceholder: "/assets/placeholder.png",
    })
    .then((dataUrl) => {
      console.log(dataUrl)
      // data2print.imglist.push({ imgUrl: dataUrl })
      data2print.imgUrl = dataUrl
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error)
    })

  if (!session) {
    return <p>加载中</p>
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
          params={{}}
          actionRef={actionRef}
          request={async (params = {}, sort, filter) => {
            // console.log(params.startTime)

            if (
              (typeof params.purchase_id === undefined &&
                typeof params.worker_id === undefined &&
                typeof params.startTime === undefined &&
                typeof params.endTime === undefined) ||
              params.purchase_id === "" ||
              params.worker_id === ""
            ) {
              const res = await getTableData()
              res.total = res.list.length

              return {
                data: res.list,
                total: res.total,
                success: true,
              }
            } else {
              const res = await getTableDataWithParams(params)
              res.total = res.list.length

              return {
                data: res.list,
                total: res.total,
                success: true,
              }
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
            // console.log(selectedRowKeys, selectedRows)
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
