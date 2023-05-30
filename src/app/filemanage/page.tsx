"use client"

//a page to manage files in the server, including upload, download, delete, rename, move, copy, etc.use a table to display files and folders, and use a modal form to upload files
import { useState } from "react"
import { useRouter } from "next/router"
import { ProColumns, ProTable } from "@ant-design/pro-components"
import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-form"
import { i } from "@tauri-apps/api/event-30ea0228"
import { invoke } from "@tauri-apps/api/tauri"
import { useRequest } from "ahooks"
import { Button, message } from "antd"
import { Space, Table, Tag } from "antd"
import { Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { UserAccountNav } from "@/components/user-account-nav"
import account from "@/app/accountsmanage/page"
import NewFileForm from "./components/newfile"

interface file {
  name: string
  size: number
  md5: string
  key: string
  type: string
}

interface Result {
  list: file[]
  total: number
}

const columns: ProColumns<file>[] = [
  {
    title: "文件名",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
  },
  {
    title: "MD5",
    dataIndex: "md5",
    key: "md5",
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
  },
  // {
  // 	title: '操作',
  // 	key: 'action',
  // 	render: (text: string, record: any) => (
  // 		<Space size="middle">
  // 			<a>Invite {record.name}</a>
  // 			<a>Delete</a>
  // 		</Space>
  // 	),
  // },
]

const getTableData = async (): Promise<Result> => {
  //   const result = await invoke<Result>("get_files")
  //   const result_1 = JSON.parse(JSON.parse(JSON.stringify(result)))
  //   return {
  //     total: result_1.length,
  //     list: result_1,
  //   }
  //mock data
  return {
    total: 3,
    list: [
      {
        name: "test",
        size: 123,
        md5: "123",
        key: "123",
        type: "txt",
      },
      {
        name: "test1",
        size: 1232,
        md5: "123377",
        key: "12345",
        type: "txt",
      },
      {
        name: "test2",
        size: 12333,
        md5: "12337s7",
        key: "123455",
        type: "txt",
      },
    ],
  }
}
const FileManage = () => {
  const { data: session } = useSession()
  if (!session) return <h1>请先登录</h1>
  const user = session.user
  return (
    // <div className="container flex h-screen w-screen flex-col items-center justify-center">
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
      <div className=" w-full  rounded-md border">
        <ProTable<file>
          columns={columns}
          request={async () => {
            const res = await getTableData()
            // console.log(res);

            return {
              data: res.list,
              total: res.total,
              success: true,
            }
          }}
          toolBarRender={() => [<NewFileForm />]}
          rowKey="name"
          search={false}
          pagination={{
            showQuickJumper: true,
          }}
          dateFormatter="string"
        />
      </div>
    </>
  )
}

export default FileManage
