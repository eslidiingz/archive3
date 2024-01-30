import { useState, useEffect, useRef } from "react";

import {
  getBalanceToken,
  getTokenSymbol,
  checkTokenAllowance,
  approveToken,
} from "/utils/web3/token";

import Map2 from "/utils/land/map2.json";
import YaamoMap from "/utils/land/yaamo.json";
import SutMap from "/utils/land/sut.json";
import OldTownMap from "../../utils/land/oldTown.json";
import CrescentIsleMap from "/utils/land/crescentIsle.json";
import { convertEthToWei } from "/utils/number";
import ButtonState from "/components/button/button-state";
import { toast } from "react-toastify";
import { ToastDisplay } from "/components/ToastDisplay";
import hasWeb3 from "/utils/web3/validator";
import { getMetadata, getWalletAccount, web3 } from "../../utils/web3/init";
import Config from "../../utils/config";
import {
  getLandWithOwner,
  getLands,
  buyLands,
  getPricePerLand,
  getLandByTokenId,
  getLogs,
} from "../../utils/web3/land";
import { createAssetList } from "../../utils/api/asset-api";
import {
  putAssetCollection,
  putHolderCollection,
} from "../../utils/api/collection-api";
import { PanZoom } from "react-easy-panzoom";
import { landJsonDataToObjectArray } from "../../utils/web3/landApi";
import Link from "next/link";

const MainLand = (props) => {
  const defaultOwnerAddress = "0x0000000000000000000000000000000000000000";
  const adminSaleWallet = "0x3040C78A745845E7d0dae05fBDecd46F1E85Ce33";
  const canvasRef = useRef(null);
  const panZoomRef = useRef(null);

  const [mapData, setMap] = useState([]);
  const [lands, setLands] = useState([]);
  const [landsPurchased, setLandPurchased] = useState([]);
  const [landCurrentSelected, setLandCurrentSelected] = useState();
  const [myLands, setMyLands] = useState([]);
  const [myWallet, setMyWallet] = useState();
  const [modalContent, setModalContent] = useState({
    status: "token-enough",
    body: "Buy Land",
    state: "token-not-approve",
  });

  const [positionSelected, setPositionSelected] = useState({
    show: false,
    x: null,
    y: null,
    owner: null,
  });

  const [showWalletAddressInput, setShowWalletAddressInput] = useState(false);
  const [enteredWalletAddress, setEnteredWalletAddress] = useState("");

  const [ownerSelected, setOwnerSelected] = useState();

  /** Advertisement State */
  const [signature, setSignature] = useState(null);
  const [positionAds, setPositionAds] = useState({
    show: false,
    position: [],
    title: null,
    imageUrl: null,
    externalUrl: null,
    x: null,
    y: null,
    sizeX: 0,
    sizeY: 0,
    signature: "",
  });

  /** State toggle, option */
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonAction, setButtonAction] = useState(false);
  const [mapSelected, setMapSelected] = useState(
    props.mapName ? props.mapName.toLowerCase() : ""
  );
  const [mapAddress, setMapAddress] = useState(Config.LAND_OLD_TOWN_ADDR);
  const [mapId, setMapId] = useState(null);
  const [mapOptions, setMapOption] = useState([
    {
      label: "Old Town",
      value: "oldtown",
      ca: Config.LAND_OLD_TOWN_ADDR,
    },
    {
      label: "SUT",
      value: "sut",
      ca: Config.LAND_SUT_ADDR,
    },
    {
      label: "CRESCENTISLE",
      value: "crescentisle",
      ca: Config.CRESCENT_ISLE_ADDR,
    },
  ]);
  const [scale, setScale] = useState(100);
  const [size, setSize] = useState(12);
  const [landLimit, setLandLimit] = useState(50);
  const [sizeMapHorizontal, setSizeMapHorizontal] = useState(0);
  // const [sizeMapHorizontal, setSizeMapHorizontal] = useState(215);
  const [mode, setMode] = useState("normal");
  const [moved, setMoved] = useState(false);
  const [enterVelaverseLink, setEnterVelaverseLink] = useState(null);

  /** Maintenance */
  const [isMaintenance, setIsMaintenance] = useState(false);

  let dragGlobal = {
    status: false,
    drag: false,
  };

  /** Draw variables */
  const landSelectedColor = "#fff";
  const thickness = 1;

  /** Lands Modules */
  const loadMap = async () => {
    try {
      // console.log("%c ========== Load Map ==========", "color: yellow");

      // setPageLoading(true);
      // console.log(mapSelected);

      let _mapSize = 0;

      let mapDetected = OldTownMap;
      if (mapSelected?.toLowerCase() === "oldtown") {
        mapDetected = OldTownMap;
        _mapSize = 175;
      } else if (mapSelected?.toLowerCase() === "crescentisle") {
        mapDetected = CrescentIsleMap;
        _mapSize = 215;
      }

      setSizeMapHorizontal(_mapSize);

      let _facCA = mapOptions.filter((map, _) => {
        return map.value == mapSelected;
      });

      let addressMapLoad = _facCA[0].ca;

      // if (_facCA) {
      //   const rawMaps = await fetch(Config.GET_MAP_URI);
      //   const { result } = await rawMaps.json();
      //   var _mapId = null;
      //   console.log(result);
      //   if (result && result.length > 0) {
      //     _mapId = result.filter((m) => m.contract_address == addressMapLoad)[0]
      //       .id;
      //   }

      //   console.log("MAP ID", _mapId)

      //   setMapId(_mapId);
      //   setMapAddress(addressMapLoad);
      // }

      /** Set enter velaverse link */
      if (addressMapLoad == Config.LAND_OLD_TOWN_ADDR) {
        /** SUT map */
        setEnterVelaverseLink("https://multiplay.velaverse.io/oldtown");
      } else if (addressMapLoad == Config.CRESCENT_ISLE_ADDR) {
        /** crescentIsle map */
        setEnterVelaverseLink("https://multiplay.velaverse.io/crescentisle");
      } else {
        /** Yaamo map default */
        setEnterVelaverseLink("https://multiplay.velaverse.io/yaamo/");
      }

      let newMap = [];
      mapDetected.map((ele, index) => {
        if (!newMap[_mapSize - 1 - ele.y]) newMap[_mapSize - 1 - ele.y] = [];
        newMap[_mapSize - 1 - ele.y][ele.x] = ele;
      });

      let allLands = await getLands(addressMapLoad);

      allLands.map((land, index) => {
        //   // console.log("land", land);
        //   // let { owner_address, tokenId, json_data, type } = land;
        //   // json_data = json_data.replace(` ${type}`, "");
        //   // json_data = json_data.replace(` ${owner_address}`, "");
        //   // json_data = json_data.substr(2);
        //   // json_data = json_data.slice(0, -2);
        //   // json_data = json_data.split(`] [`);
        //   // // const landObject = landJsonDataToObjectArray(
        //   // //   json_data,
        //   // //   type,
        //   // //   owner_address
        //   // // );
        //   // const _xArray = json_data[0].split(" ");
        //   // const _yArray = json_data[1].split(" ");
        // console.log("index", index);
        // console.log("land", land);

        if (typeof newMap[_mapSize - 1 - land.y][land.x] !== "undefined") {
          newMap[_mapSize - 1 - land.y][land.x].tokenId = land.token_id;
          newMap[_mapSize - 1 - land.y][land.x].owner = land.own_addr;
        }

        // console.log("index", index);
        // console.log(newMap[sizeMapHorizontal - 1 - land.y][land.x]);
      });

      // let containerBoxWidth = document.getElementById("box").clientWidth + 2;
      // let containerBoxHeight = document.getElementById("box").clientHeight + 2;
      // let positionX = (newMap[0].length * size - containerBoxWidth) / 4 - 2;
      // let positionY = (newMap.length * size - containerBoxHeight) / 4 - 2;

      // if (!moved) {
      //   panZoomRef.current.moveBy(-positionX, -positionY);
      //   setMoved(true);
      // }

      console.log("mapDetected", mapDetected, mapDetected.length);
      console.log("addressMapLoad", addressMapLoad);
      console.log("allLands", allLands);
      console.log("newMap", newMap);

      /** Set the map effect to { mapData } */
      setMap(newMap);
      setPageLoading(false);
      return addressMapLoad;
    } catch (e) {
      alert("error");
      console.log(e.message);
      // console.log("%c ========== Load Map Failed ==========", "color: gray");
      // console.log(e);
    }
  };

  const clearLandsSelected = async () => {
    if (lands.length) {
      if (mode === "normal") {
        let ctx = canvasRef.current.getContext("2d");
        let img = await setDrawImage(`/image/map/0.png`);

        lands.map((land) => {
          ctx.fillStyle = "#6b7280";
          ctx.drawImage(
            img,
            land.x * size,
            (sizeMapHorizontal - 1 - land.y) * size,
            size,
            size
          );
        });
      }

      setLands([]);
    }
  };

  const onCloseInfo = () => {
    setPositionSelected((prev) => ({
      ...prev,
      show: false,
    }));
  };

  const onApproveToken = async () => {
    setLoading(true);

    let approved = await approveToken(mapAddress).catch((e) =>
      toast(
        <ToastDisplay type="error" title="Failed" description={e.message} />
      )
    );

    if (approved.status) {
      setModalContent((prevState) => ({
        ...prevState,
        state: "token-approved",
      }));

      toast(
        <ToastDisplay
          type="success"
          title="Success"
          description="Token is Approved"
        />
      );
    }
    setLoading(false);
  };

  const fetchMyLands = async (addressMapLoad) => {
    if (hasWeb3()) {
      let _myLands = await getLandWithOwner(addressMapLoad);

      // _myLands.map((_land, index) => {
      //   const landObject = landJsonDataToObjectArray(
      //     _land.json_data,
      //     _land.type,
      //     _land.owner_address
      //   );
      // });

      if (_myLands.length > 0) {
        setMyLands(_myLands);
      }
    }
  };

  const readinessCheck = async (addressMapLoad) => {
    let balance = await getBalanceToken();
    // let pricePerLand = await getPricePerLand(addressMapLoad);

    let symbol = await getTokenSymbol();

    if (balance < convertEthToWei(100)) {
      setModalContent({
        status: "token-not-enough",
        body: `${symbol} token not enough.`,
      });

      return;
    }

    let allowance = await checkTokenAllowance(addressMapLoad);

    if (allowance <= 0) {
      setModalContent((prevState) => ({
        ...prevState,
        state: "token-not-approve",
      }));
    } else {
      setModalContent((prevState) => ({
        ...prevState,
        state: "token-approved",
      }));
    }
  };

  /** Buy land send transaction to web3 */
  const onBuyLand = async () => {
    setLoading(true);
    setPageLoading(true);

    /** Check wallet connect */
    if (!myWallet) {
      toast(
        <ToastDisplay
          type="error"
          title="Failed"
          description="Please connect wallet before buy land."
        />
      );

      setLoading(false);
      setPageLoading(false);

      return;
    }

    /** Input show on admin wallet */
    if (!enteredWalletAddress) {
      toast(
        <ToastDisplay
          type="error"
          title="Failed"
          description="Please enter wallet address"
        />
      );
      setLoading(false);
      setPageLoading(false);
      return;
    } /** End Input show on admin wallet */

    if (lands.length > landLimit) {
      toast(
        <ToastDisplay
          type="error"
          title="Failed"
          description={`Cannot buy more than ${landLimit} land`}
        />
      );
      setLoading(false);
      setPageLoading(false);
      return;
    }

    let arrX = [];
    let arrY = [];

    lands.map((land) => {
      arrX.push(land.x);
      arrY.push(land.y);
    });

    // const account = await getWalletAccount();
    let bought = await buyLands(arrX, arrY, mapAddress).catch((e) => {
      toast(
        <ToastDisplay type="error" title="Failed" description={e.message} />
      );
      setLoading(false);
      setPageLoading(false);
    });

    if (bought && bought.status) {
      let transfers = bought.events.Transfer;
      console.log("RESPONSE =========");
      console.log("transfer", transfers, "bought", bought);

      if (!Array.isArray(transfers)) {
        transfers = [bought.events.Transfer];
      }

      const _token = transfers.map((tx) => tx.returnValues.tokenId);
      // const _token = bought?.events?.bought?.returnValues?.tokenId;
      if (_token) {
        await _token.map(async (item) => {
          const _land = await getLandByTokenId(mapAddress, item);
          const _landD = await getMetadata(_land);
          const data = {
            address: mapAddress,
            token: item,
            hash: _land.split("/ipfs/")[1],
            metadata: _land,
            image: _landD?.image_cdn,
            verify: "Y",
          };
          const _resultAsset = await createAssetList(data);
          const _assetsArray = await _resultAsset.json();
          await putAssetCollection(Config.LAND_COLLECTION, {
            asset: _assetsArray._id,
          });
          await putHolderCollection(Config.LAND_COLLECTION, {
            holder: await getWalletAccount(),
          });
        });
      }

      const _tUpdate = {
        token_id: _token.map(String),
        sm_contract: mapAddress,
      };

      // console.log("_tUpdate", _tUpdate);

      try {
        const res = await fetch(`${Config.REST_API}/api/v1/update_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_tUpdate),
        });

        const tokenUpdated = await res.json();

        // console.log("tokenUpdated", tokenUpdated);

        if (tokenUpdated) {
          const responseTransaction = await fetch(
            `${Config.FIAT_TRANSACTION_API}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                admin_wallet_address: myWallet,
                wallet_address: enteredWalletAddress,
                transaction_hash: bought.transactionHash,
                token_id: _tUpdate.token_id,
                coordinate_x: arrX,
                coordinate_y: arrY,
                map_name: props.mapName,
              }),
            }
          );

          const transactionInserted = await responseTransaction.json();
          console.log("SUCCESS", transactionInserted);
          if (transactionInserted.success) {
            // await drawReservedLand();
          }

          toast(
            <ToastDisplay
              type="success"
              title="Success"
              description="Buy land successfully"
            />
          );
        }
      } catch (error) {
        console.log("tokenUpdated", error);
      }

      // var ctx = canvasRef.current.getContext("2d");
      // var img = await setDrawImage(`/image/map/land-purchased.svg`);

      // lands.map((land) => {
      //   ctx.fillStyle = landSelectedColor;
      //   ctx.fillRect(
      //     land.x * size - thickness,
      //     (sizeMapHorizontal - 1 - land.y) * size - thickness,
      //     size + thickness * 2,
      //     size + thickness * 2
      //   );
      //   ctx.drawImage(
      //     img,
      //     land.x * size,
      //     (sizeMapHorizontal - 1 - land.y) * size,
      //     size,
      //     size
      //   );

      //   mapData[sizeMapHorizontal - 1 - land.y][land.x].owner = myWallet;
      // });

      /** Set my purchased display waiting sync data */
      let _landsPurchased = landsPurchased;
      _landsPurchased = _landsPurchased.concat(lands);

      setLandPurchased(_landsPurchased);

      setTimeout(() => {
        setEnteredWalletAddress("");
        setShowWalletAddressInput(false);
        setLands([]);
        setLoading(false);
        setPageLoading(false);
        initialize();
      }, 2000);
    }
  };

  const fetchReserveLand = async () => {
    try {
      const responseReserved = await fetch(`${Config.FIAT_TRANSACTION_API}`);
      const reserved = await responseReserved.json();
      // console.log("=====> uri ", `${Config.FIAT_TRANSACTION_API}`);
      // console.log("=====> reserved", reserved);
      if (reserved.success && Array.isArray(reserved.data)) {
        return reserved.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  /** Canvas */
  const setDraw = (border = "#fb923c", background = "transparent") => {
    var ctx = canvasRef.current.getContext("2d");

    ctx.strokeStyle = border;
    ctx.fillStyle = background;
    ctx.lineWidth = "1";

    return ctx;
  };

  /** Draw the map to canvas */
  const draw = async () => {
    if (mapData.length > 0) {
      const imgArr = await prepareImage();
      let xBox = mapData[0].length;
      let yBox = mapData.length;

      canvasRef.current.setAttribute("width", size * xBox + "px");
      canvasRef.current.setAttribute("height", size * yBox + "px");
      canvasRef.current.style.height = size * yBox + "px";

      let ctx = setDraw("rgba(255,255,255,0.3)");

      for await (const [indexA, valA] of mapData.entries()) {
        let valueA = mapData[indexA];
        for (let indexB = 0; indexB < valueA.length; indexB++) {
          let valueB = valueA[indexB];

          let x = indexB * size;
          let y = indexA * size;

          if (valueB?.prefabId) {
            ctx.drawImage(imgArr[valueB.prefabId], x, y, size, size);
          }

          let _cords = mapData[indexA][indexB];

          if (_cords?.owner && _cords.prefabId == 0) {
            if (_cords.owner !== defaultOwnerAddress) {
              let img = await setDrawImage(`/image/map/land-purchased.svg`);
              // let img = await setDrawImage(`/image/map/${_cords.prefabId}.png`);

              ctx.drawImage(img, x, y, size, size);
              if (_cords.owner == myWallet) {
                ctx.fillStyle = "#FFF";
                ctx.fillRect(
                  x - thickness,
                  y - thickness,
                  size + thickness * 2,
                  size + thickness * 2
                );
                ctx.drawImage(img, x, y, size, size);
              }
            } else {
              let img = await setDrawImage(`/image/map/0.png`);
              ctx.drawImage(img, x, y, size, size);
            }
          }
        }
      }

      // setTimeout(() => {
      await loadLandmark();
      // await drawReservedLand();

      if (mapId !== null) {
        /** Call [Fn] load advertise & Asset building */
        await loadOverlays();
        await loadBuildings();
      }

      // }, 2000);
    }
  };

  const drawReservedLand = async () => {
    try {
      const reservedLands = await fetchReserveLand();
      if (Array.isArray(reservedLands)) {
        const img = await setDrawImage(`/image/map/land-purchased.svg`);
        for (let indexC = 0; indexC < reservedLands.length; indexC++) {
          const reservedLand = reservedLands[indexC] || null;

          if (reservedLand) {
            const coordinateX = reservedLand.coordinate_x;
            const coordinateY = reservedLand.coordinate_y;

            for (let xIndex = 0; xIndex < coordinateX.length; xIndex++) {
              var ctx = canvasRef.current.getContext("2d");

              let landSelected =
                mapData[sizeMapHorizontal - coordinateY[xIndex] - 1][
                  coordinateX[xIndex]
                ];

              if (landSelected)
                landSelected.owner = reservedLand.wallet_address;

              ctx.drawImage(
                img,
                coordinateX[xIndex] * size,
                (sizeMapHorizontal - 1 - coordinateY[xIndex]) * size,
                size,
                size
              );
            }
          }
        }
      } else {
        // console.log("no data");
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const drawOwner = async (ownerAddress) => {
    var ctx = canvasRef.current.getContext("2d");

    if (ownerSelected !== null && ownerSelected != ownerAddress) {
      const _prevOwnerLands = await getLandWithOwner(mapAddress, ownerSelected);

      if (_prevOwnerLands != null && _prevOwnerLands.length > 0) {
        let img = await setDrawImage(`/image/map/land-purchased.svg`);

        _prevOwnerLands.map((land) => {
          const _ownerObjectLands = landJsonDataToObjectArray(
            land.json_data,
            land.type,
            ownerSelected
          );

          _ownerObjectLands._xArray.map((x, index) => {
            if (ownerSelected == myWallet) {
              const thickness = 1;
              ctx.fillStyle = "#fff";
              ctx.fillRect(
                x * size - thickness,
                (sizeMapHorizontal - 1 - _ownerObjectLands._yArray[index]) *
                  size -
                  thickness,
                size + thickness * 2,
                size + thickness * 2
              );
            }

            ctx.drawImage(
              img,
              x * size,
              (sizeMapHorizontal - 1 - _ownerObjectLands._yArray[index]) * size,
              size,
              size
            );
          });
        });
      }

      setOwnerSelected(ownerAddress);
    }

    if (ownerAddress != myWallet) {
      const _ownerLands = await getLandWithOwner(mapAddress, ownerAddress);

      _ownerLands.map((data) => {
        const _ownerObjectLands = landJsonDataToObjectArray(
          data.json_data,
          data.type,
          ownerAddress
        );

        _ownerObjectLands._xArray.map((x, index) => {
          ctx.fillStyle = `#${ownerAddress.substr(-6)}`;
          ctx.fillRect(
            x * size,
            (sizeMapHorizontal - 1 - _ownerObjectLands._yArray[index]) * size,
            size,
            size
          );
        });
      });
    }

    if (mapId !== null) {
      await loadOverlays();
      await loadBuildings();
    }
  };

  // Tools
  const setDrawImage = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.src = url;
    });
  };

  const prepareImage = async () => {
    var imgArr = [];
    for (let i = 0; i < 18; i++)
      imgArr[i] = await setDrawImage(`/image/map/${i}.png`);
    return imgArr;
  };

  const rawScale = () => {
    return scale * 0.01;
  };

  const clickCanvas = async (e) => {
    const clientX =
      e.type == "touchend" ? e.changedTouches[0].clientX : e.clientX;
    const clientY =
      e.type == "touchend" ? e.changedTouches[0].clientY : e.clientY;
    const rect = canvasRef.current.getBoundingClientRect();
    const elementRelativeX = clientX - rect.left;
    const elementRelativeY = clientY - rect.top;
    const canvasRelativeX = (elementRelativeX * canvas.width) / rect.width;
    const canvasRelativeY = (elementRelativeY * canvas.height) / rect.height;

    const tileX = Math.floor(canvasRelativeX / size);
    const tileY = sizeMapHorizontal - 1 - Math.floor(canvasRelativeY / size);

    try {
      let _landSelected = mapData[Math.floor(canvasRelativeY / size)][tileX];
      let ctx = setDraw();

      // console.log("%c ========== _landSelected ==========", "color: lime");
      // console.log(_landSelected);

      if (mode !== "ads") {
        // Mode normal
        if (
          _landSelected.prefabId == 0
          // &&
          // typeof _landSelected.owner === "undefined"
        ) {
          if (lands.length > 0) {
            let _found = lands.filter((land) => {
              return land.x == tileX && land.y == tileY;
            });

            if (_found.length > 0) {
              let ctx = setDraw("transparent");

              const imgArr = await prepareImage();

              ctx.drawImage(
                imgArr[0],
                tileX * size,
                Math.floor(canvasRelativeY / size) * size,
                size,
                size
              );

              let _removeIndex = lands.indexOf(_found[0]);
              let _tempLands = [...lands];
              _tempLands.splice(_removeIndex, 1);

              setLands(_tempLands);
            } else {
              if (lands.length >= landLimit) {
                return;
              }

              if (_landSelected.owner === defaultOwnerAddress) {
                ctx.fillStyle = landSelectedColor;
                ctx.fillRect(
                  tileX * size,
                  Math.floor(canvasRelativeY / size) * size,
                  size,
                  size
                );

                setLands((prevLands) => [
                  ...lands,
                  {
                    x: tileX,
                    y: tileY,
                  },
                ]);
              }
            }
          } else {
            if (_landSelected.owner === defaultOwnerAddress) {
              setShowWalletAddressInput(true);
              setButtonAction(false);
              setLands((prevLands) => [
                ...lands,
                {
                  x: tileX,
                  y: tileY,
                },
              ]);

              ctx.fillStyle = landSelectedColor;
              ctx.fillRect(
                tileX * size,
                Math.floor(canvasRelativeY / size) * size,
                size,
                size
              );
            }
          }
        } else {
          if (typeof _landSelected.owner !== "undefined") {
            drawOwner(_landSelected.owner);
          }
        }

        if (_landSelected.prefabId == 0) {
          setPositionSelected({
            show: true,
            x: _landSelected.x,
            y: _landSelected.y,
            owner: _landSelected.owner,
          });
        }
      } else {
        /** Advertise Mode */
        setLandCurrentSelected(_landSelected);

        if (_landSelected.owner.toLowerCase() === myWallet.toLowerCase()) {
          if (lands.length > 0) {
            let _found = lands.filter((land) => {
              return land.x == tileX && land.y == tileY;
            });

            if (_found.length > 0) {
              ctx.fillStyle = "#00e6a4";
              ctx.fillRect(
                tileX * size,
                Math.floor(canvasRelativeY / size) * size,
                size,
                size
              );

              let _removeIndex = lands.indexOf(_found[0]);
              let _tempLands = [...lands];
              _tempLands.splice(_removeIndex, 1);

              setLands(_tempLands);
            } else {
              setLands((prevLands) => [
                ...lands,
                {
                  x: tileX,
                  y: tileY,
                },
              ]);

              ctx.fillStyle = landSelectedColor;
              ctx.fillRect(
                tileX * size,
                Math.floor(canvasRelativeY / size) * size,
                size,
                size
              );
            }
          } else {
            setLands((prevLands) => [...lands, _landSelected]);

            ctx.fillStyle = landSelectedColor;
            ctx.fillRect(
              tileX * size,
              Math.floor(canvasRelativeY / size) * size,
              size,
              size
            );
          }
        } else {
          return;
        }
      }

      /** Info Box */
    } catch (e) {}
  };

  /** Drawer Modules */
  const drawMyLands = async () => {
    const _myLands = await getLandWithOwner(
      mapAddress,
      await getWalletAccount()
    );

    // console.log("_myLands", _myLands);

    // console.log("%c ========== drawMyLands ==========", "color: green");
    // console.log(_myLands);

    if (_myLands.length > 0) {
      let ctx = canvasRef.current.getContext("2d");

      if (mode === "ads") {
        _myLands.map((_land, index) => {
          ctx.fillStyle = "#00e6a4";
          ctx.fillRect(
            _land.x * size - thickness,
            (sizeMapHorizontal - 1 - _land.y) * size - thickness,
            size + thickness * 2,
            size + thickness * 2
          );
          ctx.fillStyle = "#00e6a4";
          ctx.fillRect(
            _land.x * size,
            (sizeMapHorizontal - 1 - _land.y) * size,
            size,
            size
          );
        });
      } else {
        let img = await setDrawImage(`/image/map/land-purchased.svg`);

        _myLands.map((_land, index) => {
          ctx.fillStyle = landSelectedColor;
          ctx.fillRect(
            _land.x * size - thickness,
            (sizeMapHorizontal - 1 - _land.y) * size - thickness,
            size + thickness * 2,
            size + thickness * 2
          );
          ctx.drawImage(
            img,
            _land.x * size,
            (sizeMapHorizontal - 1 - _land.y) * size,
            size,
            size
          );
        });
      }
    } // _myLand.length > 0

    if (mapId !== null) {
      await loadOverlays();
      await loadBuildings();
    }
  };

  /** Advertise Mode Modules */
  const onAdvertiseMode = async () => {
    /** Close infomation land on normal mode */
    onCloseInfo();

    // console.log("%c ===== onAdvertiseMode =====", "color: orange;");

    if (lands.length == 0) {
      setPositionAds({ show: false, position: [], ads: null });
    }

    if (typeof landCurrentSelected !== "undefined") {
      if (landCurrentSelected.prefabId === 0 && lands.length > 0) {
        // console.log("landCurrentSelected", landCurrentSelected);
        // console.log("lands", lands);

        let _minX = 0,
          _minY = 0,
          _maxX = 0,
          _maxY = 0;

        lands.map((_land, _index) => {
          if (_index < 1) {
            _minX = _land.x;
            _maxX = _land.x;
            _minY = _land.y;
            _maxY = _land.y;
          } else {
            _minX = _land.x < _minX ? _land.x : _minX;
            _maxX = _land.x > _maxX ? _land.x : _maxX;
            _minY = _land.y < _minY ? _land.y : _minY;
            _maxY = _land.y > _maxY ? _land.y : _maxY;
          }
        });

        setPositionAds((prev) => ({
          ...prev,
          show: true,
          position: [...lands],
          x: _minX,
          y: _minY,
          sizeX: _maxX - _minX + 1,
          sizeY: _maxY - _minY + 1,
        }));
      }
    }
  };

  const toggleAdsMode = async () => {
    // Cleanup lands
    clearLandsSelected();

    if (mode !== "ads") {
      // Set mode to ads.
      setMode("ads");
      // Close info on normal mode.
      onCloseInfo();
      // Hide action button
      setButtonAction(false);
      setShowWalletAddressInput(false);
    } else {
      // Set mode to normal
      setMode("normal");
      // Close advertise box
      setPositionAds({ show: false, position: [], ads: null });
    }
  };

  const getLoginToken = async (_signature) => {
    try {
      const _f = await fetch(Config.LOGIN_URI, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature: _signature,
        }),
      });
      const _r = await _f.json();
      if (_r.status === false) return null;
      return _r.result.token;
    } catch {
      return null;
    }
  };

  const setAdvertisement = async () => {
    setLoading(true);

    if (!checkURL(positionAds.imageUrl)) {
      toast(
        <ToastDisplay
          type="error"
          title="Failed"
          description="Image type is incorrect!"
        />
      );

      setLoading(false);
      return;
    }

    const hashMsgMade = web3.utils.soliditySha3(Config.MSG_HASH, 1000);

    const _signature = await web3.eth.personal
      .sign(hashMsgMade, myWallet, "")
      .catch((e) => {
        setLoading(false);
        toast(
          <ToastDisplay type="error" title="Failed" description={e.message} />
        );
        return;
      });

    if (typeof _signature !== "undefined") {
      let req = {
        map_id: mapId,
        title: positionAds.title,
        point_x: positionAds.x,
        point_y: positionAds.y,
        size_x: positionAds.sizeX,
        size_y: positionAds.sizeY,
        image: positionAds.imageUrl,
        external_url: positionAds.externalUrl,
      };

      const _token = await getLoginToken(_signature);
      const _result = await fetch(Config.SET_ADS_URI, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${_token}`,
        },
        body: JSON.stringify(req),
      });

      const { status } = await _result.json();

      if (status == true) {
        toast(
          <ToastDisplay
            type="success"
            title="Success"
            description="Set advertisement successfull."
          />
        );

        setPositionAds({
          show: false,
          position: [],
          title: null,
          imageUrl: null,
          externalUrl: null,
          x: null,
          y: null,
          sizeX: 0,
          sizeY: 0,
          signature: "",
        });

        await draw();
      } else {
        toast(
          <ToastDisplay
            type="error"
            title="Failed"
            description="Cannot set advertisement."
          />
        );
      }

      setLoading(false);
    }
  };

  const setPosition = (e, type) => {
    if (type == "stop") {
      if (!dragGlobal.drag && e.type == "mouseup") {
        clickCanvas(e);
      }
      dragGlobal.drag = false;
    } else if (type == "start") {
      dragGlobal.drag = true;
    }
  };

  const loadLandmark = async () => {
    let ctxLandmark = canvasRef.current.getContext("2d");

    let mapDetected = YaamoMap;

    if (mapSelected === "yaamo") {
      mapDetected = YaamoMap;

      let landmarkImage = await setDrawImage(`/image/map/yaamo-landmark.svg`);

      ctxLandmark.drawImage(
        landmarkImage,
        96 * size,
        (sizeMapHorizontal - 1 - 125) * size,
        50 * size,
        51 * size
      );
      // 95, 126 = 8*50s
    } else if (mapSelected === "oldtown") {
      mapDetected = OldTownMap;

      let landmarkImage = await setDrawImage(
        `/image/map/landmark-phuket-oldtown.jpg`
      );

      ctxLandmark.drawImage(
        landmarkImage,
        60 * size,
        (sizeMapHorizontal - 1 - 114) * size,
        55 * size,
        55 * size
      );
    } else if (mapSelected === "crescentIsle") {
      mapDetected = CrescentIsleMap;

      let landmarkImage = await setDrawImage(
        `/image/map/landmark-phuket-oldtown.jpg`
      );

      ctxLandmark.drawImage(
        landmarkImage,
        60 * size,
        (sizeMapHorizontal - 1 - 114) * size,
        55 * size,
        55 * size
      );
    }
  };

  const initialize = async () => {
    setMyWallet(await getWalletAccount());

    /** Load default map */
    let address = await loadMap();

    /** Precheck token for buy land */
    await readinessCheck(address);

    /** Retrived my land */
    await fetchMyLands(address);
  };

  const loadBuildings = async () => {
    let ctx = canvasRef.current.getContext("2d");
    const _result = await fetch(`${Config.URLGET_BUILDING}?map_id=${mapId}`);
    const _data = await _result.json();

    if (
      typeof _data.status === "undefined" ||
      _data.status !== true ||
      typeof _data.result === "undefined"
    )
      return console.warn(`Unable to fetch building.`);

    for (const ele of _data.result) {
      let imageBuilding = await setDrawImage(ele.building.image_cdn);

      let sizeX = ele.building.size_x;
      let sizeY = ele.building.size_y;

      ctx.drawImage(
        imageBuilding,
        ele.point_x * size,
        (sizeMapHorizontal - 1 - ele.point_y - (sizeY - 1)) * size,
        sizeX * size,
        sizeY * size
      );
    }
  };

  const loadOverlays = async () => {
    let ctxBuilding = canvasRef.current.getContext("2d");

    const rawResponse = await fetch(`${Config.GET_ADS_URI}?map_id=${mapId}`);
    const _data = await rawResponse.json();

    // console.log("%c ========== Ads loading ==========", "color: green");
    if (
      typeof _data.status === "undefined" ||
      _data.status !== true ||
      typeof _data.result === "undefined"
    )
      return console.warn(`Unable to fetch overlay.`);

    for await (const ele of _data.result) {
      try {
        if (checkURL(ele.image)) {
          let _sp = ele.image.split(":");
          let imageBuilding = await setDrawImage(_sp[1]);

          let sizeX = ele.size_x;
          let sizeY = ele.size_y;

          /** (Mapsize - 1 - Y) - (Asset size -1) **/
          ctxBuilding.drawImage(
            imageBuilding,
            ele.point_x * size,
            (sizeMapHorizontal - 1 - ele.point_y - (sizeY - 1)) * size,
            sizeX * size,
            sizeY * size
          );
        }
      } catch {
        // console.log(`Unable to load overlay image`);
      }
    }
  };

  // const checkURL = (url) => {
  //   return url.match(/\.(jpeg|jpg|png)$/) != null;
  // };

  const checkURL = (url) => {
    return url.match(/(https:).+(jpeg|jpg|png)$/) != null;
  };

  const test = async () => {};

  useEffect(() => {
    try {
      // drawReservedLand();

      initialize();
      test();
    } catch (error) {
      // console.log("%c ===== Error map: =====", error);
    }
  }, [mapSelected]);

  useEffect(() => {
    try {
      draw();
    } catch (error) {
      // console.log("%c ===== Error map: =====", error);
    }
  }, [mapData]);

  useEffect(() => {
    // console.log("%c ====== State Lands use Effect ======", "color: lime");
    // console.log(lands);
    try {
      if (mode !== "ads") {
        if (lands.length > 0) {
          if (myWallet != adminSaleWallet) {
            setEnteredWalletAddress(myWallet);
          }
          setShowWalletAddressInput(true);
          setButtonAction(true);
          setPositionSelected((prev) => ({
            ...prev,
            show: true,
          }));
        } else {
          setShowWalletAddressInput(false);
          setButtonAction(false);
          setPositionSelected((prev) => ({
            ...prev,
            show: false,
          }));
        }
      }
    } catch (error) {
      // console.log("%c ===== Error map: =====", error);
    }
  }, [lands, mode, positionAds]);

  useEffect(() => {
    drawMyLands();
  }, [mode]);

  useEffect(() => {
    /** Advertise Mode */
    if (mode === "ads") {
      onAdvertiseMode();
    }
  }, [landCurrentSelected, lands]);

  return (
    <>
      {isMaintenance ? (
        <>
          <div className="flex height-VH items-center justify-center">
            <div className="flex text-4xl">
              ปิดปรับปรุงระบบหน้าซื้อขายจนถึงวันที่ 31-05-2022
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="wapper-map2d">
            <div className="grid grid-cols-1 md:grid-cols-3 justify-items-stretch px-4 py-3">
              <div className="flex flex-col label-land-statuses py-2">
                <small className="text-[0.65rem] text-gray-300">
                  [MAP] {props.mapSlug}
                </small>

                <div className="flex space-x-4">
                  <div className="flex items-center">
                    {mode === "ads" ? (
                      <>
                        <div className="inline-flex w-4 h-4 bg-[#00e6a4]">
                          &nbsp;
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          className="w-4 h-4 border-2"
                          src="/image/map/land-purchased.svg"
                          alt="my-land"
                        />
                      </>
                    )}
                    <span className="mx-1">My lands</span>
                  </div>
                  <div className="flex items-center">
                    <div className="inline-flex w-4 h-4 bg-gray-500">
                      &nbsp;
                    </div>
                    <span className="mx-1">Avaiable</span>
                  </div>
                  <div className="flex items-center">
                    <img
                      className="w-4 h-4"
                      src="/image/map/land-purchased.svg"
                      alt="my-land"
                    />
                    <span className="mx-1">Purchased</span>
                  </div>
                </div>
              </div>

              <div className="justify-self-center">
                {buttonAction === true && (
                  <>
                    <div className="flex items-center">
                      <div style={{ lineHeight: "16px" }}>
                        <p className="mb-0 text-center">
                          Land selected: {lands.length}
                        </p>
                        <span className="text-yellow-400 text-[0.65rem] text-center mt-1">
                          *Buy limit 50 land per transaction.
                        </span>
                      </div>

                      {modalContent.status === "token-enough" && (
                        <>
                          <div className="ml-4">
                            {modalContent.state === "token-not-approve" && (
                              <ButtonState
                                onFunction={(e) => onApproveToken()}
                                text="Approve Token"
                                loading={loading}
                                classStyle="btn-primary"
                              />
                            )}

                            {modalContent.state === "token-approved" && (
                              <ButtonState
                                onFunction={(e) => onBuyLand()}
                                text="Buy Land"
                                loading={loading}
                                classStyle="btn-primary"
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-self-end">
                <div
                  className={`form-check form-switch mx-4 ${
                    myLands.length > 0 ? "" : "hidden"
                    // lands.length > 0 && mode === "normal" ? "hidden" : ""
                  }`}
                >
                  <input
                    className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                    type="checkbox"
                    role="switch"
                    onChange={(e) => toggleAdsMode()}
                  />
                  <label className="form-check-label inline-block text-white">
                    Switch Ads Mode
                  </label>
                </div>

                <ButtonState
                  onFunction={(e) => {
                    location.href = Config.URL_3D + "/" + props.mapName;
                  }}
                  text="Enter 3D Map"
                  classStyle="btn-primary"
                />

                <Link href={`${enterVelaverseLink}`}>
                  <a className="btn-primary ml-2">Enter Velaverse</a>
                </Link>
              </div>
            </div>
            {showWalletAddressInput && myWallet == adminSaleWallet && (
              <div className="flex items-center px-4 pb-3">
                <label htmlFor="walletAddress" className="w-auto mr-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  className="form-control w-auto"
                  value={enteredWalletAddress}
                  onChange={(e) =>
                    setEnteredWalletAddress(e.target.value.trim())
                  }
                  style={{
                    backgroundColor: "#FFF",
                    color: "black",
                    width: "500px",
                  }}
                />
              </div>
            )}

            {pageLoading === true && (
              <>
                <div
                  className="mapLoading flex justify-center items-center absolute left-0 right-0 z-10 h-4/5"
                  style={{ backgroundColor: "#8484849c" }}
                >
                  <svg
                    className="animate-spin -ml-1 mr-3 text-white h-12 w-12"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <div>Syncing Assets, Please Wait...</div>
                </div>
              </>
            )}

            {/* CANVAS */}
            <div id="box" className="mapper2d">
              <div
                className={`bg-white rounded-br-md text-black p-2 w-full max-w-sm absolute right-0 z-10 ${
                  !positionAds.show ? "hidden" : ""
                }`}
              >
                <div>
                  <div className="flex justify-between relative">
                    <div>Advertisements</div>
                  </div>
                  <div className="mt-1 text-xs">
                    <div className="mb-1">
                      <label className="mb-1 block">Company name:</label>
                      <input
                        type="url"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-1 text-xs"
                        placeholder="Company example"
                        onChange={(e) => {
                          setPositionAds((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }));
                        }}
                      />
                    </div>
                    <div className="mb-1">
                      <label className="mb-1 block">
                        Place your Image URL:
                      </label>
                      <input
                        type="url"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-1 text-xs"
                        placeholder="https://example.com/yourImage.jpg"
                        onChange={(e) => {
                          setPositionAds((prev) => ({
                            ...prev,
                            imageUrl: e.target.value,
                          }));
                        }}
                      />
                    </div>
                    <div className="mb-1">
                      <label className="mb-1 block">
                        Place your external URL:
                      </label>
                      <input
                        type="url"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-1 text-xs"
                        placeholder="https://example-shop.com"
                        onChange={(e) => {
                          setPositionAds((prev) => ({
                            ...prev,
                            externalUrl: e.target.value,
                          }));
                        }}
                      />
                    </div>

                    <div className="flex items-center mt-2">
                      <ButtonState
                        onFunction={() => setAdvertisement()}
                        loading={loading}
                        text={"Set Ads"}
                        classStyle="btn-primary px-1"
                      ></ButtonState>
                      <button
                        className="btn-gray mx-2"
                        onClick={(e) => {
                          setPositionAds({
                            show: false,
                            position: [],
                            ads: null,
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-white rounded-br-md text-black p-2 w-full max-w-sm absolute z-10 ${
                  !positionSelected.show ? "hidden" : ""
                }`}
              >
                <div>
                  <div className="flex justify-between relative">
                    <div>Information</div>
                    <button
                      className="text-xl cursor-pointer absolute z-20 top-[-10px] right-0"
                      onClick={(e) =>
                        setPositionSelected((prev) => ({
                          ...prev,
                          show: false,
                        }))
                      }
                    >
                      &times;
                    </button>
                  </div>
                  <div className="text-xs">
                    <span>Position: </span>[<span>X: {positionSelected.x}</span>
                    , <span>Y: {positionSelected.y}</span>]
                  </div>
                  <div
                    className={`text-xs ${
                      positionSelected.owner == null ? "hidden" : ""
                    }`}
                  >
                    Owner:{" "}
                    {positionSelected.owner !== defaultOwnerAddress
                      ? positionSelected.owner
                      : ""}
                  </div>
                </div>
              </div>
              <PanZoom
                onPanStart={(e) => setPosition(e, "start")}
                onPanEnd={(e) => setPosition(e, "stop")}
                enableBoundingBox={true}
                disableDoubleClickZoom={true}
                minZoom={0.4}
                maxZoom={4}
                realPinch={true}
                ref={panZoomRef}
              >
                <canvas id="canvas" ref={canvasRef}></canvas>
              </PanZoom>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MainLand;
