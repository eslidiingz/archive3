import { useEffect, useState } from "react";
import { connectProvider, modalConnect } from "/utils/connector/provider";
import Config from "/configs/config";
import { getAsset, getAssetSupply } from "/utils/models/GenerateNFT";
import {
  getAllLand,
  getBuyLandLatest,
  getLandSupply,
} from "/utils/models/Land";

import dayjs from "dayjs";

import Mainlayout from "/components/layouts/Mainlayout";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faArrowsRotate,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [myWallet, setMyWallet] = useState("0x00");
  const [lands, setLands] = useState({
    yaamo: {
      supply: 0,
      bought: [],
    },
    sut: {
      supply: 0,
      bought: [],
    },
  });

  const [assets, setAssets] = useState({
    supply: 0,
    verified: 0,
    nodVerify: 0,
  });

  const [marketplaceAllItem, setMarketplaceAllItem] = useState([]);

  const [filters, setFilters] = useState({
    period: "",
    dateStart: dayjs().format("YYYY-MM-DD"),
    dateEnd: "",
    // dateEnd: new Date().toLocaleDateString("en-CA"),
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
        data: [120, 519, 423, 345, 552, 243, 519, 423, 345, 552, 243, 519],
        backgroundColor: ["rgba(237, 188, 13, 1)"],
        borderRadius: Number.MAX_VALUE,
        barPercentage: 0.4,
      },
      {
        label: "Asset",
        data: [312, 519, 763, 545, 132, 543, 312, 519, 763, 545, 132, 543],
        backgroundColor: ["rgba(0, 252, 178, 1)"],
        borderRadius: Number.MAX_VALUE,
        barPercentage: 0.4,
      },
    ],
  };

  const initialize = async () => {
    const web3Modal = modalConnect();
    const instance = await web3Modal.connect();
    const provider = connectProvider(instance);
    const signer = provider.getSigner();

    setMyWallet(await signer.getAddress());

    await handleFilters();
  };

  const handleSelectedPeriod = (_period = "daily") => {
    let dateStart = dayjs().format("YYYY-MM-DD");
    let dateEnd = "";

    if (_period === "weekly") {
      dateStart = dayjs().add(-7, "day").format("YYYY-MM-DD");
      dateEnd = dayjs().format("YYYY-MM-DD");
    } else if (_period === "monthly") {
      dateStart = dayjs().add(-1, "month").format("YYYY-MM-DD");
      dateEnd = dayjs().format("YYYY-MM-DD");
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      period: _period,
      dateStart: dateStart,
      dateEnd: dateEnd,
    }));
  };

  const handleFilters = async () => {
    let yaamoBought = await getAllLand(Config.LAND_YAAMO_ADDR, filters);
    let sutBought = await getAllLand(Config.LAND_SUT_ADDR, filters);

    setLands({
      yaamo: {
        supply: await getLandSupply(),
        bought: yaamoBought,
      },
      sut: {
        supply: await getLandSupply(Config.LAND_SUT_ADDR, filters),
        bought: sutBought,
      },
    });

    let assets = await getAsset();

    let assets_verify = assets.rows.filter((item) => item.verify === "Y");

    let _assetSupply = await getAssetSupply();

    setAssets({
      supply: _assetSupply,
      verified: assets_verify.length,
      nonVerify: _assetSupply - assets_verify.length,
    });

    await getBuyLandLatest();
  };

  const handleResetFilter = () => {
    setFilters({
      period: "",
      dateStart: dayjs().format("YYYY-MM-DD"),
      dateEnd: "",
    });
  };

  useEffect(() => {
	  window.location.href="/land";
    // initialize();
  }, []);

  // useEffect(() => {
  // 	handleFilters();
  // }, [filters]);

  return (
    <>
      {/* MEIJI */}
      <div className="container mx-auto">
        <div className="flex justify-between mb-4">
          <div className="text-primary text-3xl">Main dashboard</div>
          <div className="flex items-center">
            {/* <FontAwesomeIcon icon={faWallet} /> */}
            {/* <span className="ml-1">{myWallet}</span> */}
          </div>
        </div>

        <div className="row">
          {/* <!-- Nav tabs --> */}
          <div className="grid gap-1">
            <div className="nav nav-tabs flex" role="tablist">
              <div
                className={`nav-link btn01 text02 cursor-pointer ${
                  filters.period == "monthly" ? "active" : ""
                }`}
                data-toggle="tab"
                // href="#Monthly"
                onClick={(e) => handleSelectedPeriod("monthly")}
              >
                Monthly
              </div>

              <div
                className={`nav-link btn01 text02 cursor-pointer ${
                  filters.period == "weekly" ? "active" : ""
                }`}
                data-toggle="tab"
                // href="#Weekly"
                onClick={(e) => handleSelectedPeriod("weekly")}
              >
                Weekly
              </div>
              <div
                className={`nav-link btn01 text02 cursor-pointer ${
                  filters.period == "daily" ? "active" : ""
                }`}
                data-toggle="tab"
                // href="#Daily"
                onClick={(e) => handleSelectedPeriod("daily")}
              >
                Daily
              </div>
              <button
                className="flex items-center hover:underline"
                onClick={(e) => handleResetFilter(e)}
              >
                Reset <FontAwesomeIcon icon={faArrowsRotate} className="ml-1" />
              </button>
            </div>
          </div>
          {/* <!-- End-Nav tabs --> */}
          {/* content 01 */}
          <div className="grid grid-cols-3 gap-3 layout01">
            {/* Land */}
            <div className="layout02">
              <div className="flex items-center text-3xl mb-2">
                <img
                  className="mr-1"
                  src="/assets/images/icons/square.svg"
                  alt="land-icon"
                />
                Land
              </div>

              <div className="text-lg">
                <div className="flex justify-between">
                  <div>YAAMO:</div>
                  <div>
                    {filters.period !== ""
                      ? lands.yaamo.bought.length
                      : lands.yaamo.supply}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>SUT:</div>
                  <div>
                    {filters.period !== ""
                      ? lands.sut.bought.length
                      : lands.sut.supply}
                  </div>
                </div>
              </div>
            </div>
            {/* End-Land */}
            {/* Asset */}
            <div className="layout03">
              <div className="flex justify-between items-center text-3xl mb-2">
                <div className="flex">
                  <img
                    className="mr-1"
                    src="/assets/images/icons/land.svg"
                    alt="land-icon"
                  />
                  <span>Asset</span>
                </div>
                <div>{assets.supply}</div>
              </div>

              <div className="text-lg">
                <div className="flex justify-between">
                  <div>Verified:</div>
                  <div>{assets.verified}</div>
                </div>
                <div className="flex justify-between">
                  <div>Non verify:</div>
                  <div>{assets.nonVerify}</div>
                </div>
              </div>
            </div>
            {/* End-Asset */}
            {/* Users Access */}
            <div className="layout04">
              <p className="text03">Users Access</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <img
                    alt=""
                    className="locationimg"
                    src="/assets/images/icons/location.svg"
                  />
                  <p className="text06">Yaamo</p>
                  <br />
                  <img
                    alt=""
                    className="locationimg"
                    src="/assets/images/icons/location.svg"
                  />
                  <p className="text06">Sut</p>
                </div>
                <div className="layout05" align="right">
                  <p className="text06">40</p>
                  <br />
                  <p className="text06">11</p>
                </div>
              </div>
            </div>
            {/* End-Users Access */}
          </div>
          {/* End-content 01 */}
          {/* content 02 Charts */}
          <div className="grid grid-cols-6 gap-4 pt-3" Align="center">
            <div className="col-start-1 col-end-7 layout06">
              <Bar
                data={chartData}
                width={500}
                height={400}
                options={{
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          {/* End-content 02 table*/}
          {/* content 03 table laster buyland - asset */}
          <div className="grid grid-cols-2 gap-3 mt-4" Align="center">
            {/* table left */}
            <div className="layout07 custom-scrollbar" Align="left">
              {/* header table */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text07 px-6 py-3">Lasted buy land</p>
                </div>
                <div className="layout05 py-3" align="right">
                  <a href="#">
                    <svg
                      className="h-5 w-5 text-white bg-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {" "}
                      <polyline points="15 3 21 3 21 9" />{" "}
                      <polyline points="9 21 3 21 3 15" />{" "}
                      <line x1="21" y1="3" x2="14" y2="10" />{" "}
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </a>
                </div>
              </div>
              {/* End-header table */}
              {/* content table left */}
              <div className="sm:rounded-lg">
                <table className="w-full text-left">
                  <thead className="text08">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Map
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Wallet
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="odd:bg-white even:bg-gray-50">
                      <th scope="row" className="px-6 py-4">
                        <p className="text09">Yamoo</p>
                        <p className="text10">07/05/2022 - 12.00 H</p>
                      </th>
                      <td className="px-6 py-4">
                        <p className="text09">10 Land</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text09">0xe4f08...bc6c</p>
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-gray-50">
                      <th scope="row" className="px-6 py-4">
                        <p className="text09">Yamoo</p>
                        <p className="text10">07/05/2022 - 12.00 H</p>
                      </th>
                      <td className="px-6 py-4">
                        <p className="text09">10 Land</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text09">0xe4f08...bc6c</p>
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-gray-50">
                      <th scope="row" className="px-6 py-4">
                        <p className="text09">Yamoo</p>
                        <p className="text10">07/05/2022 - 12.00 H</p>
                      </th>
                      <td className="px-6 py-4">
                        <p className="text09">10 Land</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text09">0xe4f08...bc6c</p>
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-gray-50">
                      <th scope="row" className="px-6 py-4">
                        <p className="text09">Yamoo</p>
                        <p className="text10">07/05/2022 - 12.00 H</p>
                      </th>
                      <td className="px-6 py-4">
                        <p className="text09">10 Land</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text09">0xe4f08...bc6c</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* content table left */}
            </div>
            {/* End-table left */}
            {/* table right */}
            <div className="layout07" Align="left">
              {/* header table */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text07 px-6 py-3">Asset</p>
                </div>
                <div className="layout05 py-3" align="right">
                  <a href="#">
                    <svg
                      className="h-5 w-5 text-white bg-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {" "}
                      <polyline points="15 3 21 3 21 9" />{" "}
                      <polyline points="9 21 3 21 3 15" />{" "}
                      <line x1="21" y1="3" x2="14" y2="10" />{" "}
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </a>
                </div>
              </div>
              {/* End-header table */}
              {/* content table right */}
              <div className="sm:rounded-lg">
                <table className="w-full text-left">
                  <thead className="text08">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Asset Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Collection
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="odd:bg-white even:bg-gray-50">
                      <th scope="row" className="px-6 py-4">
                        <p className="text09-1">CoffeeCafe_01</p>
                        <p className="text09-2"> 2x2</p>
                        <p className="text10">07/05/2022 - 12.00 H</p>
                      </th>
                      <td className="px-6 py-4">
                        <p className="text09">StoreColl_01</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text09">1000 Class</p>
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-gray-50">
                      <th scope="row" className="px-6 py-4">
                        <p className="text09-1">CoffeeCafe_01</p>
                        <p className="text09-2"> 2x2</p>
                        <p className="text10">07/05/2022 - 12.00 H</p>
                      </th>
                      <td className="px-6 py-4">
                        <p className="text09">StoreColl_01</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text09">1000 Class</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* content table right */}
            </div>
            {/* End-table right */}
          </div>
          {/* End-content 03 table laster buyland - asset */}
        </div>
      </div>
      {/* MEIJI */}
    </>
  );
}

export default Dashboard;

Dashboard.layout = Mainlayout;
