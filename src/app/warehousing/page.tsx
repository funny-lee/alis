"use client"

//入库单
import { DownOutlined } from "@ant-design/icons"
import { ProColumns, ProTable } from "@ant-design/pro-components"
import { invoke } from "@tauri-apps/api/tauri"
import { Button, Space } from "antd"
import { ChevronDown } from "lucide-react"
import { useSession } from "next-auth/react"
import { UserAccountNav } from "@/components/user-account-nav"
import NewWarehousing from "./components/newwarehousing"

interface warehousing {
  warehouse_id: number
  warehousing_id: number
  warehousing_time: string
  warehousing_total_batch: number
  po_id: number
  total_batch: number
  arrival_id: number
  key: string
}

interface Result {
  total: number
  list: warehousing[]
}
const getTableData = async (): Promise<Result> => {
  const res = await invoke("show_all_warehousing")
  const res_1 = JSON.parse(JSON.parse(JSON.stringify(res)))
  return {
    total: res_1.length,
    list: res_1,
  }
}

const columns: ProColumns<warehousing>[] = [
  {
    title: "入库单号",
    dataIndex: "warehousing_id",
    key: "warehousing_id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "预期入库时间",
    dataIndex: "warehousing_time",
    key: "warehousing_time",
    sorter: (a, b) => a.warehousing_time.localeCompare(b.warehousing_time),
  },
  {
    title: "入库总批次",
    dataIndex: "warehousing_total_batch",
    key: "warehousing_total_batch",
  },
  {
    title: "当前批次",
    dataIndex: "total_batch",
    key: "total_batch",
  },
  {
    title: "采购单号",
    dataIndex: "po_id",
    key: "po_id",
  },
  {
    title: "到货单号",
    dataIndex: "arrival_id",
    key: "arrival_id",
  },
]

const WarehousingPage = () => {
  const { data: session, status } = useSession()
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
        <ProTable<warehousing>
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
          search={{ labelWidth: "auto" }}
          pagination={{
            showQuickJumper: true,
          }}
          dateFormatter="string"
          headerTitle="入库表"
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
            <NewWarehousing key={"newwarehousing"} />,
          ]}
        />
      </div>
    </div>
  )
}

export default WarehousingPage
