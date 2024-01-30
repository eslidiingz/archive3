import Mainlayout from "components/layouts/Mainlayout";
import Config from "configs/config";
import { useState } from "react";
import { smartContact } from "utils/models/contract";
import { LandMaintenanceContext } from "context/LandMaintenanceContext";

import { IconLandMaintenance } from "components/layouts/Sidebar";
import FunctionOwnerOf from "components/LandMaintenance/FunctionOwnerOf";
import FunctionGetLandByToken from "components/LandMaintenance/FunctionGetLandByToken";
import { getGql } from "utils/models/gql";

const landABI = require("../../utils/abis/production/land.json");
const paramsOrigin = {
  ownerOf: "",
  ownerOfResult: "",
  getLandByToken: "",
  getLandByTokenResult: "",
};

const LandMaintenancePage = () => {
  const [caSelected, setCaSelected] = useState(Config.LAND.KORAT.YAAMO);
  const [curAttach, setCurAttach] = useState({
    map: "",
    ca: "",
  });

  const [smartContract, setSmartContract] = useState();

  /** Smart Contract Function Render */
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalIndexer, setTotalIndexer] = useState(0);
  const [indexerArray, setIndexerArray] = useState([]);
  const [diffArray, setDiffArray] = useState([]);
  const [params, setParams] = useState(paramsOrigin);
  const [isLoading, setIsLoading] = useState(false);

  const attachSmartContract = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setParams(paramsOrigin);

    Object.keys(Config.LAND).map((zone) => {
      Object.entries(Config.LAND[zone]).map((map) => {
        const [mapKey, mapCA] = map;
        if (caSelected === mapCA) {
          setCurAttach({
            map: mapKey,
            ca: mapCA,
          });
        }
      });
    });

    const sm = smartContact(landABI, caSelected);
    setSmartContract(sm);

    setTotalSupply(parseInt(Number(await sm.totalSupply())));

    await queryIndexer();
    setIsLoading(false);
  };

  const _query = (_contractAddress) => {
    return `
      eve_log2_aggregate(where: {sm_addr: {_eq: "${_contractAddress}"}}) {
        aggregate {
          count(columns: sm_addr)
        }
      }
      eve_log2(where: {sm_addr: {_eq: "${_contractAddress}"}}, order_by: {token_id: asc}) {
        token_id
      }
    `;
  };

  const queryIndexer = async () => {
    const dataIndexer = await getGql(_query(caSelected));

    setTotalIndexer(dataIndexer?.eve_log2_aggregate?.aggregate?.count);
    setIndexerArray(dataIndexer?.eve_log2);

    const arrSupply = [];
    for (let index = 0; index < dataIndexer; index++) {
      arrSupply.push(index);
    }

    const arrQuery = [];
    dataIndexer.eve_log2.map((i) => {
      arrQuery.push(i.token_id);
    });

    const arrayDeff = arrSupply.filter((x) => !arrQuery.includes(x));
    setDiffArray(arrayDeff);
  };

  const onParamsChange = (e) => {
    setParams((prevParam) => ({
      ...prevParam,
      [e.target.name]: e.target.value,
    }));
  };

  const updateData = async (_token) => {
    const _tUpdate = {
      token_id: _token.map(String),
      sm_contract: caSelected,
    };

    const res = await fetch(`${Config.REST_API}/api/v1/update_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_tUpdate),
    });

    const tokenUpdated = await res.json();

    console.log("%c ========== tokenUpdated ==========", "color:lime");
    console.log(tokenUpdated);

    if (tokenUpdated) {
      alert("Update data success");

      location.reload();
      // Router.reload();
    }
  };

  return (
    <>
      <LandMaintenanceContext.Provider
        value={{ smartContract, params, onParamsChange, setParams }}
      >
        {isLoading && (
          <div className="bg-gray-900 bg-opacity-90 absolute inset-0">
            <div className="flex h-screen items-center justify-center text-7xl">
              <i className="fa fa-spinner fa-pulse mr-4 text-5xl"></i>
              Loading...
            </div>
          </div>
        )}
        <div className="flex justify-between items-end border-b pb-4">
          <h2>
            <IconLandMaintenance /> Land Maintenance
          </h2>

          <form onSubmit={(e) => attachSmartContract(e)}>
            <div className="input-group">
              <select
                className="input"
                onChange={(e) => setCaSelected(e.target.value)}
              >
                {Object.keys(Config.LAND).map((zone) => (
                  <optgroup label={zone}>
                    {Object.keys(Config.LAND[zone]).map((map) => (
                      <option value={Config.LAND[zone][map]}>{map}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <button className="button-primary">Attach</button>
            </div>
          </form>
        </div>

        {/* Contract function render */}
        <section>
          {curAttach.map && (
            <>
              <div className="flex justify-between items-center">
                <div className="text-2xl">
                  {`MAP::${curAttach.map} => `}
                  <span className="text-primary">{curAttach.ca}</span>
                </div>
                <div className="text-2xl flex space-x-3">
                  <div>
                    Total land:{" "}
                    <span className="text-primary">{totalSupply}</span>
                  </div>
                  <div>
                    Total Indexer:{" "}
                    <span className="text-primary">{totalIndexer}</span>
                  </div>
                  <div>
                    Diff:{" "}
                    <span className="text-primary">
                      {totalSupply - totalIndexer}
                    </span>
                  </div>
                </div>
              </div>
              <hr />

              <div className="flex">
                <div className="w-4/5">
                  <FunctionOwnerOf />
                  <FunctionGetLandByToken />
                </div>
                <div className="w-1/5">
                  {diffArray.length > 0 && (
                    <>
                      <div>Diff Data: [{diffArray.join(",")}]</div>
                      <button
                        className="bg-white text-black rounded px-4 py-1 text-sm hover:bg-gray-300"
                        onClick={(e) => updateData(diffArray)}
                      >
                        Update
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </LandMaintenanceContext.Provider>
    </>
  );
};

export default LandMaintenancePage;

LandMaintenancePage.layout = Mainlayout;
