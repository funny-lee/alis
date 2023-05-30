"use client"

//a page to show and manage all the user's account,use ProTable to show the data,use ModalForm to add new account
import { DownOutlined } from "@ant-design/icons"
import { ProColumns, ProTable } from "@ant-design/pro-components"
import { invoke } from "@tauri-apps/api/tauri"
import { useRequest } from "ahooks"
import { Button } from "antd"
import { ChevronDown } from "lucide-react"
import { useSession } from "next-auth/react"
import { UserAccountNav } from "@/components/user-account-nav"
import NewAccountForm from "./components/newaccount"

interface account {
  account_id: number
  account_name: string
  account_password: string
  account_email: string
  account_type: string
  key: string
}

interface Result {
  total: number
  list: account[]
}
const getTableData = async (): Promise<Result> => {
  const res = await invoke("show_all_account")
  const res_1 = JSON.parse(JSON.parse(JSON.stringify(res)))
  return {
    total: res_1.length,
    list: res_1,
  }
}

const columns: ProColumns<account>[] = [
  {
    title: "账户编号",
    dataIndex: "account_id",
  },
  {
    title: "账户名",
    dataIndex: "account_name",
  },
  {
    title: "账户密码",

    dataIndex: "account_password",
  },
  {
    title: "账户邮箱",
    dataIndex: "account_email",
  },
  {
    title: "账户类型",
    dataIndex: "account_type",
  },
]

const AccountManage = () => {
  const { data, loading, refresh } = useRequest(getTableData)
  const { data: session } = useSession()
  if (!session) {
    return <p>请先登录</p>
  }
  const user = session.user
  return (
    <>
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
      <div className="flex flex-col items-center">
        <div className="flex w-11/12 flex-row justify-between">
          <h1 className="text-2xl font-semibold">账户管理</h1>
        </div>
        <div className="mt-4 w-11/12">
          <ProTable<account>
            columns={columns}
            request={async () => ({
              data: data?.list,
              total: data?.total,
              success: true,
            })}
            rowKey="key"
            toolBarRender={() => [
              <Button key="3">导出数据</Button>,
              <NewAccountForm />,
            ]}
            search={{
              filterType: "light",
            }}
            pagination={{
              pageSize: 10,
            }}
            options={{
              search: true,
            }}
            loading={loading}
          />
        </div>
      </div>
    </>
  )
}

export default AccountManage
