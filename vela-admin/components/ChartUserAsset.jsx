import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
var weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday);

import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

import {
	number_comma,
	number_format,
	replaceRange
} from "/utils/global";

import {
	getAsset,
	getAssetSupply,
	getAssetSummary,
	getAssetByPage,
	syncAsset,
	getAssetsByPage,
	getAssetsByUserWallet
} from "/utils/models/GenerateNFT";

export default function ChartUserAsset(props) {

	const [loading, setLoading] = useState(false);

	const [labels, setLabels] = useState([]);
	const [datasets, setDatasets] = useState([
		{
			label: "Official",
			data: [],
			backgroundColor: ["rgba(237, 188, 13, 1)"],
			borderRadius: Number.MAX_VALUE,
			barPercentage: 0.4,
		}, {
			label: "Creator",
			data: [],
			backgroundColor: ["rgba(0, 252, 178, 1)"],
			borderRadius: Number.MAX_VALUE,
			barPercentage: 0.4,
		}
	]);
	const chartData = {
		labels: labels,
		datasets: datasets,
	};

	const handleFetchChart = async () => {

		setLoading(true)

		let minter = await getAssetsByUserWallet(0);
		minter = minter.filter((item, index) => { return item.sold_total > 1 })

		let labels = await Promise.all(minter.map(async (item, index) => {
			return item._id
		}));

		let datas = await Promise.all(minter.map(async (item, index) => {
			return item.sold_total
		}));

		let backgroundColors = await Promise.all(minter.map(async (item, index) => {
			return ( item.creator_type == "official" ) ? "rgba(237, 188, 13, 1)" : "rgba(0, 252, 178, 1)"
		}));

		setLabels(labels)
		setDatasets([
			{
				label: "Official",
				data: datas,
				backgroundColor: backgroundColors,
				borderRadius: Number.MAX_VALUE,
				barPercentage: 0.4,
			}
		])

		setLoading(false)

	}

	const init = async () => {
		await handleFetchChart();
	};

	useEffect(() => {
		init();
	}, []);

	return (
		<>
			<div className="bg-sub-content table-custom land relative">
				{(loading) && 
					<div className="panel-loading">
						<i className="fa fa-spinner fa-spin"></i>
					</div>
				}
				<div className="flex justify-between p-4">
					<h3 className="font-header">Asset Sale Summary By Wallet (Class)</h3>
					<div className="pl-4 grow flex items-center"></div>
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
						height={400}
						options={{
							indexAxis: 'y',
							maintainAspectRatio: false,
							plugins: {
								legend: {
									display: false
								},
								datalabels: {
									display: true,
									color: "white",
									formatter: Math.round,
									anchor: "end",
									offset: -40,
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
