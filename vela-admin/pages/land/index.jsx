/** @format */

import Mainlayout from "/components/layouts/Mainlayout";
import ChartLand from "/components/ChartLand";
import ChartLandByWallet from "/components/ChartLandByWallet";
import TableLandTopTen from "/components/TableLandTopTen";
import TableLandByWallet from "/components/TableLandByWallet";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import { getAllLand, getAllLandPast, getLandSupply } from "/utils/models/Land";

import { number_comma, number_format } from "/utils/global";

import Config from "/configs/config";
import CsvExport from "components/CsvExport";

function Land() {
	const [loadings, setLoadings] = useState({
		summary: true,
	});

	const [lands, setLands] = useState({
		yaamo: {
			total_land: 0,
			sold: 0,
			left: 0,
		},
		sut: {
			total_land: 0,
			sold: 0,
			left: 0,
		},
		oldtown: {
			total_land: 0,
			sold: 0,
			left: 0,
		},
	});

	const [filters, setFilters] = useState({
		period: "",
		dateStart: dayjs().format("YYYY-MM-DD"),
		dateEnd: dayjs().format("YYYY-MM-DD"),
		// dateEnd: new Date().toLocaleDateString("en-CA"),
	});

	const handleResetFilter = () => {
		setFilters({
			period: "",
			dateStart: dayjs().format("YYYY-MM-DD"),
			dateEnd: dayjs().format("YYYY-MM-DD"),
		});
	};

	const handleSelectedPeriod = (_period = "daily", _dateStart = dayjs().format("YYYY-MM-DD"), _dateEnd = dayjs().format("YYYY-MM-DD")) => {
		switch (_period) {
			case "monthly": // This month
				_dateStart = dayjs().add(-1, "month").format("YYYY-MM-DD");
				_dateEnd = dayjs().format("YYYY-MM-DD");
				break;
			case "weekly": // this week
				_dateStart = dayjs().add(-7, "day").format("YYYY-MM-DD");
				_dateEnd = dayjs().format("YYYY-MM-DD");
				break;
			case "daily": // this day
				_dateStart = dayjs().format("YYYY-MM-DD");
				_dateEnd = dayjs().format("YYYY-MM-DD");
				break;
			case "between": // Selected date
				_dateStart = _dateStart;
				_dateEnd = _dateEnd;
				break;
		}

		setFilters((prevFilters) => ({
			...prevFilters,
			period: _period,
			dateStart: _dateStart,
			dateEnd: _dateEnd,
		}));
	};

	const handleFilters = async () => {
		setLoadings((prevState) => ({ ...prevState, summary: true }));

		let yamooSupply = await getLandSupply();
		let yaamoBoughtPast = await getAllLandPast(Config.LAND_YAAMO_ADDR, filters);
		let yaamoBought = await getAllLand(Config.LAND_YAAMO_ADDR, filters);

		let sutSupply = await getLandSupply(Config.LAND_SUT_ADDR);
		let sutBoughtPast = await getAllLandPast(Config.LAND_SUT_ADDR, filters);
		let sutBought = await getAllLand(Config.LAND_SUT_ADDR, filters);

		let oldtownSupply = await getLandSupply(Config.LAND_OLDTOWN_ADDR);
		let oldtownBoughtPast = await getAllLandPast(Config.LAND_OLDTOWN_ADDR, filters);
		let oldtownBought = await getAllLand(Config.LAND_OLDTOWN_ADDR, filters);

		setLands({
			yaamo: {
				total_land: 19964,
				sold: filters.period == "" ? yamooSupply : yaamoBought.length,
				left: 19964 - yaamoBoughtPast.length,
			},
			sut: {
				total_land: 30933,
				sold: filters.period == "" ? sutSupply : sutBought.length,
				left: 30933 - sutBoughtPast.length,
			},
			oldtown: {
				total_land: 27651,
				sold: filters.period == "" ? oldtownSupply : oldtownBought.length,
				left: 27651 - oldtownBoughtPast.length,
			},
		});

		setLoadings((prevState) => ({ ...prevState, summary: false }));
	};

	useEffect(() => {
		handleFilters();
	}, [filters]);

	const init = async () => {
		setLoadings((prevState) => ({ ...prevState, summary: true }));
		await handleFilters();
		setLoadings((prevState) => ({ ...prevState, summary: false }));
	};

	useEffect(() => {
		init();
	}, []);

	return (
		<>
			<div className="container mx-auto">
				<div className="flex justify-between mb-4">
					<div className="text-primary text-3xl">Land dashboard</div>
					<div className="flex items-center">
						<CsvExport />
					</div>
				</div>

				<div className="row">
					{/* Nav */}
					<div className="grid gap-1">
						<div className="nav nav-tabs flex" role="tablist">
							<div
								className={`nav-link btn01 text02 cursor-pointer ${filters.period == "" ? "active" : ""}`}
								onClick={(e) => handleResetFilter(e)}
							>
								All
							</div>

							<div
								className={`nav-link btn01 text02 cursor-pointer ${filters.period == "monthly" ? "active" : ""}`}
								onClick={(e) => handleSelectedPeriod("monthly")}
							>
								This month
							</div>

							<div
								className={`nav-link btn01 text02 cursor-pointer ${filters.period == "weekly" ? "active" : ""}`}
								onClick={(e) => handleSelectedPeriod("weekly")}
							>
								This week
							</div>

							<div
								className={`nav-link btn01 text02 cursor-pointer ${filters.period == "daily" ? "active" : ""}`}
								onClick={(e) => handleSelectedPeriod("daily")}
							>
								Today
							</div>

							<div
								className={`nav-link btn01 text02 cursor-pointer ${filters.period == "between" ? "active" : ""}`}
								onClick={(e) => handleSelectedPeriod("between")}
							>
								Between
							</div>

							{filters.period == "between" && (
								<>
									<div className="flex justify-center items-center">
										<input
											type="date"
											className="form-control block w-full px-0 py-0 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
											placeholder="Mint date"
											name="dateStart"
											value={filters.dateStart}
											onChange={(event) => {
												setFilters((prevState) => ({
													...prevState,
													[event.target.name]: event.target.value,
												}));
											}}
										/>
										<div>&nbsp;&nbsp;TO&nbsp;&nbsp;</div>
										<input
											type="date"
											className="form-control block w-full px-0 py-0 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
											placeholder="Mint date"
											name="dateEnd"
											value={filters.dateEnd}
											onChange={(event) => {
												setFilters((prevState) => ({
													...prevState,
													[event.target.name]: event.target.value,
												}));
											}}
										/>
									</div>
								</>
							)}
						</div>
					</div>
					{/* Nav */}

					{/* Summary */}
					<div className="grid grid-cols-2 gap-3 layout01">
						{/* Land */}
						<div className="layout02 relative">
							{loadings.summary && (
								<div className="panel-loading">
									<i className="fa fa-spinner fa-spin"></i>
								</div>
							)}
							<div className="flex text-3xl mb-2">
								<div className="grow flex items-center">
									<img className="mr-1" src="/assets/images/icons/square.svg" alt="land-icon" />
									Land
								</div>
								<div>(Lands)</div>
							</div>
							<div className="text-lg">
								<div className="flex justify-between">
									<div style={{ width: "40%" }}>Zone</div>
									<div style={{ width: "20%", textAlign: "right" }}>Total lands</div>
									<div style={{ width: "20%", textAlign: "right" }}>Sold</div>
									<div style={{ width: "20%", textAlign: "right" }}>Land lefts</div>
								</div>

								<div className="flex justify-between">
									<div style={{ width: "40%" }}>YAAMO</div>
									<div style={{ width: "20%", textAlign: "right" }}>{number_comma(lands.yaamo.total_land)}</div>
									<div style={{ width: "20%", textAlign: "right" }}>{number_comma(lands.yaamo.sold)}</div>
									<div style={{ width: "20%", textAlign: "right" }}>{number_comma(lands.yaamo.left)}</div>
								</div>

								<div className="flex justify-between">
									<div style={{ width: "40%" }}>SUT</div>
									<div style={{ width: "20%", textAlign: "right" }}>{number_comma(lands.sut.total_land)}</div>
									<div style={{ width: "20%", textAlign: "right" }}>{number_comma(lands.sut.sold)}</div>
									<div style={{ width: "20%", textAlign: "right" }}>{number_comma(lands.sut.left)}</div>
								</div>

								<div className="flex justify-between">
									<div style={{ width: "40%" }}>OLDTOWN</div>
									<div style={{ width: "20%", textAlign: "right" }}>{number_comma(lands.oldtown.total_land)}</div>
									<div style={{ width: "20%", textAlign: "right" }}>{number_comma(lands.oldtown.sold)}</div>
									<div style={{ width: "20%", textAlign: "right" }}>{number_comma(lands.oldtown.left)}</div>
								</div>
							</div>
						</div>
						{/* Land End */}
					</div>
					{/* Summary End */}

					<div className="grid grid-cols-1 gap-4 py-4">
						<div>
							<ChartLand />
						</div>
						<div>
							<TableLandTopTen />
						</div>
						<div>
							<ChartLandByWallet />
						</div>
						<div>
							<TableLandByWallet />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Land;

Land.layout = Mainlayout;
