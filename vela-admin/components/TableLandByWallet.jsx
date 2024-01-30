import React, { useState, useEffect } from "react";

import {
	getBuyLandLatest,
	getBuyLandWalletSummary
} from "/utils/models/Land";

import {
	number_comma,
	number_format
} from "/utils/global";

import Config from "/configs/config";

export default function TableLandByWallet(props) {

	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		selectedTab: "yaamo",
		yaamo: [],
		sut: [],
		oldtown: [],
	});

	const init = async () => {

		setLoading(true)

		let lastestBuyLandYaamo = await getBuyLandWalletSummary(Config.LAND_YAAMO_ADDR);
		setForm((prevState) => ({ ...prevState, yaamo: lastestBuyLandYaamo }));

		let lastestBuyLandSut = await getBuyLandWalletSummary(Config.LAND_SUT_ADDR);
		setForm((prevState) => ({ ...prevState, sut: lastestBuyLandSut }));

		let lastestBuyLandOldtown = await getBuyLandWalletSummary(Config.LAND_OLDTOWN_ADDR);
		setForm((prevState) => ({ ...prevState, oldtown: lastestBuyLandOldtown }));

		setLoading(false)

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
					<h3 className="font-header">Land Purchase Summary By Wallet</h3>
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
								<h4>Wallet</h4>
							</th>
							<th className="text-right">
								<h4>Total Amount (Land)</h4>
							</th>
							<th className="text-right">
								<h4>Total Price (Class)</h4>
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
										<h4>{item.wallet}</h4>
									</td>
									<td className="text-right">
										<h4>{number_comma(item.amount)}</h4>
									</td>
									<td className="text-right">
										<h4>{number_comma(item.total)}</h4>
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
										<h4>{item.wallet}</h4>
									</td>
									<td className="text-right">
										<h4>{number_comma(item.amount)}</h4>
									</td>
									<td className="text-right">
										<h4>{number_comma(item.total)}</h4>
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
										<h4>{item.wallet}</h4>
									</td>
									<td className="text-right">
										<h4>{number_comma(item.amount)}</h4>
									</td>
									<td className="text-right">
										<h4>{number_comma(item.total)}</h4>
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
