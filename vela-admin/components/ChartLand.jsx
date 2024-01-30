import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
var weekday = require('dayjs/plugin/weekday');
dayjs.extend(weekday);

import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

import {
	getAllLand,
	getBuyLandLatest,
	getLandSupply,
	getLandByMonth,
	getBuyLandWalletSummary
} from "/utils/models/Land";

import Config from "/configs/config";

export default function ChartLand(props) {

	const [loading, setLoading] = useState(false);

	let years = [ "2022" ];
	let months = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];

	const [labels, setLabels] = useState([ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ]);
	const [datasets, setDatasets] = useState([
		{
			label: "Land",
			data: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
			backgroundColor: ["rgba(237, 188, 13, 1)"],
			borderRadius: Number.MAX_VALUE,
			barPercentage: 0.4,
		}
	]);
	const chartData = {
		labels: labels,
		datasets: datasets,
	};

	const init = async () => {

		setLoading(true)

		const rs_years = await Promise.all(
			years.map(async (year, i_year) => {
				const rs_months = await Promise.all(
					months.map(async (month, i_month) => {
						let rs = await getLandByMonth(
							Config.LAND_YAAMO_ADDR,
							year,
							month
						);
						return rs.length;
					})
				);

				return rs_months;
			})
		);
		setDatasets([
			{
				label: "Land",
				data: rs_years[0],
				backgroundColor: ["rgba(237, 188, 13, 1)"],
				borderRadius: Number.MAX_VALUE,
				barPercentage: 0.4,
			}
		]);

		setLoading(false)

	};

	useEffect(() => {
		init();
	}, []);

	return (
		<>
			<div className="relative layout06">
				{(loading) && 
					<div className="panel-loading">
						<i className="fa fa-spinner fa-spin"></i>
					</div>
				}
				<Bar
					data={chartData}
					width={500}
					height={400}
					options={{
						maintainAspectRatio: false,
						plugins: {
							datalabels: {
								display: true,
								color: "white",
								formatter: Math.round,
								anchor: "end",
								offset: -20,
								align: "start",
							},
						},
					}}
				/>
			</div>
		</>
	)
}
