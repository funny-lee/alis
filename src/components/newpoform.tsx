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

interface GoodsData {
  label: string
  value: number
  price: number
  supplier_id: number
}
interface SupplierData {
  label: string
  value: number
}
const getNewPurchaseId = async () => {
  const res = await invoke("get_new_purchase_id")
  console.log(res)
  return res
}

const NewPoForm = () => {
  const [goodsdata, setGoodsData] = useState<GoodsData[]>([])
  const [goodsdatapersupplier, setGoodsDataPerSupplier] = useState<GoodsData[]>(
    []
  )
  const [newId, setNewId] = useState(0)
  useEffect(() => {
    const fetchNewId = async () => {
      let id = await getNewPurchaseId()
      setNewId(id)
    }
    fetchNewId().catch((err) => {
      console.log(err)
    })
  }, [])
  const [supplierdata, setSupplierData] = useState<SupplierData[]>([])
  useEffect(() => {
    const fetchDataOfGoods = async () => {
      const res1 = await invoke("show_goods")
      const res2 = JSON.parse(JSON.parse(JSON.stringify(res1)))

      const res3 = res2.reduce(
        (
          acc: GoodsData[],
          cur: {
            goods_name: any
            goods_id: any
            goods_price: any
            supplier_id: any
          }
        ) => {
          acc.push({
            label: cur.goods_name,
            value: cur.goods_id,
            price: cur.goods_price,
            supplier_id: cur.supplier_id,
          })
          return acc
        },
        []
      )
      console.log(res3)
      setGoodsData(res3)
    }
    fetchDataOfGoods().catch((err) => {
      console.log(err)
    })
  }, [])
  useEffect(() => {
    const fetchDataOfSupplier = async () => {
      const res1 = await invoke("show_all_supplier")
      const res2 = JSON.parse(JSON.parse(JSON.stringify(res1)))
      console.log(res2)
      const res3 = res2.reduce(
        (
          acc: SupplierData[],
          cur: { supplier_name: any; supplier_id: any }
        ) => {
          acc.push({
            label: cur.supplier_name,
            value: cur.supplier_id,
          })
          return acc
        },
        []
      )
      console.log(res3)
      setSupplierData(res3)
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
  const [supplierChosed, setSupplierChosed] = useState<SupplierData>()
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
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms,
            <Button
              key="extra-reset"
              onClick={() => {
                props.reset()
              }}
            >
              重置
            </Button>,
          ]
        },
      }}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log("run"),
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        console.log(values)
        let po_short = {
          purchase_id: Number(values.purchase_id) + 1,
          purchase_time: new Date().toISOString(),
          worker_id: 1,
          pay_status: "Unpaid",
        }
        let po_details = values.goods_choose_list.map((item) => {
          return {
            purchase_id: Number(values.purchase_id) + 1,
            goods_id: item.goods_choose,
            goods_num: Number(item.goods_num),
            goods_name: goodsdata.find((v) => v.value === item.goods_choose)
              ?.label,
            item_id: 22,
          }
        })
        console.log({
          po: { po_details, po_short },
        })

        invoke("new_purchase", {
          po: { po_details, po_short },
        })

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
          readonly
          initialValue={newId}
        />

        {/* <ProFormDateRangePicker name="expectTime" label="预计到货时间" /> */}
      </ProForm.Group>

      <ProForm.Group>
        <ProFormText
          width="md"
          name="worker_id"
          label="工号"
          disabled
          initialValue={1}
        />
        <ProFormSelect
          width="md"
          name="supplier_id"
          label="供应商"
          request={async () => {
            return supplierdata
          }}
          onChange={(value: { value: string; label: React.ReactNode }) => {
            console.log(value)
            setSupplierChosed(
              supplierdata.find((v) => v.value === Number(value.value))
            )
          }}
          initialValue={supplierdata}
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
                Number(cur.goods_num) *
                goodsdata.find((v) => v.value === cur.goods_choose)?.price
              return acc
            }, 0)
          return <Form.Item label="总价：">{total}</Form.Item>
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
          <ProFormDependency name={["supplier_id"]} ignoreFormListField>
            {({ supplier_id }) => {
              if (!supplier_id) {
                return null
              }
              return (
                <ProFormSelect
                  params={{}} // 传递给后端的参数
                  onChange={(value: {
                    value: string
                    label: React.ReactNode
                  }) => {
                    setNowId(Number(value))

                    setGoodsChosed({
                      price: goodsdata.find((value) => value.value === nowId)
                        ?.price,
                    })
                    console.log(value)
                  }}
                  // initialValue={async () => {
                  //   return goodsdata.filter(
                  //     (item) => item.supplier_id === Number(supplier_id)
                  //   )
                  // }}
                  width="sm"
                  request={async () => {
                    console.log(goodsdata)
                    return goodsdata.filter(
                      (item) => item.supplier_id === Number(supplier_id)
                    )
                  }}
                  name="goods_choose"
                  label="商品名称"
                />
              )
            }}
          </ProFormDependency>
          <ProFormDependency name={["goods_choose"]}>
            {({ goods_choose }) => {
              if (!goods_choose) {
                return null
              }

              return (
                <Form.Item label="单价">
                  {goodsdata.find((v) => v.value === goods_choose)?.price}
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
