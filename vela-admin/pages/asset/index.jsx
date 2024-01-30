import Mainlayout from "/components/layouts/Mainlayout";
import TableAsset from "/components/TableAsset";
import TableUserAsset from "/components/TableUserAsset";
import ChartUserAsset from "/components/ChartUserAsset";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
var weekday = require('dayjs/plugin/weekday')
dayjs.extend(weekday)

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
import CsvExport from "components/CsvExport";

function Dashboard() {

	const [labels, setLabels] = useState([ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ]);
	const [datasets, setDatasets] = useState([
		{
			label: "Official",
			data: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
			backgroundColor: ["rgba(237, 188, 13, 1)"],
			borderRadius: Number.MAX_VALUE,
			barPercentage: 0.4,
		}, {
			label: "Creator",
			data: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
			backgroundColor: ["rgba(0, 252, 178, 1)"],
			borderRadius: Number.MAX_VALUE,
			barPercentage: 0.4,
		}
	]);
	const chartData = {
		labels: labels,
		datasets: datasets,
	};
	const [loadings, setLoadings] = useState({
		summary: true,
		chart: true,
		form: true,
	})

	const [summary, setSummary] = useState({
		selectedTab: "all",
		dateStart: dayjs().format("YYYY-MM-DD"),
		dateEnd: dayjs().format("YYYY-MM-DD"),
		official: {
			rs: [],
			minted: 0,
			verified: 0,
			non_verified: 0,
			sold: 0
		},
		creator: {
			rs: [],
			minted: 0,
			verified: 0,
			non_verified: 0,
			sold: 0
		},
	});

	const handleFetchChart = async () => {

		let res_summary = await getAssetSummary();
		let asset_official = res_summary.filter((item) => item.creator_type === "official");
		let asset_creator = res_summary.filter((item) => item.creator_type === "creator");

		let labels = []
		let datas = [];

		let result_official = []
		let result_creator = []

		if( summary.selectedTab == "all" || summary.selectedTab == "between" ){

			labels = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ]
			datas = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];

			result_official = await Promise.all(
				datas.map(async (month, i_month) => {
					return asset_official.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-"+month)) > -1 ).length
				})
			);
			// console.log("%c === result_official === ", "color: orange", result_official)

			result_creator = await Promise.all(
				datas.map(async (month, i_month) => {
					return asset_creator.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-"+month)) > -1 ).length
				})
			);
			// console.log("%c === result_creator === ", "color: orange", result_creator)

		}else if( summary.selectedTab == "this_month" ){

			let dateStart = dayjs().format(`01`);
			let dateEnd = dayjs().endOf('month').format(`DD`);
			for( var i = parseInt(dateStart); i <= parseInt(dateEnd); i++ ){
				let day = i
				if( day.toString().length < 2 ) day = "0" + day
				datas.push(day)
			}
			labels = datas

			result_official = await Promise.all(
				datas.map(async (day, i_day) => {
					return asset_official.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-MM-"+day)) > -1 ).length
				})
			);
			// console.log("%c === result_official === ", "color: orange", result_official)

			result_creator = await Promise.all(
				datas.map(async (day, i_day) => {
					return asset_creator.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-MM-"+day)) > -1 ).length
				})
			);
			// console.log("%c === result_creator === ", "color: orange", result_creator)

		}else if( summary.selectedTab == "this_week" ){

			labels = [];
			datas = [];

			let dateStart = dayjs().weekday(0);
			let dateEnd = dayjs().weekday(6);
			while( dateStart <= dateEnd ){
				datas.push(dateStart.format(`YYYY-MM-DD`))
				dateStart = dateStart.add(1, 'day')
			}
			labels = datas

			result_official = await Promise.all(
				datas.map(async (day, i_day) => {
					return asset_official.filter((item) => day == item.asset.createdAt.substring(0, 10) ).length
				})
			);
			// console.log("%c === result_official === ", "color: orange", result_official)

			result_creator = await Promise.all(
				datas.map(async (day, i_day) => {
					return asset_creator.filter((item) => day == item.asset.createdAt.substring(0, 10) ).length
				})
			);
			// console.log("%c === result_creator === ", "color: orange", result_creator)

		}else if( summary.selectedTab == "today" ){

			labels = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24" ];
			datas = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24" ];

			result_official = await Promise.all(
				datas.map(async (hour, i_hour) => {
					return asset_official.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-MM-DDT"+hour+":")) > -1 ).length
				})
			);
			// console.log("%c === result_official === ", "color: orange", result_official)

			result_creator = await Promise.all(
				datas.map(async (hour, i_hour) => {
					return asset_creator.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-MM-DDT"+hour+":")) > -1 ).length
				})
			);
			// console.log("%c === result_creator === ", "color: orange", result_creator)

		}

		setLabels(labels)
		setDatasets([
			{
				label: "Official",
				data: result_official,
				backgroundColor: ["rgba(237, 188, 13, 1)"],
				borderRadius: Number.MAX_VALUE,
				barPercentage: 0.4,
			}, {
				label: "Creator",
				data: result_creator,
				backgroundColor: ["rgba(0, 252, 178, 1)"],
				borderRadius: Number.MAX_VALUE,
				barPercentage: 0.4,
			}
		])

	}

	const handleFetchSummary = async () => {

		let res_summary = await getAssetSummary();
		let asset_official = res_summary.filter((item) => item.creator_type === "official");
		let asset_creator = res_summary.filter((item) => item.creator_type === "creator");

		if( summary.selectedTab == "today" ){
			asset_official = asset_official.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-MM-DD")) > -1 );
			asset_creator = asset_creator.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-MM-DD")) > -1 );
		}else if( summary.selectedTab == "this_week" ){

			let datas = []

			let dateStart = dayjs().weekday(0);
			let dateEnd = dayjs().weekday(6);
			while( dateStart <= dateEnd ){
				datas.push(dateStart.format(`YYYY-MM-DD`))
				dateStart = dateStart.add(1, 'day')
			}

			asset_official = asset_official.filter((item) => datas.includes(item.asset.createdAt.substring(0, 10)) );
			asset_creator = asset_creator.filter((item) => datas.includes(item.asset.createdAt.substring(0, 10)) );

		}else if( summary.selectedTab == "this_month" ){
			asset_official = asset_official.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-MM")) > -1 );
			asset_creator = asset_creator.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-MM")) > -1 );
		}else if( summary.selectedTab == "this_year" ){
			asset_official = asset_official.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-MM")) > -1 );
			asset_creator = asset_creator.filter((item) => item.asset.createdAt.indexOf(dayjs().format("YYYY-MM")) > -1 );
		}else if( summary.selectedTab == "between" ){

			asset_official = asset_official.filter((item) => {
				return (
					dayjs(item.asset.createdAt) >= dayjs(summary.dateStart) && 
					dayjs(item.asset.createdAt) <= dayjs(summary.dateEnd)
				)
			});

			asset_creator = asset_creator.filter((item) => {
				return (
					dayjs(item.asset.createdAt) >= dayjs(summary.dateStart) && 
					dayjs(item.asset.createdAt) <= dayjs(summary.dateEnd)
				)
			});

		}

		setSummary((prevState) => ({
			...prevState,
			official: {

				rows: asset_official,

				minted: asset_official.length,
				minted_on_sale: asset_official.filter((item) => parseFloat(item.asset.data.price) > 0 ).length,
				minted_price: asset_official.reduce((element, item) => parseFloat(element) + parseFloat(item.asset.data.price), 0),

				verified: asset_official.filter((item) => item.asset.verify == "Y").length,
				verified_on_sale: asset_official.filter((item) => item.asset.verify == "Y" && parseFloat(item.asset.data.price) > 0 ).length,
				verified_price: asset_official.filter((item) => item.asset.verify == "Y").reduce((element, item) => parseFloat(element) + parseFloat(item.asset.data.price), 0),

				non_verified: asset_official.filter((item) => item.asset.verify != "Y").length,
				non_verified_on_sale: asset_official.filter((item) => item.asset.verify != "Y" && parseFloat(item.asset.data.price) > 0 ).length,
				non_verified_price: asset_official.filter((item) => item.asset.verify != "Y").reduce((element, item) => parseFloat(element) + parseFloat(item.asset.data.price), 0),

				sold: asset_official.filter((item) => item.asset.data.sold_status ).length,
				sold_on_sale: asset_official.filter((item) => item.asset.data.sold_status && parseFloat(item.asset.data.price) > 0 ).length,
				sold_price: asset_official.filter((item) => item.asset.data.sold_status ).reduce((element, item) => parseFloat(element) + parseFloat(item.asset.data.price), 0)

			},
			creator: {

				rows: asset_creator,

				minted: asset_creator.length,
				minted_on_sale: asset_creator.filter((item) => parseFloat(item.asset.data.price) > 0 ).length,
				minted_price: asset_creator.reduce((element, item) => parseFloat(element) + parseFloat(item.asset.data.price), 0),

				verified: asset_creator.filter((item) => item.asset.verify == "Y").length,
				verified_on_sale: asset_creator.filter((item) => item.asset.verify == "Y" && parseFloat(item.asset.data.price) > 0 ).length,
				verified_price: asset_creator.filter((item) => item.asset.verify == "Y").reduce((element, item) => parseFloat(element) + parseFloat(item.asset.data.price), 0),

				non_verified: asset_creator.filter((item) => item.asset.verify != "Y").length,
				non_verified_on_sale: asset_creator.filter((item) => item.asset.verify != "Y" && parseFloat(item.asset.data.price) > 0 ).length,
				non_verified_price: asset_creator.filter((item) => item.asset.verify != "Y").reduce((element, item) => parseFloat(element) + parseFloat(item.asset.data.price), 0),

				sold: asset_creator.filter((item) => item.asset.data.sold_status ).length,
				sold_on_sale: asset_creator.filter((item) => item.asset.data.sold_status && parseFloat(item.asset.data.price) > 0 ).length,
				sold_price: asset_creator.filter((item) => item.asset.data.sold_status ).reduce((element, item) => parseFloat(element) + parseFloat(item.asset.data.price), 0)

			}
		}));

	};

	const init = async () => {

		// SYNC LASTEST ASSETS
		await syncAsset();

		// SYNC ALL ASSETS

		// let size = 500;
		// await syncAsset(1,size);

		// let size = 500;
		// await syncAsset(1,size);
		// await syncAsset(2,size);
		// await syncAsset(3,size);
		// await syncAsset(4,size);
		// ค่อยๆ ทำทีละ 500 เดี๋ยว api มัน out of resource

		setLoadings((prevState) => ({ ...prevState, summary: true }));
		await handleFetchSummary();
		setLoadings((prevState) => ({ ...prevState, summary: false }));

		setLoadings((prevState) => ({ ...prevState, chart: true }));
		await handleFetchChart();
		setLoadings((prevState) => ({ ...prevState, chart: false }));

	};

	const handleNavChange = async (selectedTab) => {
		setSummary((prevState) => ({
			...prevState,
			selectedTab: selectedTab
		}));
	}

	const handleFilter = async () => {

		setLoadings((prevState) => ({ ...prevState, summary: true }));
		await handleFetchSummary();
		setLoadings((prevState) => ({ ...prevState, summary: false }));

		setLoadings((prevState) => ({ ...prevState, chart: true }));
		await handleFetchChart();
		setLoadings((prevState) => ({ ...prevState, chart: false }));

	}

	useEffect(() => {
		handleFilter();
	}, [summary.selectedTab, summary.dateStart, summary.dateEnd]);

	useEffect(() => {
		init();
	}, []);

	return (
		<>
			<div className="container mx-auto">

				<div className="flex justify-between mb-4">
					<div className="text-primary text-3xl">Asset dashboard</div>
					<div className="flex items-center"><CsvExport /></div>
				</div>

				<div className="row">

					{/* Nav tabs */}
					<div className="grid gap-1">
						<div className="nav nav-tabs flex" role="tablist">

							<div
								className={`nav-link btn01 text02 cursor-pointer ${summary.selectedTab == "all" ? "active" : ""}`}
								onClick={(e) => { handleNavChange("all") }}
							>All</div>

							<div
								className={`nav-link btn01 text02 cursor-pointer ${summary.selectedTab == "this_month" ? "active" : ""}`}
								onClick={(e) => { handleNavChange("this_month") }}
							>This month</div>

							<div
								className={`nav-link btn01 text02 cursor-pointer ${summary.selectedTab == "this_week" ? "active" : ""}`}
								onClick={(e) => { handleNavChange("this_week") }}
							>This week</div>

							<div
								className={`nav-link btn01 text02 cursor-pointer ${summary.selectedTab == "today" ? "active" : ""}`}
								onClick={(e) => { handleNavChange("today") }}
							>Today</div>

							<div
								className={`nav-link btn01 text02 cursor-pointer ${summary.selectedTab == "between" ? "active" : ""}`}
								onClick={(e) => { handleNavChange("between") }}
							>Between</div>

							{(summary.selectedTab == "between") && <>
								<div className="flex justify-center items-center">
									<input
										type="date"
										className="form-control block w-full px-0 py-0 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
										placeholder="Mint date"
										name="dateStart"
										value={summary.dateStart}
										onChange={(event) => {
											setSummary((prevState) => ({
												...prevState,
												[event.target.name]: event.target.value
											}));
										}}
									/>
									<div>&nbsp;&nbsp;TO&nbsp;&nbsp;</div>
									<input
										type="date"
										className="form-control block w-full px-0 py-0 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
										placeholder="Mint date"
										name="dateEnd"
										value={summary.dateEnd}
										onChange={(event) => {
											setSummary((prevState) => ({
												...prevState,
												[event.target.name]: event.target.value
											}));
										}}
									/>
								</div>
							</>}

						</div>
					</div>
					{/* Nav tabs End */}

					<div className="grid grid-cols-2 gap-3 layout01">

						{/* Asset Official */}
						<div className="layout02 relative">
							{(loadings.summary) && 
								<div className="panel-loading">
									<i className="fa fa-spinner fa-spin"></i>
								</div>
							}
							<div className="flex justify-between items-center text-3xl mb-2">
								<div className="flex">
									<img
										className="mr-1"
										src="/assets/images/icons/land.svg"
										alt="land-icon"
									/>
									<span>Assets Official</span>
								</div>
								{/* <div>{number_comma(assets.supply)}</div> */}
							</div>
							<div className="text-lg">
								<div className="flex justify-between">
									<div style={{ width: "31%" }}>Type</div>
									<div className="text-right" style={{ width: "23%" }}>Amount (Asset)</div>
									<div className="text-right" style={{ width: "23%" }}>On Sale (Asset)</div>
									<div className="text-right" style={{ width: "23%" }}>Price (Class)</div>
								</div>
								<div className="flex justify-between">
									<div style={{ width: "31%" }}>Total Minted</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.minted)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.minted_on_sale)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.minted_price)}</div>
								</div>
								<div className="flex justify-between">
									<div style={{ width: "31%" }}>Total Verified</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.verified)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.verified_on_sale)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.verified_price)}</div>
								</div>
								<div className="flex justify-between">
									<div style={{ width: "31%" }}>Total Non verify</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.non_verified)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.non_verified_on_sale)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.non_verified_price)}</div>
								</div>
								<div className="flex justify-between">
									<div style={{ width: "31%" }}>Total Sold</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.sold)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.sold_on_sale)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.official.sold_price)}</div>
								</div>
							</div>
						</div>
						{/* Asset Official End */}

						{/* Asset Creator */}
						<div className="layout03 relative">
							{(loadings.summary) && 
								<div className="panel-loading">
									<i className="fa fa-spinner fa-spin"></i>
								</div>
							}
							<div className="flex justify-between items-center text-3xl mb-2">
								<div className="flex">
									<img
										className="mr-1"
										src="/assets/images/icons/land.svg"
										alt="land-icon"
									/>
									<span>Assets Creator</span>
								</div>
								{/* <div>{number_comma(assets.supply)}</div> */}
							</div>
							<div className="text-lg">
								<div className="flex justify-between">
									<div style={{ width: "31%" }}>Type</div>
									<div className="text-right" style={{ width: "23%" }}>Amount (Asset)</div>
									<div className="text-right" style={{ width: "23%" }}>On Sale (Asset)</div>
									<div className="text-right" style={{ width: "23%" }}>Price (Class)</div>
								</div>
								<div className="flex justify-between">
									<div style={{ width: "31%" }}>Total Minted</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.minted)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.minted_on_sale)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.minted_price)}</div>
								</div>
								<div className="flex justify-between">
									<div style={{ width: "31%" }}>Total Verified</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.verified)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.verified_on_sale)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.verified_price)}</div>
								</div>
								<div className="flex justify-between">
									<div style={{ width: "31%" }}>Total Non verify</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.non_verified)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.non_verified_on_sale)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.non_verified_price)}</div>
								</div>
								<div className="flex justify-between">
									<div style={{ width: "31%" }}>Total Sold</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.sold)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.sold_on_sale)}</div>
									<div className="text-right" style={{ width: "23%" }}>{number_comma(summary.creator.sold_price)}</div>
								</div>
							</div>
						</div>
						{/* Asset Creator End */}

					</div>

					{/* GRAPH */}
					<div className="bg-sub-content table-custom land relative">
						{(loadings.chart) && 
							<div className="panel-loading">
								<i className="fa fa-spinner fa-spin"></i>
							</div>
						}
						<div className="flex justify-between p-4">
							<h3 className="font-header">Asset Mint Summary By Wallet (Asset)</h3>
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
											offset: -20,
											align: "start",
										},
									},
								}}
							/>
						</div>
					</div>
					{/* GRAPH END */}

					<div className="grid grid-cols-1 gap-4 py-4">
						<div><ChartUserAsset /></div>
						<div><TableUserAsset /></div>
						<div><TableAsset /></div>
					</div>

				</div>
			</div>

		</>
	);
}

export default Dashboard;

Dashboard.layout = Mainlayout;
