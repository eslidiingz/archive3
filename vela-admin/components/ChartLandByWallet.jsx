import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
var weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday);

import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

import {
	getBuyLandWalletSummary
} from "/utils/models/Land";

import Config from "/configs/config";

export default function ChartLandByWallet(props) {

	const [loading, setLoading] = useState(false);

	const contractAddresses = {
		yaamo: Config.LAND_YAAMO_ADDR,
		sut: Config.LAND_SUT_ADDR,
		oldtown: Config.LAND_OLDTOWN_ADDR
	};
	const [selectedTab, setSelectedTab] = useState("yaamo");

	const [labels, setLabels] = useState([]);
	const [datasets, setDatasets] = useState([
		{
			label: "Wallet",
			data: [],
			backgroundColor: ["rgba(237, 188, 13, 1)"],
			borderRadius: Number.MAX_VALUE,
			barPercentage: 0.4,
		}
	]);
	const chartData = {
		labels: labels,
		datasets: datasets
	};

	const handleFetch = async () => {

		let contractAddress = contractAddresses[selectedTab]

		setLoading(true)

		let res = await getBuyLandWalletSummary(contractAddress);
		res = res.slice(0,10)

		let labels = await Promise.all(res.map(async (item, index) => {
			return item.wallet
		}));
		setLabels(labels);

		let datas = await Promise.all(res.map(async (item, index) => {
			return item.amount
		}));
		let backgroundColors = await Promise.all(res.map(async (item, index) => {
			return ( item.creator_type == "official" ) ? "rgba(237, 188, 13, 1)" : "rgba(0, 252, 178, 1)"
		}));

		setDatasets([
			{
				label: "Official",
				data: datas,
				backgroundColor: backgroundColors,
				borderRadius: Number.MAX_VALUE,
				barPercentage: 0.4,
			}
		]);

		setLoading(false)

	}

	const init = async () => {
		await handleFetch()
	}

	useEffect(() => {
		init();
	}, []);

	useEffect(() => {
		init();
	}, [selectedTab]);

	return (
		<>
			<div className="bg-sub-content table-custom land relative">
				{(loading) && 
					<div className="panel-loading">
						<i className="fa fa-spinner fa-spin"></i>
					</div>
				}
				<div className="flex justify-between p-4">
					<h3 className="font-header">Top 10 Land Owners</h3>
					<div className="pl-4 grow flex items-center">
						<div
							className={`table-tab ${selectedTab == "yaamo" && "active"}`}
							onClick={(e) => setSelectedTab("yaamo")}
						>Yaamo</div>
						<div
							className={`table-tab ${selectedTab == "sut" && "active"}`}
							onClick={(e) => setSelectedTab("sut")}
						>Sut</div>
						<div
							className={`table-tab ${selectedTab == "oldtown" && "active"}`}
							onClick={(e) => setSelectedTab("oldtown")}
						>Oldtown</div>
					</div>
					<div className="pl-4 flex items-center">
						<div style={{
							width: "20px", height: "20px",
							backgroundColor: "rgba(237, 188, 13, 1)"
						}}></div>
						&nbsp;Official
						&nbsp;&nbsp;&nbsp;
						<div style={{
							width: "20px", height: "20px",
							backgroundColor: "rgba(0, 252, 178, 1)"
						}}></div>
						&nbsp;Creator
					</div>
				</div>
				<div className="relative p-4 pt-0">
					<Bar
						data={chartData}
						width={500}
						height={500}
						options={{
							indexAxis: 'y',
							maintainAspectRatio: false,
							plugins: {
								legend: {
									display: false
								},
								datalabels: {
									display: true,
									color: "black",
									formatter: Math.round,
									anchor: "end",
									offset: 0,
									align: "start",
								},
							},
						}}
					/>
				</div>
			</div>
		</>
	)
}
