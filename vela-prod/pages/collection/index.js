import { useState, useEffect } from "react";
import Link from "next/link";
import Config from "../../utils/config";
import { findUserById } from "../../utils/api/account-api";
import CardCollection from "../../components/collections/card-collection";
import Accordion from "/components/Accordion";

const mouseUp = (name) => {
	document.querySelector("#sidebar-toggle").classList.toggle("hide");
};

const CollectionListPage = () => {
	const [page, setPage] = useState(1);
	const [pageTotal, setPageTotal] = useState(1);
	const [pageList, setPageList] = useState([]);
	const [allList, setAllList] = useState([]);

	const fetchCollectionAll = async () => {

		const url = "collections";
		const endpoint = `${Config.COLLECTION_API}/${url}?size=10000`;

		const item = await fetch(`${endpoint}`);
		const { rows } = await item.json();
		setAllList(rows);

		let pageTotal = Math.ceil( rows.length / 15 )
		setPageTotal(pageTotal)

	};

	const fetchCollectionByPage = async () => {

		const url = "collections";
		const endpoint = `${Config.COLLECTION_API}/${url}?size=15&page=${page}`;

		const item = await fetch(`${endpoint}`);
		const { rows } = await item.json();

		const _all = await rows.map(async (item) => {
			const user = await findUserById(item.owner);
			return { ...item, user };
		});

		const _allp = await Promise.all(_all);
		setPageList([])
		setPageList(_allp);

	};

	useEffect(() => {
		fetchCollectionAll();
		fetchCollectionByPage();
	}, []);

	useEffect(() => {
		fetchCollectionByPage();
	}, [page]);

	return (
		<>
			<div className="heading">
				<h2>Collection</h2>
				<p>
					Here you can search and buy creator&apos;s ASSETS with Class to
					incorporate them into your LAND
				</p>
			</div>
			<section
				className="vela-full-sidebar disable-sidebar"
				id="sidebar-toggle"
			>
				<div className="sidebar">
					<div className="sidebar-toggler" onMouseUp={() => mouseUp()}>
						<div className="toggle-title">
							<i className="far fa-filter"></i>Filter
						</div>
						<div className="toggle-arrow">
							<i className="fas fa-arrow-to-left"></i>
						</div>
					</div>
				</div>
				<div className="content">
					<div className="grid grid-cols-3 mb-6">
						<div>
							&nbsp;
						</div>
						<div className="flex justify-center items-center">
							<div
								className="mr-3"
								style={{ width: "24px", color: "#fff" }}
								onClick={() => {
									if( parseInt(page) - 1 > 0 ){
										setPage( parseInt(page) - 1 );
									}
								}}
							>
								<svg className="filter-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM384 288H205.3l49.38 49.38c12.5 12.5 12.5 32.75 0 45.25s-32.75 12.5-45.25 0L105.4 278.6C97.4 270.7 96 260.9 96 256c0-4.883 1.391-14.66 9.398-22.65l103.1-103.1c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L205.3 224H384c17.69 0 32 14.33 32 32S401.7 288 384 288z"/></svg>
							</div>
							<input
								type="number"
								className="form-control text-center"
								style={{ padding: "0px 0px 0px 15px", width: "60px", color: "#000", backgroundColor: "#fff", fontSize: "20px", letterSpacing: "1px" }}
								name="page" value={page} min="1"
								onChange={(e) => {setPage(e.target.value)}}
							/>
							<div
								style={{ fontSize: "20px" }}
							>&nbsp;/&nbsp;{pageTotal}</div>
							<div
								className="ml-3"
								style={{ width: "24px", color: "#fff" }}
								onClick={() => {
									if( parseInt(page) + 1 <= parseInt(pageTotal) ){
										setPage( parseInt(page) + 1 )
									}
								}}
							>
								<svg className="filter-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM406.6 278.6l-103.1 103.1c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25L306.8 288H128C110.3 288 96 273.7 96 256s14.31-32 32-32h178.8l-49.38-49.38c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l103.1 103.1C414.6 241.3 416 251.1 416 256C416 260.9 414.6 270.7 406.6 278.6z"/></svg>
							</div>
						</div>
						<div className="flex justify-end items-center">
							Total&nbsp;&nbsp;{allList.length}&nbsp;&nbsp;Collections
						</div>
					</div>
					<div className="card-collection-fullwidth">
						{pageList.map((item, index) => {
							return (
								<Link href={`collection/${item._id}`}>
									<div key={index}>
										<CardCollection meta={item} />
									</div>
								</Link>
							);
						})}
					</div>
					<div className="grow flex justify-center items-center mt-6">
						<div
							className="mr-3"
							style={{ width: "24px", color: "#fff" }}
							onClick={() => {
								if( parseInt(page) - 1 > 0 ){
									setPage( parseInt(page) - 1 );
								}
							}}
						>
							<svg className="filter-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM384 288H205.3l49.38 49.38c12.5 12.5 12.5 32.75 0 45.25s-32.75 12.5-45.25 0L105.4 278.6C97.4 270.7 96 260.9 96 256c0-4.883 1.391-14.66 9.398-22.65l103.1-103.1c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L205.3 224H384c17.69 0 32 14.33 32 32S401.7 288 384 288z"/></svg>
						</div>
						<input
								type="number"
								className="form-control text-center"
								style={{ padding: "0px 0px 0px 15px", width: "60px", color: "#000", backgroundColor: "#fff", fontSize: "20px", letterSpacing: "1px" }}
								name="page" value={page} min="1"
								onChange={(e) => {setPage(e.target.value)}}
							/>
							<div
								style={{ fontSize: "20px" }}
							>&nbsp;/&nbsp;{pageTotal}</div>
						<div
							className="ml-3"
							style={{ width: "24px", color: "#fff" }}
							onClick={() => {
								if( parseInt(page) + 1 <= parseInt(pageTotal) ){
									setPage( parseInt(page) + 1 )
								}
							}}
						>
							<svg className="filter-green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM406.6 278.6l-103.1 103.1c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25L306.8 288H128C110.3 288 96 273.7 96 256s14.31-32 32-32h178.8l-49.38-49.38c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l103.1 103.1C414.6 241.3 416 251.1 416 256C416 260.9 414.6 270.7 406.6 278.6z"/></svg>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default CollectionListPage;
