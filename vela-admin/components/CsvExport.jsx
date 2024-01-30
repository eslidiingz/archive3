/** @format */

import Config from "configs/config";
import React, { Component } from "react";
import { CSVLink } from "react-csv";
import { getAssetsByPage } from "utils/models/GenerateNFT";
import { getBuyLandWalletSummary } from "utils/models/Land";

const csvLandHeaders = [
	{ label: "Wallet", key: "wallet" },
	{ label: "Total Amount (Land)", key: "amount" },
	{ label: "Total Price (Class)", key: "total" },
];

const csvAssetHeaders = [
	{ label: "Token ID", key: "data.asset_token_id" },
	{ label: "Type", key: "data.creator_type" },
	{ label: "Mint Date", key: "data.mintedDate" },
	{ label: "Wallet Minted", key: "data.owner_wallet" },
	{ label: "Name", key: "data.name" },
	{ label: "Price", key: "price" },
	{ label: "Sold Status", key: "data.soldStatus" },
	{ label: "Sold Date", key: "data.soldDate" },
	{ label: "Owner Wallet", key: "data.owner_wallet" },
	{ label: "Mint Fee", key: "data.mint_fee" },
];

class CsvExport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			data: [],
			assetData: [],
			filter: {
				page: null,
				creator_type: "",
				mint_date: "",
				wallet_minted: "",
				asset_token_id: "",
				name: "",
				sold_status: "",
				sold_date: "",
				owner_wallet: "",
			},
		};
		this.csvLinkEl = React.createRef();
		this.assetCsvLinkEl = React.createRef();
	}

	getUserList = () => {
		return fetch("https://jsonplaceholder.typicode.com/users").then((res) => res.json());
	};

	downloadReport = async () => {
		const data = await this.getUserList();
		this.setState({ data: data }, () => {
			setTimeout(() => {
				this.csvLinkEl.current.link.click();
			});
		});
	};

	handleFetchLatestReport = async () => {
		try {
			this.setState((prevState) => ({
				...prevState,
				loading: true,
			}));

			let reportDatas = [];
			const lastestBuyLandYaamo = await getBuyLandWalletSummary(Config.LAND_YAAMO_ADDR);
			const lastestBuyLandSut = await getBuyLandWalletSummary(Config.LAND_SUT_ADDR);
			const lastestBuyLandOldtown = await getBuyLandWalletSummary(Config.LAND_OLDTOWN_ADDR);

			reportDatas = [...reportDatas, ...lastestBuyLandYaamo];
			reportDatas = [...reportDatas, ...lastestBuyLandSut];
			reportDatas = [...reportDatas, ...lastestBuyLandOldtown];

			this.setState(
				(prevState) => ({ ...prevState, data: reportDatas }),
				() => {
					setTimeout(() => {
						this.csvLinkEl.current.link.click();
					});
				}
			);
		} catch {
			this.setState({ data: [], loading: false });
		} finally {
			this.setState((prevState) => ({
				...prevState,
				loading: false,
			}));
		}
	};

	handleFetchLatestAssetReport = async () => {
		try {
			this.setState((prevState) => ({
				...prevState,
				loading: true,
			}));

			const assetData = await getAssetsByPage(null, this.state.filter);

			this.setState(
				(prevState) => ({ ...prevState, data: [], assetData }),
				() => {
					setTimeout(() => {
						this.assetCsvLinkEl.current.link.click();
					});
				}
			);
		} catch (e) {
			this.setState((prevState) => ({ ...prevState, data: [], assetData: [], loading: false }));
		} finally {
			this.setState((prevState) => ({
				...prevState,
				loading: false,
			}));
		}
	};

	render() {
		const { data } = this.state;

		return (
			<div>
				<button type="button" className="btn--export-land-asset" disabled={this.state.loading} onClick={this.handleFetchLatestReport}>
					{this.state.loading ? "Loading..." : "Export Land"}
				</button>
				<CSVLink headers={csvLandHeaders} filename="Velaverse Lands Report.csv" data={data} ref={this.csvLinkEl} />

				<button type="button" className="btn--export-land-asset ml-3" disabled={this.state.loading} onClick={this.handleFetchLatestAssetReport}>
					{this.state.loading ? "Loading..." : "Export Asset"}
				</button>
				<CSVLink headers={csvAssetHeaders} filename="Velaverse Assets Report.csv" data={this.state.assetData} ref={this.assetCsvLinkEl} />
			</div>
		);
	}
}

export default CsvExport;
