import React, { useState, useEffect } from "react";
import moment from "moment";

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

export default function TableAsset(props) {

	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		selectedTab: "official",
		rows: []
	});

	const [filter, setFilter] = useState({
		page: 1
	});
	const handleFilterChange = (event) => {

		let _filter = { ...filter }

		if(event.target.type == "checkbox"){
			setFilter((prevState) => ({
				...prevState,
				[event.target.name]: event.target.checked
			}));
			_filter[event.target.name] = event.target.value
		}else{
			setFilter((prevState) => ({
				...prevState,
				[event.target.name]: event.target.value
			}));
			_filter[event.target.name] = event.target.value
		}

		handleFetchRows(_filter)

	}

	const handleFetchRows = async (_filter) => {
		setLoading(true);
		let res = await getAssetsByUserWallet(6, _filter);
		setForm((prevState) => ({
			...prevState,
			rows: res
		}));
		setLoading(false);
	};

	const init = async () => {
		await handleFetchRows(filter);
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
				<div className="flex justify-between p-4 relative">
					<h3 className="font-header">
						User Asset Summary
					</h3>
					<div className="pl-4 grow flex items-center">
					</div>
					<div className="flex gap-4">
						<div className="grow flex justify-center items-center">
							<div
								className="mr-2"
								onClick={() => {
									if( parseInt(filter.page) - 1 > 0 ){
										setFilter((prevState) => ({ ...prevState, "page": parseInt(filter.page) - 1 }));
										let _filter = { ...filter }
										_filter.page = parseInt(filter.page) - 1
										handleFetchRows(_filter)
									}
								}}
								style={{ width: "18px", color: "#fff" }}
							>
								<svg className="filter-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM384 288H205.3l49.38 49.38c12.5 12.5 12.5 32.75 0 45.25s-32.75 12.5-45.25 0L105.4 278.6C97.4 270.7 96 260.9 96 256c0-4.883 1.391-14.66 9.398-22.65l103.1-103.1c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L205.3 224H384c17.69 0 32 14.33 32 32S401.7 288 384 288z"/></svg>
							</div>
							<input
								type="number"
								className="form-control block w-full px-0 py-0 text-sm text-center font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
								style={{ width: "40px" }}
								name="page" value={filter.page} min="1"
								onChange={handleFilterChange}
							/>
							<div
								className="ml-2"
								onClick={() => {
									setFilter((prevState) => ({ ...prevState, "page": parseInt(filter.page) + 1 }));
									let _filter = { ...filter }
									_filter.page = parseInt(filter.page) + 1
									handleFetchRows(_filter)
								}}
								style={{ width: "18px", color: "#fff" }}
							>
								<svg className="filter-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM406.6 278.6l-103.1 103.1c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25L306.8 288H128C110.3 288 96 273.7 96 256s14.31-32 32-32h178.8l-49.38-49.38c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l103.1 103.1C414.6 241.3 416 251.1 416 256C416 260.9 414.6 270.7 406.6 278.6z"/></svg>
							</div>
						</div>
					</div>
				</div>

				<table className="table-auto w-full">

					<thead className="thead-custom">
						<tr className="text-[#8E8E93]">
							<th className="text-left">
								<h4>Minter Wallet</h4>
							</th>
							<th className="text-right">
								<h4>Asset Minted</h4>
							</th>
							<th className="text-right">
								<h4>Asset on placement</h4>
							</th>
							<th className="text-right">
								<h4>Total (Class)</h4>
							</th>
							<th className="text-right">
								<h4>Sold (Class)</h4>
							</th>
						</tr>
					</thead>

					<tbody className="tbody-custom">
						{form.rows?.map((item, index) => (
							<tr
								key={`row-${index}`}
								className="odd:bg-white even:bg-gray-50"
							>
								<td className="text-left">
									<h4>{item._id}</h4>
								</td>
								<td className="text-right">
									<h4>{number_comma(item.count)}</h4>
								</td>
								<td className="text-right">
									<h4>{number_comma(item.sold_items.length)}</h4>
								</td>
								<td className="text-right">
									<h4>{number_format(item.total)}</h4>
								</td>
								<td className="text-right">
									<h4>{number_format(item.sold_total)}</h4>
								</td>
							</tr>
						))}
					</tbody>

				</table>
			</div>
		</>
	)
}
