"use client"
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import NewArrivalForm from "@/components/newarrival";

interface arrival {
	warehouse_id: number;
	arrival_id: number;
	arrival_time: string;
	arrival_total_batch: number;
	arrival_batch: number;
	purchase_id: number;
	key: string;
}
interface Result {
	total: number;
	list: arrival[];
}
const getTableData = async (): Promise<Result> => {
	const res = await invoke("show_all_arrival");
	const res_1 = JSON.parse(JSON.parse(JSON.stringify(res)));
	return {
		total: res_1.length,
		list: res_1,
	};
};

const columns: ProColumns<arrival>[] = [
	{
		title: "到货单号",
		dataIndex: "arrival_id",
		key: "arrival_id",
		render: (text) => <a>{text}</a>,
	},
	{
		title: "预期到货时间",
		dataIndex: "arrival_time",
		key: "arrival_time",
		sorter: (a, b) => a.arrival_time.localeCompare(b.arrival_time),
	},
	{
		title: "到货总批次",
		dataIndex: "arrival_total_batch",
		key: "arrival_total_batch",
	},
	{
		title: "到货当前批次",
		dataIndex: "arrival_batch",
		key: "arrival_batch",
	},
	{
		title: "采购单号",
		dataIndex: "purchase_id",
		key: "purchase_id",
	},
	{
		title: "仓库号",
		dataIndex: "warehouse_id",
		key: "warehouse_id",
	},
];

const ArrivalComp = () => {
	return (
		<div className=" mx-1  rounded-md my-1 h-screen bg-white bg-opacity-90">
			<ProTable<arrival>
				columns={columns}
				request={async (params = {}, sort, filter) => {
					const res = await getTableData();
					console.log(res);
					return {
						data: res.list,
						total: res.total,
						success: true,
					};
				}}
				rowKey="arrival_id"
				search={false}
				pagination={{
					pageSize: 5,
				}}
				options={false}
				dateFormatter="string"
				headerTitle="预期到货表"
				toolBarRender={() => [
					<Button key="show">查看日志</Button>,
					<Button key="out">
						导出数据
						<DownOutlined />
					</Button>,
					<NewArrivalForm key="showArrival" />,
				]}
			/>
		</div>
	);
};
const ShowArrival = () => {
	return (
		
			<ArrivalComp />
	
	);
};
export default ShowArrival;