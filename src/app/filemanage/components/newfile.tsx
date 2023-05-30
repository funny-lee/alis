//a modal form to upload a new file, including a file input and a text input for the file name
// import { useState } from "react"
import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-form"
import { useRequest } from "ahooks"
import { Button, Form, message } from "antd"
import { Space, Table, Tag } from "antd"
import { Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { UserAccountNav } from "@/components/user-account-nav"
import account from "@/app/accountsmanage/page"
import file from "@/app/filemanage/page"

const NewFileForm = () => {
  const [form] = Form.useForm<{
    name: string
    size: number
    md5: string
    key: string
    type: string
  }>()
  return (
    <ModalForm
      title="上传文件"
      trigger={
        <Button className="flex w-fit">
          上传文件
          <Plus className="m-auto h-4 w-4" />
        </Button>
      }
      form={form}
      autoFocusFirstInput
      initialValues={{ name: "test" }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log("run"),
      }}
      submitter={{
        submitButtonProps: {
          style: {
            backgroundColor: "#1890ff",
          },
        },
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        console.log(values)
        message.success("提交成功")
        return true
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="name"
          label="文件名"
          tooltip="文件名"
          placeholder="文件名"
        />
        <ProFormText
          width="sm"
          name="size"
          label="文件大小"
          tooltip="文件大小"
          placeholder="文件大小"
        />
        <ProFormText
          width="sm"
          name="md5"
          label="文件MD5"
          tooltip="文件MD5"
          placeholder="文件MD5"
        />
        <ProFormText
          width="sm"
          name="key"
          label="文件key"
          tooltip="文件key"
          placeholder="文件key"
        />
        <ProFormText
          width="sm"
          name="type"
          label="文件类型"
          tooltip="文件类型"
          placeholder="文件类型"
        />
      </ProForm.Group>
    </ModalForm>
  )
}

export default NewFileForm
