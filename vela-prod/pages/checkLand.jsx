import Router from "next/router";
import React, { useEffect, useState } from "react";
import Config from "../utils/config";
import { getTotalSupply } from "../utils/web3/land";

const CheckLand = () => {
  const mapYaamoAddress = Config.LAND_ADDR;
  const mapSutAddress = Config.LAND_SUT_ADDR;
  const mapOldTownAddress = Config.LAND_OLD_TOWN_ADDR;

  const [yaamoSupply, setYaamoSupply] = useState(0);
  const [yaamoCount, setYaamoCount] = useState(0);
  const [yaamoArray, setYaamoArray] = useState([]);
  const [yaamoDiffData, setYaamoDiffData] = useState([]);

  const [sutSupply, setSutSupply] = useState(0);
  const [sutCount, setSutCount] = useState(0);
  const [sutArray, setSutArray] = useState([]);
  const [sutDiffData, setSutDiffData] = useState([]);

  const [oldTownSupply, setOldTownSupply] = useState(0);
  const [oldTownCount, setOldTownCount] = useState(0);
  const [oldTownArray, setOldTownArray] = useState([]);
  const [oldTownDiffData, setOldTownDiffData] = useState([]);

  const gqlQuery = async (_query, _variables) => {
    const _body = JSON.stringify({ query: _query, variables: _variables });

    const res = await fetch(`https://subgraph.velaverse.io/api/v1/gql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: _body,
    });

    return await res.json();
  };

  const _query = (_contractAddress) => {
    return `query MyQuery {
      eve_log2_aggregate(where: {sm_addr: {_eq: "${_contractAddress}"}}) {
        aggregate {
          count(columns: sm_addr)
        }
      }
      eve_log2(where: {sm_addr: {_eq: "${_contractAddress}"}}, order_by: {token_id: asc}) {
        token_id
      }
    }`;
  };

  const initialize = async () => {
    /** Yaamo */
    const _yaamoTotalSupply = await getTotalSupply(Config.LAND_ADDR);
    setYaamoSupply(_yaamoTotalSupply);

    const _qYaamo = await gqlQuery(_query(Config.LAND_ADDR));
    setYaamoCount(_qYaamo.eve_log2_aggregate.aggregate.count);
    setYaamoArray(_qYaamo.eve_log2);

    const _arrYaamoSupply = [];
    for (let index = 0; index < _yaamoTotalSupply; index++) {
      _arrYaamoSupply.push(index);
    }

    const _arrYaamoQuery = [];
    _qYaamo.eve_log2.map((i) => {
      _arrYaamoQuery.push(i.token_id);
    });

    const _YaamoDiff = _arrYaamoSupply.filter(
      (x) => !_arrYaamoQuery.includes(x)
    );
    setYaamoDiffData(_YaamoDiff);

    /** SUT */
    const _sutTotalSupply = await getTotalSupply(Config.LAND_SUT_ADDR);
    setSutSupply(_sutTotalSupply);

    const _qSut = await gqlQuery(_query(Config.LAND_SUT_ADDR));
    setSutCount(_qSut.eve_log2_aggregate.aggregate.count);
    setSutArray(_qSut.eve_log2);

    const _arrSutSupply = [];
    for (let index = 0; index < _sutTotalSupply; index++) {
      _arrSutSupply.push(index);
    }

    const _arrSutQuery = [];
    _qSut.eve_log2.map((i) => {
      _arrSutQuery.push(i.token_id);
    });

    const _SutDiff = _arrSutSupply.filter((x) => !_arrSutQuery.includes(x));
    setSutDiffData(_SutDiff);

    /** Old Town */
    const _OldTownTotalSupply = await getTotalSupply(Config.LAND_OLD_TOWN_ADDR);
    setOldTownSupply(_OldTownTotalSupply);

    const _qOldTown = await gqlQuery(_query(Config.LAND_OLD_TOWN_ADDR));
    setOldTownCount(_qOldTown.eve_log2_aggregate.aggregate.count);
    setOldTownArray(_qOldTown.eve_log2);

    const _arrOldTownSupply = [];
    for (let index = 0; index < _OldTownTotalSupply; index++) {
      _arrOldTownSupply.push(index);
    }

    const _arrOldTownQuery = [];
    _qOldTown.eve_log2.map((i) => {
      _arrOldTownQuery.push(i.token_id);
    });

    const _OldTownDiff = _arrOldTownSupply.filter((x) => !_arrOldTownQuery.includes(x));
    setOldTownDiffData(_OldTownDiff);
  };

  const action = async (mapAddress, _token) => {
    const _tUpdate = {
      token_id: _token.map(String),
      sm_contract: mapAddress,
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

    if(tokenUpdated) Router.reload();
    
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <div className="flex space-x-6 space-y-2 items-center">
        <div>Yaamo: {mapYaamoAddress}</div>
        <div>Total Supply: {yaamoSupply}</div>
        <div>Count: {yaamoCount}</div>
        <div>Diff: {yaamoSupply - yaamoCount}</div>
        <div>DiffData: [{yaamoDiffData.join(",")}]</div>
        <div>
          {yaamoDiffData.length > 0 && (
            <button
              className="bg-white text-black rounded px-4 py-1 text-sm hover:bg-gray-300"
              onClick={(e) => action(mapYaamoAddress, yaamoDiffData)}
            >
              Action
            </button>
          )}
        </div>
      </div>
      <div className="flex space-x-6 space-y-2 items-center">
        <div>SUT: {mapSutAddress}</div>
        <div>Total Supply: {sutSupply}</div>
        <div>Count: {sutCount}</div>
        <div>Diff: {sutSupply - sutCount}</div>
        <div>DiffData: [{sutDiffData.join(",")}]</div>
        <div>
          {sutDiffData.length > 0 && (
            <button
              className="bg-white text-black rounded px-4 py-1 text-sm hover:bg-gray-300"
              onClick={(e) => action(mapSutAddress, sutDiffData)}
            >
              Action
            </button>
          )}
        </div>
      </div>
      <div className="flex space-x-6 space-y-2 items-center">
        <div>Old Town: {mapOldTownAddress}</div>
        <div>Total Supply: {oldTownSupply}</div>
        <div>Count: {oldTownCount}</div>
        <div>Diff: {oldTownSupply - oldTownCount}</div>
        <div>DiffData: [{oldTownDiffData.join(",")}]</div>
        <div>
          {oldTownDiffData.length > 0 && (
            <button
              className="bg-white text-black rounded px-4 py-1 text-sm hover:bg-gray-300"
              onClick={(e) => action(mapOldTownAddress, oldTownDiffData)}
            >
              Action
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckLand;
