import React, { useContext, useEffect, useState, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { hash, compare } from "bcryptjs";

import { ethers, Contract } from "ethers";
import { connectProvider, modalConnect } from "/utils/connector/provider";

export default function signin() {
	const { data: session, status } = useSession();

	const [form, setForm] = useState({
		// username: "admin@velaverse.io",
		// password: "admin@vv!",
		username: "",
		password: "",
		message: "",
	});
	const handleInputChange = (event) => {
		if (event.target.type == "checkbox") {
			setForm((prevState) => ({
				...prevState,
				[event.target.name]: event.target.checked,
			}));
		} else {
			setForm((prevState) => ({
				...prevState,
				[event.target.name]: event.target.value,
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setForm((prevState) => ({
			...prevState,
			message: "",
		}));

		let _body = JSON.stringify({
			username: form.username,
			password: form.password,
		});
		let _res = await fetch("/api/auth/admin-auth", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"Cache-Control": "no-cache",
			},
			body: _body,
		});
		_res = await _res.json();
		if (_res.status) {
			signIn("Velaverse", {
				username: form.username,
				password: form.password,
			});
		} else {
			console.log(_res);
			setForm((prevState) => ({
				...prevState,
				message: _res.message,
			}));
		}
	};

	const connectWallet = async () => {
		const web3Modal = modalConnect();
		const instance = await web3Modal.connect();
		const provider = connectProvider(instance);
		const signer = provider.getSigner();

		changeNetwork();
	}
	const changeNetwork = async () => {
		let params = {
			chainId: "0x"+Number(555).toString(16),
			chainName: "VELA1 Chain",
			nativeCurrency: {
				name: "CLASS",
				symbol: "CLASS",
				decimals: 18
			},
			rpcUrls: ["https://rpc.velaverse.io/"],
			blockExplorerUrls: ["https://exp.velaverse.io"]
		}
		console.log(params)
		await ethereum.request({ method: 'wallet_addEthereumChain',
			params:[
				params
			]
		})
	}

	useEffect(() => {
		connectWallet();
	}, []);

	return (
		<>
			<section className="h-screen">
				<div className="px-6 h-full text-gray-800">
					<div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
						<div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
							<img
								src="/assets/images/logo-velaverse.svg"
								className="w-full"
								alt="Sample image"
							/>
						</div>
						<div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
							<form onSubmit={(e) => handleSubmit(e)}>
								<div className="mb-6">
									<input
										type="text"
										className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
										placeholder="Email address"
										name="username"
										value={form.username}
										onChange={handleInputChange}
										required
									/>
								</div>

								<div className="mb-6">
									<input
										type="password"
										className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
										placeholder="Password"
										name="password"
										value={form.password}
										onChange={handleInputChange}
										required
									/>
								</div>

								{form.message && (
									<div
										style={{
											color: "#e00",
											textAlign: "center",
										}}
									>
										{form.message}
									</div>
								)}

								{/* <div className="flex justify-between items-center mb-6">
									<div className="form-group form-check">
										<input
											type="checkbox"
											className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
											id="exampleCheck2"
										/>
										<label
											className="form-check-label inline-block text-gray-800"
											for="exampleCheck2"
										>
											Remember me
										</label>
									</div>
									<a href="#!" className="text-gray-800">
										Forgot password?
									</a>
								</div> */}

								<div className="text-center lg:text-left">
									<button
										type="submit"
										className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
									>
										Login
									</button>
									<button
										type="button"
										className="inline-block ml-4 px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
										onClick={() => { changeNetwork() }}
									>
										Add VELA1 Chain
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
