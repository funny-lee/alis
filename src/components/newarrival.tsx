// import arrival from "../arrival";
let a = {
  warehouse_id: 1,
  arrival_id: 1,
  arrival_time: "2021-01-01",
  arrival_total_batch: 1,
  arrival_batch: 1,
  purchase_id: 1,
  key: "1",
};

import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ProTable,
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import {
  Space,
  Table,
  Tag,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
const NewArrivalForm = () => {
  const [form] = Form.useForm<{
    purchase_id: number;
    purchase_time: string;
    worker_id: number;
    pay_status: string;
    key: string;
  }>();
  return (
    <ModalForm
      title="新建预期到货"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          预期到货
        </Button>
      }
      form={form}
      autoFocusFirstInput
      initialValues={{ purchase_id: 123456789 }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log("run"),
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        console.log(values);
        message.success("提交成功");
        return true;
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

        <ProFormText width="md" name="contract" label="到货单号" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          request={async () => [
            {
              value: "chapter",
              label: "订单111",
            },
          ]}
          width="sm"
          name="useMode"
          label="采购订单"
        />

        <ProFormText width="sm" name="id" label="到货情况" />
      </ProForm.Group>
    </ModalForm>
  );
};
export default NewArrivalForm;
