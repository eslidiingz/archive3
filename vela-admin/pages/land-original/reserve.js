import React, { useState, useEffect } from "react";
import Mainlayout from "/components/layouts/Mainlayout";
import ModalTransfer from "components/Modal"

import Config from "/configs/config";
import { ethers, Contract } from "ethers";
import { abi, smartContact, transferAllLand } from "/utils/models/contract";

function LandReserve() {
	const [rs, setRs] = useState([]);

	const [selectedRecord, setSelectedRecord] = useState({});
	const [openModalTransfer, setOpenModalTransfer] = useState(false);

	const handleTransfer = async (item) => {
		setSelectedRecord(item)
		setOpenModalTransfer(true)
	}
	const handleTransferSubmit = async (item) => {
		try {

			let body = JSON.stringify({
				id: selectedRecord.id,
				status: 2,
			})
			let _res = await fetch(`${Config.LAND_URI}/transactions`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"Cache-Control": "no-cache",
				},
				body: body,
			})
			_res = await _res.json();

			let data = {
				admin_wallet_address: selectedRecord.admin_wallet_address,
				wallet_address: selectedRecord.wallet_address,
				token_id: selectedRecord.token_id,
			}
			await transferAllLand(data, Config.LAND_OLDTOWN_ADDR, init)

		} catch (error) {
			console.log(" === error ", error);
		}
	}

	const init = async () => {
		try {
			let _res = await fetch(`${Config.LAND_URI}/transactions/transfer`, {
				method: "GET",
			});
			let { success, data, status } = await _res.json();
			if( success ){
				// กรองเอาเฉพาะรายการจองเท่านั้น
				// let _rs = data.filter((item, index) => { return item.admin_wallet_address != item.wallet_address })
				let _rs = data

				// GET TOKEN OWNER
				let contract = smartContact(abi, Config.LAND_OLDTOWN_ADDR) // PHUKET OLDTOWN CONTRACT
				await Promise.all(_rs.map(async (item, index) => {
					const result = await Promise.all(item.token_id.map(async (token, index) => {
						let tokenOwner = await contract.ownerOf(parseInt(token))
						return tokenOwner
					}));
					_rs[index].token_owner = result
				}));
				// GET TOKEN OWNER END

				setOpenModalTransfer(false)

				setRs(_rs)
			}
		} catch (error) {
			console.log(" === error ", error);
		}
	}

	useEffect(() => {
		init()
	}, [])

	return (
		<>
			<div>
				<h3 className="font-header">Land &amp; Assets</h3>
				<div className="bg-sub-content my-3 table-custom land">
					<table className="table-auto w-full">
						<thead className="thead-custom">
							<tr className="text-[#8E8E93]">
								<th className="text-left">
									<h4>From To Address</h4>
								</th>
								<th className="text-left">
									<h4>Coordinate [ x, y ]</h4>
								</th>
								<th className="text-left">
									<h4>Tokens</h4>
								</th>
								<th className="">
									<h4>Action</h4>
								</th>
							</tr>
						</thead>
						<tbody className="tbody-custom">
							{rs.map((row, index) => (
								<tr key={`row-${index}`}>
									<td className={`zip align-top ${( row.admin_wallet_address != row.wallet_address ) && "text-[#00ffac]"}`}>
										<h4>{row.admin_wallet_address}</h4>
										<div className="text-center text-xs"><i class="fas fa-solid fa-arrow-down"></i></div>
										<h4>{row.wallet_address}</h4>
									</td>
									<td className="align-top">
										{row.token_id.map((token, token_index) => (
											<span key={`token-coordinate-${token_index}`}>
												[ {row.coordinate_x[token_index]}, {row.coordinate_y[token_index]} ]
												{( token_index + 1 < row.token_id.length ) && <>&nbsp;</>}
											</span>
										))}
									</td>
									<td className="align-top">
										{row.token_id.map((token, token_index) => (
											<span
												key={`token-${token_index}`}
												className={`zip align-top ${( row.token_owner[token_index] != row.admin_wallet_address ) && "text-[#00ffac]"}`}
												title={row.token_owner[token_index]}
											>
												{token}
												{( token_index + 1 < row.token_id.length ) && <>, </>}
											</span>
										))}
									</td>
									<td>
										<div className="flex justify-center items-center gap-2">
											<img onClick={() => handleTransfer(row)} className="icon-green c-pointer" alt="" width={20} src="/assets/images/icons/arrow-right-arrow-left-solid.svg" />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<ModalTransfer
				open={openModalTransfer}
				onClosed={(e) => setOpenModalTransfer(false)}
				onSubmited={() => handleTransferSubmit()}
				backgroundClose={false}
				background={`dark`}
				classStyle={`w-full max-w-screen-sm p-4`}
				buttonSubmit={true}
				buttonSubmitText="ยืนยันการโอน"
			>
				<div className="text-white text-xl pb-4 bb">
					<i className="fas fa-solid fa-check-double mx-3 text-primary"></i>
					ยืนยันการโอน
				</div>
				<div className="py-4 bb">
					<div className="p-4 bg-black text-white text-xl rounded text-center bb">
						{selectedRecord.wallet_address}
					</div>
				</div>
			</ModalTransfer>

		</>
	)
}

export default LandReserve

LandReserve.layout = Mainlayout;