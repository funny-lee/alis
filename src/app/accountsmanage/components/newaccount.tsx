"use client"

//a modal form use proform to add new a new account
import { useState } from "react"
import { useRouter } from "next/router"
import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-form"
import { invoke } from "@tauri-apps/api/tauri"
import { useRequest } from "ahooks"
import { Button, message } from "antd"
import { Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { UserAccountNav } from "@/components/user-account-nav"
import account from "@/app/accountsmanage/page"

const NewAccountForm = () => {
  const [form] = ProForm.useForm<{
    account_name: string
    account_password: string
    account_email: string
    account_type: string
    key: string
  }>()
  const { data: session } = useSession()

  //   const [visible, setVisible] = useState(false)
  //   const { run } = useRequest(
  //     async (values) => {
  //       await invoke("new_account", values)
  //       message.success("提交成功")
  //       return true
  //     },
  //     {
  //       manual: true,
  //       onSuccess: () => {
  //         setVisible(false)
  //         router.push("/accountsmanage/page")
  //       },
  //     }
  //   )
  return (
    <>
      <ModalForm
        title="新建账户"
        trigger={
          <Button className="flex w-fit">
            <Plus className="m-auto h-4 w-4" />
            账户
          </Button>
        }
        form={form}
        submitter={{
          submitButtonProps: {
            style: {
              backgroundColor: "#1890ff",
            },
          },
        }}
        onFinish={async (values) => {
          //   await run(values)
          message.success("提交成功")
          return true
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log("run"),
        }}
        submitTimeout={2000}
      >
        <ProFormText
          width="md"
          name="account_name"
          label="账户名"
          placeholder="请输入账户名"
        />
        <ProFormText.Password
          width="md"
          name="account_password"
          label="账户密码"
          placeholder="请输入账户密码"
        />
        <ProFormText
          width="md"
          name="account_email"
          label="账户邮箱"
          placeholder="请输入账户邮箱"
        />
        <ProFormText
          width="md"
          name="account_type"
          label="账户类型"
          placeholder="请输入账户类型"
        />
      </ModalForm>
    </>
  )
}

export default NewAccountForm
