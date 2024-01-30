import { useState, useEffect } from "react";

import Link from "next/link";
import {
  getBalanceToken,
  getTokenSymbol,
  checkTokenAllowance,
  approveToken,
  revokeAllowance,
} from "../../utils/web3/token";
import Modal from "../../components/Modal";
import Land from "../../utils/land/map.json";
import Land1 from "../../utils/land/map1.json";
import Land2 from "../../utils/land/map2.json";
import { convertEthToWei, convertWeiToEther } from "../../utils/number";
import { getPricePerLand } from "../../utils/web3/factory";
import ButtonState from "/components/button/button-state";
import { landFactoryContract, getWalletAccount } from "../../utils/web3/init";
import { getWalletAddress } from "../../utils/wallet/connector";
const MainLand = () => {
  const [mapData, setMap] = useState([]);
  const [mapType, setMapType] = useState('map1');
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [landData, setLandData] = useState(null);
  const [modalContent, setModalContent] = useState({
    status: "token-enough",
    body: "Buy Land",
    state: "not-approve-token",
  });
  const onModalClosed = () => {
    setOpenModal(false);
  };
  const onApproveToken = async () => {
    setLoading(true);
    console.log("APPROVE");
    try {
      await approveToken();
      setModalContent({
        status: "token-enough",
        body: "Buy Land",
        state: "approved-token"
      })
    } catch(e) {
      if(e.code == 4001){
        setModalContent({
          status: "token-enough",
          body: "Approve Token",
          state: "not-approve-token"
        })
      }
    }
    setLoading(false);
  };
  const formatArray = () => {
    setLoading(true);
    let newArr = [];
    let maps = Land;
    if(mapType == "map1"){
      maps = Land1;
    } else if(mapType == "map2"){
      maps = Land2;
    }
    maps.map((ele, index) => {
      if (!newArr[199 - ele.y]) newArr[199 - ele.y] = [];
      newArr[199 - ele.y][ele.x] = ele;
    });
    setMap(newArr);
    console.log(newArr);
    setLoading(false);
  };
  const buyLand = async (data) => {
    console.log("mint LAND \nx: " + data.x + "\ny: " + data.y);

    let balance = await getBalanceToken();
    let pricePerLand = await getPricePerLand();

    let symbol = await getTokenSymbol();
    if (balance < convertEthToWei(pricePerLand)) {
      setModalContent({
        status: "token-not-enough",
        body: `${symbol} token not enough.`,
        // state: "not-approve-token",
      });
      setOpenModal(true);
      return;
    }
    let allowance = await checkTokenAllowance();
    if (allowance <= 0) {
      setModalContent((prevState) => ({
        ...prevState,
        state: "not-approve-token",
      }));
      setOpenModal(true);
      return;
      // let approved = await approveToken();

      // console.log(approved);
    }
    setModalContent({
      status: "token-enough",
      body: `buy land`,
      state: 'approved-token'
      // state: "not-approve-token",
    });
    setLandData(data);
    setOpenModal(true);
  };
  const finalBuyLand = async () => {
    console.log("BUY");
    let data = landData;
    let account = await getWalletAccount();
    let result = await landFactoryContract.methods.BuyLand(data.zoneId, data.x, data.y)
      .send({from : account})
      .on('sending', (sending) => {
        setLoading(true);
      })
      .on('receipt', (receipt) => {
        console.log(receipt);
      })
      .on('error', (error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    formatArray();

  }, [mapType]);
  return (
    <div className="bg-paper">
      <div className="text-right">
        <input
          type="number"
          value={size}
          step="10"
          onChange={(e) => setSize(e.target.value)}
        />
        <select
          name="cars"
          id="cars"
          onChange={(e) => {setMapType(e.target.value)}}
        >
          <option value="/land" selected disabled>
            SELECT LAND
          </option>
          <option value="map1">MAP1</option>
          <option value="map2">MAP2</option>
        </select>
      </div>
      <div style={{ overflow: "auto", maxHeight: "600px" }}>
        {mapData.map((x, indexX) => {
          return (
            <div key={indexX} style={{ display: "flex", flexWrap: "unset" }}>
              {x.map((element, indexY) => {
                return (
                  <div
                    onClick={() => {
                      buyLand(element);
                      setLandData(element);
                    }}
                    key={indexY}
                    style={{
                      flex: `0 0 ${size}px`,
                      height: `${size}px`,
                      color: "#fff",
                      backgroundImage: `url(/image/map/${element.prefabId}.png)`,
                      backgroundSize: "100%",
                    }}
                  >
                    {/* {y.x + ", " + y.y} */}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <Modal open={openModal} onClosed={onModalClosed}>
        {modalContent.status === "token-not-enough" && (
          <>
            <div className="text-center">
              <div className="text-red-600 mb-4">{modalContent.body}</div>
                <ButtonState 
                  onFunction={(e) => {buyLand()}}
                  text="Approve token"
                  loading={loading}
                  classStyle="btn-primary my-4"
                />
            </div>
          </>
        )}

        {modalContent.status === "token-enough" && (
          <>
            <div className="text-center">
              <div className="text-center uppercase">{modalContent.body}</div>
              {modalContent.state === "not-approve-token" ? (
                <>
                  <ButtonState
                    onFunction={(e) => onApproveToken()}
                    text="Approve Token"
                    loading={loading}
                    classStyle="btn-primary my-4"
                  />
                </>
              ) : 
              modalContent.state == "approved-token" && (
                <>
                  <ButtonState 
                    onFunction={(e) => {finalBuyLand()}}
                    text="Buy Land"
                    loading={loading}
                    classStyle="btn-primary my-4"
                  />
                </>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MainLand;
