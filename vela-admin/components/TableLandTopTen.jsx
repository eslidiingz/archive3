import React, { useState, useEffect } from "react";

import {
	getBuyLandLatest
} from "/utils/models/Land";

import Config from "/configs/config";

export default function TableLandTopTen(props) {

	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		selectedTab: "yaamo",
		yaamo: [],
		sut: [],
		oldtown: [],
	});

	const handleFetchLastest = async () => {

		setLoading(true)

		let lastestBuyLandYaamo = await getBuyLandLatest(Config.LAND_YAAMO_ADDR);
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

		let lastestBuyLandOldtown = await getBuyLandLatest(Config.LAND_OLDTOWN_ADDR);
		lastestBuyLandOldtown.sort(function (a, b) {
			return b["block"] - a["block"];
		});
		lastestBuyLandOldtown = lastestBuyLandOldtown.slice(0, 10);
		setForm((prevState) => ({
			...prevState,
			oldtown: lastestBuyLandOldtown,
		}));

		setLoading(false)

	}

	const init = async () => {
		await handleFetchLastest();
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

				{/* Nav */}
				<div className="flex justify-between p-4">
					<h3 className="font-header">Lastest Land Purchase Transaction</h3>
					<div className="pl-4 grow flex items-center">
						<div
							className={`table-tab ${form.selectedTab == "yaamo" && "active"}`}
							onClick={(e) => setForm((prevState) => ({ ...prevState, selectedTab: "yaamo" }))}
						>Yaamo</div>
						<div
							className={`table-tab ${form.selectedTab == "sut" && "active"}`}
							onClick={(e) => setForm((prevState) => ({ ...prevState, selectedTab: "sut" }))}
						>Sut</div>
						<div
							className={`table-tab ${form.selectedTab == "oldtown" && "active"}`}
							onClick={(e) => setForm((prevState) => ({ ...prevState, selectedTab: "oldtown" }))}
						>Oldtown</div>
					</div>
				</div>
				{/* Nav End */}

				<table className="table-auto w-full ">
					<thead className="thead-custom">
						<tr className="text-[#8E8E93]">
							<th className="text-left">
								<h4>Date &amp; Time</h4>
							</th>
							<th className="text-left">
								<h4>Wallet</h4>
							</th>
							<th className="text-right">
								<h4>Amount</h4>
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
										<h4>{item.wallet}</h4>
									</td>
									<td className="text-right">
										<h4>{item.amount}</h4>
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
										<h4>{item.wallet}</h4>
									</td>
									<td className="text-right">
										<h4>{item.amount}</h4>
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
										<h4>{item.wallet}</h4>
									</td>
									<td className="text-right">
										<h4>{item.amount}</h4>
									</td>
								</tr>
							))}
						</tbody>
					)}
				</table>
			</div>
		</>
	)
}
