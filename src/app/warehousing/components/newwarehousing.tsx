import { DownOutlined, PlusOutlined } from "@ant-design/icons"
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components"
import { Button, Form, message } from "antd"
// import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import warehousing from "../page"

const NewWarehousing = () => {
  const [form] = Form.useForm<{
    warehouse_id: number
    warehousing_id: number
    warehousing_time: string
    warehousing_total_batch: number
    po_id: number
    total_batch: number
    arrival_id: number
    key: string
  }>()

  return (
    <ModalForm
      title="新建入库单"
      trigger={
        <Button className="flex w-fit">
          新建入库
          <PlusOutlined className="m-auto h-4 w-4" />
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
      autoFocusFirstInput
      initialValues={{ warehouse_id: 123456789 }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log("run"),
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
          name="warehouse_id"
          label="仓库号"
          tooltip="仓库号"
          placeholder="仓库号"
        />
        <ProFormText
          width="sm"
          name="warehousing_id"
          label="入库单号"
          tooltip="入库单号"
          placeholder="入库单号"
        />
        <ProFormText
          width="sm"
          name="warehousing_time"
          label="预期入库时间"
          tooltip="预期入库时间"
          placeholder="预期入库时间"
        />
        <ProFormText
          width="sm"
          name="warehousing_total_batch"
          label="入库总批次"
          tooltip="入库总批次"
          placeholder="入库总批次"
        />
        <ProFormText
          width="sm"
          name="po_id"
          label="采购单号"
          tooltip="采购单号"
          placeholder="采购单号"
        />
        <ProFormText
          width="sm"
          name="total_batch"
          label="当前批次"
          tooltip="当前批次"
          placeholder="当前批次"
        />
        <ProFormText
          width="sm"
          name="arrival_id"
          label="到货单号"
          tooltip="到货单号"
          placeholder="到货单号"
        />
      </ProForm.Group>
    </ModalForm>
  )
}

export default NewWarehousing
