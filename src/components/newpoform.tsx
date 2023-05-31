import { useRef } from "react"
import { DownOutlined, PlusOutlined } from "@ant-design/icons"
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components"
import { invoke } from "@tauri-apps/api/tauri"
import { Button, Form, message } from "antd"
// import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const newPurchase = async (po) => {
  const res = await invoke("new_purchase", po)
  console.log(res)
  return res
}
const NewPoForm = () => {
  const formRef = useRef<ProFormInstance>()

  const onFill = () => {
    formRef?.current?.setFieldsValue({})
  }
  const [form] = Form.useForm<{
    purchase_id: number
    purchase_time: string
    worker_id: number
    pay_status: string
    key: string
  }>()
  return (
    <ModalForm
      title="新建采购订单"
      trigger={
        <Button className="flex w-fit">
          新建采购
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
          placeholder="采购单号"
        />

        <ProFormDateRangePicker name="expectTime" label="预计到货时间" />
      </ProForm.Group>
      <ProFormText
        width="md"
        name="createtime"
        label="创建时间"
        placeholder="请输入名称"
      />
      <ProForm.Group></ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          params={{}} // 传递给后端的参数
          request={async (params) => {
            const res1 = await invoke("getGoodsList")
            const res2 = JSON.parse(JSON.parse(JSON.stringify(res1)))
            const res3 = res2.data.map((item) => {
              console.log(item)
              return {
                label: item.goods_name,
                value: item.goods_id,
              }
            })
            return res3
          }}
          width="sm"
          name="goods_choose"
          label="商品选择"
        />

        <ProFormText
          width="sm"
          name="total_money"
          label="总金额"
          placeholder={"￥"}
        />
      </ProForm.Group>
    </ModalForm>
  )
}
export default NewPoForm
