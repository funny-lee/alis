import React, { useState } from "react"
import { ModalForm, ProFormText } from "@ant-design/pro-components"
import ProTable, { ProColumns } from "@ant-design/pro-table"
import { invoke } from "@tauri-apps/api/tauri"
import { useRequest } from "ahooks"
import { Button, Form, message } from "antd"
import { ChevronDown, Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { UserAccountNav } from "@/components/user-account-nav"
import worker from "@/app/workermanage/page"

const NewWorkerForm = () => {
  const [form] = Form.useForm<{
    worker_name: string
    worker_phone: string
    worker_address: string
    warehouse_id: number
    email: string
    key: string
  }>()

  return (
    <ModalForm
      title="新建员工"
      trigger={
        <Button className="flex w-fit">
          <Plus className="m-auto h-4 w-4" />
          员工
        </Button>
      }
      form={form}
      autoFocusFirstInput
      submitter={{
        submitButtonProps: {
          style: {
            backgroundColor: "#1890ff",
          },
        },
      }}
      initialValues={{ worker_name: "张三" }}
      onFinish={async (values) => {
        await invoke("new_worker", values)
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
        name="worker_name"
        label="员工姓名"
        placeholder="请输入员工姓名"
      />
      <ProFormText
        width="md"
        name="worker_phone"
        label="员工电话"
        placeholder="请输入员工电话"
      />
      <ProFormText
        width="md"
        name="worker_address"
        label="员工地址"
        placeholder="请输入员工地址"
      />
      <ProFormText
        width="md"
        name="warehouse_id"
        label="所属仓库编号"
        placeholder="请输入所属仓库编号"
      />
      <ProFormText
        width="md"
        name="email"
        label="员工邮箱"
        placeholder="请输入员工邮箱"
      />
    </ModalForm>
  )
}

export default NewWorkerForm
