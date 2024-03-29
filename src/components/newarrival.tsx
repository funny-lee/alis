import { useEffect, useState } from "react"
import { DownOutlined, PlusOutlined } from "@ant-design/icons"
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components"
import { invoke } from "@tauri-apps/api/tauri"
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
import { Plus } from "lucide-react"

// import arrival from "../arrival";
let arrivals = {
  warehouse_id: 1,
  arrival_id: 1,
  arrival_time: "2021-01-01",
  arrival_total_batch: 1,
  arrival_batch: 1,
  purchase_id: 1,
  key: "1",
}

const NewArrivalForm = () => {
  const [pos, setPos] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const res = await invoke("show_purchase")
      const res_1 = JSON.parse(JSON.parse(JSON.stringify(res)))
      return {
        total: res_1.length,
        list: res_1,
      }
    }
    fetchData().then((res) => {
      setPos(res.list)
    })
  }, [])

  const [form] = Form.useForm<{
    purchase_id: number
    purchase_time: string
    worker_id: number
    pay_status: string
    key: string
  }>()
  return (
    <ModalForm
      title="新建预期到货"
      trigger={
        <Button className="flex w-fit">
          <Plus className="m-auto h-4 w-4" />
          预期到货
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
      initialValues={{ purchase_id: 123456789 }}
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
          name="purchase_id"
          label="采购单号"
          tooltip="系统生成"
          placeholder="入库单号"
        />
        <ProFormSelect
          width="md"
          name="purchase_id"
          label="采购单号"
          request={() => {
            return pos.map((item) => {
              return {
                value: item.purchase_id,
                label: item.purchase_id,
              }
            })
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          request={async () => [
            {
              value: "2222",
              label: "订单111",
            },
          ]}
          width="sm"
          name="avbbd"
          label="采购订单"
        />

        <ProFormText width="sm" name="id" label="到货情况" />
      </ProForm.Group>
    </ModalForm>
  )
}
export default NewArrivalForm
