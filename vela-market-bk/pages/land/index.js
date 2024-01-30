import { useState, useEffect } from "react";

import Link from "next/link";
import {
  auctionContract,
  avatarContract,
  getMetadata,
  getWalletAccount,
  itemContract,
  marketplaceContract,
  landContract,
  getTokenSymbol
} from "../../utils/web3/init";
import CardListing from "../../components/collections/card-listing";
import { numberFormat, untilTime, convertWeiToEther } from "../../utils/number";
import image from '../../public/image/map/1.png';
import Land from '../../utils/land/map.json';
const MainLand = () => {
    const [mapData, setMap] = useState([]);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState(10);
    const formatArray = () => {
      setLoading(true);
      let newArr = [];
      Land.map((ele, index) => {
        if(!newArr[199 -ele.y]) newArr[199 - ele.y] = [];
        newArr[199 - ele.y][ele.x]= ele;
      });
      setMap(newArr);
      console.log(newArr);
      setLoading(false);
    }
    useEffect(() => {
      formatArray();
    }, []);
    return (
      <div>
        <input type="number" value={size} step="10" onChange={(e) => setSize(e.target.value)} />
        <div style={{overflow: 'auto'}}>
          {
            mapData.map((x, indexX) => {
              return <div key={indexX} style={{display: 'flex', flexWrap: 'unset'}}>
                {
                  x.map((y, indexY) => {
                    return <div onClick={() => {console.log("CLICK")}} key={indexY} style={{flex:`0 0 ${size}px`, height: `${size}px`, color: "#fff", backgroundImage: `url(/image/map/${y.prefabId}.png)`, backgroundSize: "100%"}}>
                      {/* {y.x + ", " + y.y} */}
                    </div>
                  })
                }
              </div>
            })
          }
        </div>
      </div>
    )
}

export default MainLand;