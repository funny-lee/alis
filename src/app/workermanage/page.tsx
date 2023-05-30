"use client"

//a page to show all the workers of each warehouse,use ProTable to show the data,use ModalForm to add new worker
import { DownOutlined } from "@ant-design/icons"
import { ProColumns, ProTable } from "@ant-design/pro-components"
import { invoke } from "@tauri-apps/api/tauri"
import { useRequest } from "ahooks"
import { Button } from "antd"
import { ChevronDown } from "lucide-react"
import NewWorkerForm from "@/components/newworker"

interface worker {
  worker_id: number
  worker_name: string
  worker_phone: string
  worker_address: string
  warehouse_id: number
  email: string
  key: string
}
interface Result {
  total: number
  list: worker[]
}
const getTableData = async (): Promise<Result> => {
  const res = await invoke("show_all_worker")
  const res_1 = JSON.parse(JSON.parse(JSON.stringify(res)))
  return {
    total: res_1.length,
    list: res_1,
  }
}

const columns: ProColumns<worker>[] = [
  {
    title: "员工编号",
    dataIndex: "worker_id",
  },
  {
    title: "员工姓名",
    dataIndex: "worker_name",
  },
  {
    title: "员工电话",
    dataIndex: "worker_phone",
  },
  {
    title: "员工地址",
    dataIndex: "worker_address",
  },
  {
    title: "所属仓库编号",
    dataIndex: "warehouse_id",
  },
  {
    title: "员工邮箱",
    dataIndex: "email",
  },
]

const WorkerManage = () => {
  const { data, loading } = useRequest(getTableData)
  return (
    <>
      <ProTable<worker>
        columns={columns}
        dataSource={data?.list}
        loading={loading}
        search={false}
        pagination={{
          showQuickJumper: true,
        }}
        options={{
          search: {
            placeholder: "请输入员工编号/员工姓名",
            style: {
              width: "300px",
            },
          },
          fullScreen: true,
        }}
        toolBarRender={() => [
          <NewWorkerForm />,
          <Button key="3">导出数据</Button>,
        ]}
      />
    </>
  )
}

export default WorkerManage
