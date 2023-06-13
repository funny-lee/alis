"use client"

import { use, useEffect, useRef, useState } from "react"
import { DownOutlined, PlusOutlined } from "@ant-design/icons"
import {
  FormListActionType,
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormGroup,
  ProFormInstance,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components"
import { invoke } from "@tauri-apps/api/tauri"
import { Button, Descriptions, Form, message } from "antd"
import { on } from "events"
// import { Button } from "@/components/ui/button"
import { Plus, PlusCircle, Smile, XCircle } from "lucide-react"
import { set } from "react-hook-form"

const newPurchase = async (po) => {
  const res = await invoke("new_purchase", po)
  console.log(res)
  return res
}
interface GoodsData {
  label: string
  value: number
  price: number
}
const NewPoForm = () => {
  const [goodsdata, setGoodsData] = useState<GoodsData[]>([])
  const [goodsdatapersupplier, setGoodsDataPerSupplier] = useState<GoodsData[]>(
    []
  )
  const [goodsdata1, setGoodsData1] = useState<any>([])
  useEffect(() => {
    const fetchDataOfSupplier = async () => {
      const res1 = await invoke("get_goods_by_supplier", { supplierId: 3 })
      const res2 = JSON.parse(JSON.parse(JSON.stringify(res1)))
      console.log(res2)
      setGoodsData1(res2)
      setGoodsTotalPrice(0)
      const res3 = res2.reduce(
        (
          acc: GoodsData[],
          cur: { goods_name: any; goods_id: any; goods_price: any }
        ) => {
          acc.push({
            label: cur.goods_name,
            value: cur.goods_id,
            price: cur.goods_price,
          })
          return acc
        },
        []
      )
      console.log(res3)
      setGoodsDataPerSupplier(res3)
    }

    fetchDataOfSupplier().catch((err) => {
      console.log(err)
    })
  }, [])

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
  const [goodsTotalPrice, setGoodsTotalPrice] = useState(0)
  const [nowId, setNowId] = useState(0)
  const [goodsChosed, setGoodsChosed] = useState<GoodsData>()
  const actionRef = useRef<
    FormListActionType<{
      name: string
      value: number
      price: number
    }>
  >()
  return (
    <ModalForm
      title="新建采购订单"
      trigger={
        <Button
          className=" w-fit"
          onClick={() => {
            setGoodsTotalPrice(0)
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          新建采购
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
        setGoodsTotalPrice(0)
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

      <ProForm.Group>
        <ProFormText
          width="md"
          name="worker_id"
          label="工号"
          disabled
          initialValue={1}
        />
      </ProForm.Group>
      <ProFormDependency name={["goods_choose_list"]}>
        {({ goods_choose_list }) => {
          if (!goods_choose_list) {
            return null
          }
          console.log(goods_choose_list)
          let total = goods_choose_list
            .filter((item) => item.goods_num !== undefined)
            .reduce((acc, cur) => {
              acc +=
                cur.goods_num *
                goodsdatapersupplier.find((v) => v.value === cur.goods_choose)
                  ?.price

              return acc
            }, 0)
          return <Form.Item label="总价">{total}</Form.Item>
        }}
      </ProFormDependency>
      <ProFormList
        name="goods_choose_list"
        label="商品选择列表"
        copyIconProps={{ Icon: Smile, tooltipText: "复制此行到末尾" }}
        deleteIconProps={{
          Icon: XCircle,
          tooltipText: "不需要这行了",
        }}
        creatorButtonProps={{
          creatorButtonText: "添加商品",
          icon: <Plus className="h-4 w-4" />,
        }}
      >
        <ProFormGroup key="group">
          <ProFormSelect
            params={{}} // 传递给后端的参数
            request={async () => {
              return goodsdatapersupplier
            }}
            onChange={(value: { value: string; label: React.ReactNode }) => {
              setNowId(Number(value))
              setGoodsChosed({
                ...value,
                price: goodsdatapersupplier.find(
                  (value) => value.value === nowId
                )?.price,
              })
              console.log(value)
            }}
            initialValue={goodsdatapersupplier}
            width="sm"
            name="goods_choose"
            label="商品名称"
          />
          <ProFormDependency name={["goods_choose"]}>
            {({ goods_choose }) => {
              if (!goods_choose) {
                return null
              }
              // console.log(
              //   goodsdatapersupplier.find((v) => v.value === goods_choose)
              //     ?.price
              // )

              return (
                <Form.Item label="单价">
                  {
                    goodsdatapersupplier.find((v) => v.value === goods_choose)
                      ?.price
                  }
                </Form.Item>
              )
            }}
          </ProFormDependency>
          {/* <ProFormText
            name="goods_price"
            label="单价"
            initialValue={goodsChosed?.price}
          /> */}
          <ProFormText
            name="goods_num"
            label="数量"
            fieldProps={{
              onChange: (e) => {
                console.log(actionRef.current?.getList())

                // setGoodsTotalPrice(
                //   actionRef.current?.getList()?.reduce((acc, cur) => {
                //     acc += cur.value * cur.price

                //     return acc
                //   }, 0)
                // )
              },
            }}
          />
        </ProFormGroup>
      </ProFormList>
    </ModalForm>
  )
}
export default NewPoForm
