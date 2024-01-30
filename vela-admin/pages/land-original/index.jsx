import Link from "next/link";
import Mainlayout from "/components/layouts/Mainlayout";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Config from "/configs/config";

import {
	getAllLand,
	getBuyLandLatest,
	getLandSupply,
	getAssets,
	getlandTransfered
} from "/utils/models/Land";

function Land() {
	const [showLand, setLand] = useState(true);

	const [showAssets, setAssets] = useState(false);

	const [showDropdown, setDropdown] = useState(false);
	function openDropdown() {
		setDropdown(!showDropdown);
	}

	const [form, setForm] = useState({
		selectedTab: "yaamo",
		yaamo: [],
		sut: [],
		oldtown: [],
	});

	const chartData = {
		labels: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"July",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
		datasets: [
			{
				label: "Land",
				data: [
					120, 519, 423, 345, 552, 243, 519, 423, 345, 552, 243, 800,
				],
				backgroundColor: ["rgba(237, 188, 13, 1)"],
				borderRadius: Number.MAX_VALUE,
				barPercentage: 0.3,
				borderSkipped: false,
			},
		],
	};

	const chartData2 = {
		labels: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"July",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
		datasets: [
			{
				label: "Assets",
				data: [
					256, 425, 123, 425, 896, 236, 123, 423, 325, 552, 243, 800,
				],
				backgroundColor: ["rgba(0, 252, 178)"],
				borderRadius: Number.MAX_VALUE,
				barPercentage: 0.3,
				borderSkipped: false,
			},
		],
	};

	const handleGetChart = async (filter) => {

		console.log("%c === handleGetChart ","color: orange")
		console.log(filter)

		let rs = await getlandTransfered()

		const rsss = await Promise.all(rs.map(async (item, index) => {

			console.log(item.date.getFullYear())

		}));

	}

	const initailize = async () => {

		handleGetChart()

		// LASTEST BUY LAND
		let lastestBuyLandYaamo = await getBuyLandLatest(
			Config.LAND_YAAMO_ADDR
		);
		await lastestBuyLandYaamo.sort(function (a, b) {
			return b["block"] - a["block"];
		});
		lastestBuyLandYaamo = lastestBuyLandYaamo.slice(0, 10);
		setForm((prevState) => ({
			...prevState,
			yaamo: lastestBuyLandYaamo,
		}));

		let lastestBuyLandSut = await getBuyLandLatest(Config.LAND_SUT_ADDR);
		lastestBuyLandSut.sort(function (a, b) {
			return b["block"] - a["block"];
		});
		lastestBuyLandSut = lastestBuyLandSut.slice(0, 10);
		setForm((prevState) => ({
			...prevState,
			sut: lastestBuyLandSut,
		}));

		let lastestBuyLandOldtown = await getBuyLandLatest(
			Config.LAND_OLDTOWN_ADDR
		);
		lastestBuyLandOldtown.sort(function (a, b) {
			return b["block"] - a["block"];
		});
		lastestBuyLandOldtown = lastestBuyLandOldtown.slice(0, 10);
		setForm((prevState) => ({
			...prevState,
			oldtown: lastestBuyLandOldtown,
		}));
		// LASTEST BUY LAND END

	};

	useEffect(() => {
		initailize();
	}, []);

	return (
		<>
			<div>
				<h3 className="font-header mb-4">Lands</h3>
				<div
					className={`block ${
						showLand
							? "block"
							: "block" || showAssets
							? "hidden"
							: "hidden"
					}`}
				>
					<div className="grid grid-cols-1 2xl:grid-cols-4 2xl:gap-3">
						<div className="2xl:col-span-3 bg-sub-content p-4 relative">
							<div className="flex gap-2 items-center">
								<h5 className="text-[#8E8E93]">Fillter by :</h5>
								<div
									className="flex gap-2 bg-pill c-pointer"
									onClick={openDropdown}
								>
									<img
										className="icon-w"
										src="/assets/images/icons/calendar.svg"
										alt=""
									/>
									<p>Month</p>
									<img
										className="icon-w"
										width={24}
										src="/assets/images/icons/down.svg"
										alt=""
									/>
								</div>
							</div>
							<div className={showDropdown ? "block" : "hidden"}>
								<div className="bg-dropdrown w-40 absolute p-dropdrown-filter">
									<p className="list" onClick={openDropdown}>
										Daily
									</p>
									<p className="list" onClick={openDropdown}>
										Weekly
									</p>
									<p className="list" onClick={openDropdown}>
										Month
									</p>
									<p className="list" onClick={openDropdown}>
										Yearly
									</p>
								</div>
							</div>
							<div className="chart-container">
								<Bar
									data={chartData}
									width={500}
									height={350}
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
						</div>
						<div className="mt-4 2xl:mt-0">
							<div className="grid grid-cols-4 2xl:grid-cols-2 gap-3 h-full">
								<div className="bg-sub-content w-full p-4 grid content-between">
									<h4 className="font-semibold tracking-wide">
										Daily
									</h4>
									<div className="text-[#EDBC0D] font-30vw">
										21
									</div>
								</div>
								<div className="bg-sub-content w-full p-4 grid content-between">
									<h4 className="font-semibold tracking-wide">
										Weekly
									</h4>
									<div className="text-[#EDBC0D] font-30vw">
										345
									</div>
								</div>
								<div className="bg-sub-content w-full p-4 grid content-between">
									<h4 className="font-semibold tracking-wide">
										Monthly
									</h4>
									<div className="text-[#EDBC0D] font-30vw">
										3,000
									</div>
								</div>
								<div className="bg-sub-content w-full p-4 grid content-between">
									<h4 className="font-semibold tracking-wide">
										Yearly
									</h4>
									<div className="text-[#EDBC0D] font-30vw">
										15,523
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-sub-content my-3 table-custom land">
						<div className="flex justify-between p-4">
							<h3 className="font-header">Latest land purchase list</h3>
							<div className="pl-4 grow flex items-center">
								<div
									className={`table-tab ${
										form.selectedTab == "yaamo" && "active"
									}`}
									onClick={(e) =>
										setForm((prevState) => ({
											...prevState,
											selectedTab: "yaamo",
										}))
									}
								>
									Yaamo
								</div>
								<div
									className={`table-tab ${
										form.selectedTab == "sut" && "active"
									}`}
									onClick={(e) =>
										setForm((prevState) => ({
											...prevState,
											selectedTab: "sut",
										}))
									}
								>
									Sut
								</div>
								<div
									className={`table-tab ${
										form.selectedTab == "oldtown" &&
										"active"
									}`}
									onClick={(e) =>
										setForm((prevState) => ({
											...prevState,
											selectedTab: "oldtown",
										}))
									}
								>
									Oldtown
								</div>
							</div>
							<div className="flex gap-4">
								<div className="flex gap-4 items-center bg-pill w-fit">
									<img
										className="icon-w"
										width={24}
										alt=""
										src="/assets/images/icons/download.svg"
									/>
									<p>Export</p>
								</div>
								{/* <div className="flex gap-4 items-center bg-pill w-fit">
									<p>5</p>
									<p>entries</p>
									<img className="icon-w" width={24} alt="" src="/assets/images/icons/down.svg" />
								</div> */}
							</div>
						</div>
						<table className="table-auto w-full ">
							<thead className="thead-custom">
								<tr className="text-[#8E8E93]">
									<th className="text-left">
										<h4>Date &amp; Time</h4>
									</th>
									<th className="text-left">
										<h4>Map</h4>
									</th>
									<th className="text-left">
										<h4>Amount</h4>
									</th>
									<th className="text-left">
										<h4>Wallet</h4>
									</th>
								</tr>
							</thead>

							{form.selectedTab == "yaamo" && (
								<tbody className="tbody-custom">
									{form.yaamo.map((item, index) => (
										<tr
											key={`buyland-${index}`}
											className="odd:bg-white even:bg-gray-50"
										>
											<td>
												<h4>{item.date}</h4>
											</td>
											<td>
												<h4>Yaamo</h4>
											</td>
											<td>
												<h4>
													{item.amount}&nbsp;Lands
												</h4>
											</td>
											<td>
												<h4>{item.wallet}</h4>
											</td>
										</tr>
									))}
								</tbody>
							)}
							{form.selectedTab == "sut" && (
								<tbody className="tbody-custom">
									{form.sut.map((item, index) => (
										<tr
											key={`buyland-${index}`}
											className="odd:bg-white even:bg-gray-50"
										>
											<td>
												<h4>{item.date}</h4>
											</td>
											<td>
												<h4>Sut</h4>
											</td>
											<td>
												<h4>
													{item.amount}&nbsp;Lands
												</h4>
											</td>
											<td>
												<h4>{item.wallet}</h4>
											</td>
										</tr>
									))}
								</tbody>
							)}
							{form.selectedTab == "oldtown" && (
								<tbody className="tbody-custom">
									{form.oldtown.map((item, index) => (
										<tr
											key={`buyland-${index}`}
											className="odd:bg-white even:bg-gray-50"
										>
											<td>
												<h4>{item.date}</h4>
											</td>
											<td>
												<h4>Oldtown</h4>
											</td>
											<td>
												<h4>
													{item.amount}&nbsp;Lands
												</h4>
											</td>
											<td>
												<h4>{item.wallet}</h4>
											</td>
										</tr>
									))}
								</tbody>
							)}
						</table>
					</div>
				</div>

				<div className={showAssets ? "block" : "hidden"}>
					<div className="grid grid-cols-1 2xl:grid-cols-4 2xl:gap-3">
						<div className="2xl:col-span-3 bg-sub-content p-4 relative">
							<div className="flex gap-2 items-center">
								<h5 className="text-[#8E8E93]">Fillter by :</h5>
								<div
									className="flex gap-2 bg-pill c-pointer"
									onClick={openDropdown}
								>
									<img
										className="icon-w"
										src="/assets/images/icons/calendar.svg"
										alt=""
									/>
									<p>Month</p>
									<img
										className="icon-w"
										width={24}
										src="/assets/images/icons/down.svg"
										alt=""
									/>
								</div>
							</div>
							<div className={showDropdown ? "block" : "hidden"}>
								<div className="bg-dropdrown w-40 absolute p-dropdrown-filter">
									<p className="list" onClick={openDropdown}>
										Daily
									</p>
									<p className="list" onClick={openDropdown}>
										Weekly
									</p>
									<p className="list" onClick={openDropdown}>
										Month
									</p>
									<p className="list" onClick={openDropdown}>
										Yearly
									</p>
								</div>
							</div>
							<div className="chart-container">
								<Bar
									data={chartData2}
									width={500}
									height={350}
									options={{
										maintainAspectRatio: false,
									}}
								/>
							</div>
						</div>
						<div className="mt-3 2xl:mt-0">
							<div className="grid grid-cols-4 2xl:grid-cols-2 gap-3 h-full">
								<div className="bg-sub-content w-full p-4 grid content-between">
									<h4 className="font-semibold tracking-wide">
										Daily
									</h4>
									<div className="text-[#00FCB2] font-30vw">
										21
									</div>
								</div>
								<div className="bg-sub-content w-full p-4 grid content-between">
									<h4 className="font-semibold tracking-wide">
										Weekly
									</h4>
									<div className="text-[#00FCB2] font-30vw">
										345
									</div>
								</div>
								<div className="bg-sub-content w-full p-4 grid content-between">
									<h4 className="font-semibold tracking-wide">
										Monthly
									</h4>
									<div className="text-[#00FCB2] font-30vw">
										3,000
									</div>
								</div>
								<div className="bg-sub-content w-full p-4 grid content-between">
									<h4 className="font-semibold tracking-wide">
										Yearly
									</h4>
									<div className="text-[#00FCB2] font-30vw">
										15,523
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-sub-content my-3 table-custom asset">
						<div className="flex justify-between p-4">
							<h3 className="font-header">Lasted buy assets</h3>
							<div className="flex gap-4">
								<div className="flex gap-4 items-center bg-pill w-fit">
									<img
										className="icon-w"
										width={24}
										alt=""
										src="/assets/images/icons/download.svg"
									/>
									<p>Export</p>
								</div>
								{/* <div className="flex gap-4 items-center bg-pill w-fit">
									<p>5</p>
									<p>entries</p>
									<img className="icon-w" width={24} alt="" src="/assets/images/icons/down.svg" />
								</div> */}
							</div>
						</div>
						<table className="table-auto w-full ">
							<thead className="thead-custom">
								<tr className="text-[#8E8E93]">
									<th className="text-left">
										<h4>Date &amp; Time</h4>
									</th>
									<th className="text-left">
										<h4>Map</h4>
									</th>
									<th className="text-left">
										<h4>Amount</h4>
									</th>
									<th className="text-left">
										<h4>Wallet</h4>
									</th>
								</tr>
							</thead>
							<tbody className="tbody-custom">
								<tr>
									<td>
										<h4>07/05/2022 - 12.00 H</h4>
									</td>
									<td>
										<h4>Yamoo</h4>
									</td>
									<td>
										<h4>10 Land</h4>
									</td>
									<td>
										<h4>
											0xc514b57Be642a782342439D74EA598B0A2994359
										</h4>
									</td>
									<td>
										<div className="flex gap-2 justify-end">
											<h4 className="whitespace-nowrap">
												See more
											</h4>
											<img
												className="icon-w"
												width={24}
												alt=""
												src="/assets/images/icons/arrow-top-right.svg"
											/>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<h4>07/05/2022 - 12.00 H</h4>
									</td>
									<td>
										<h4>Yamoo</h4>
									</td>
									<td>
										<h4>10 Land</h4>
									</td>
									<td>
										<h4>
											0xc514b57Be642a782342439D74EA598B0A2994359
										</h4>
									</td>
									<td>
										<div className="flex gap-2 justify-end">
											<h4 className="whitespace-nowrap">
												See more
											</h4>
											<img
												className="icon-w"
												width={24}
												alt=""
												src="/assets/images/icons/arrow-top-right.svg"
											/>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<h4>07/05/2022 - 12.00 H</h4>
									</td>
									<td>
										<h4>Yamoo</h4>
									</td>
									<td>
										<h4>10 Land</h4>
									</td>
									<td>
										<h4>
											0xc514b57Be642a782342439D74EA598B0A2994359
										</h4>
									</td>
									<td>
										<div className="flex gap-2 justify-end">
											<h4 className="whitespace-nowrap">
												See more
											</h4>
											<img
												className="icon-w"
												width={24}
												alt=""
												src="/assets/images/icons/arrow-top-right.svg"
											/>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<h4>07/05/2022 - 12.00 H</h4>
									</td>
									<td>
										<h4>Yamoo</h4>
									</td>
									<td>
										<h4>10 Land</h4>
									</td>
									<td>
										<h4>
											0xc514b57Be642a782342439D74EA598B0A2994359
										</h4>
									</td>
									<td>
										<div className="flex gap-2 justify-end">
											<h4 className="whitespace-nowrap">
												See more
											</h4>
											<img
												className="icon-w"
												width={24}
												alt=""
												src="/assets/images/icons/arrow-top-right.svg"
											/>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}
export default Land;
Land.layout = Mainlayout;
