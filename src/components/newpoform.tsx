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
// import { Button } from "@/components/ui/button"
import { PlusCircle, PlusCircleIcon } from "lucide-react";
const NewPoForm = () => {
	const [form] = Form.useForm<{
		purchase_id: number;
		purchase_time: string;
		worker_id: number;
		pay_status: string;
		key: string;
	}>();
	return (
		<ModalForm
			title="新建采购订单"
			trigger={
				<Button  className="w-fit flex">
					新建采购<PlusOutlined className="h-4 w-4 m-auto" />
					
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

				{/* <ProFormText
					width="md"
					name="contract"
					label="创建时间"
					placeholder="请输入名称"
				/> */}
				<ProFormDateRangePicker name="contractTime" label="预计到货时间" />
			</ProForm.Group>
			<ProForm.Group>
				<ProFormSelect
					request={async () => [
						{
							value: "chapter",
							label: "商品1",
						},
					]}
					width="sm"
					name="useMode"
					label="商品选择"
				/>

				<ProFormText width="sm" name="id" label="总金额" placeholder={"￥"} />
			</ProForm.Group>
		</ModalForm>
	);
};
export default NewPoForm;
