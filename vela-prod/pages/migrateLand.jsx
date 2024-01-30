import { useEffect } from "react";
// import migrateData from "/migrateData2.json";

import Web3 from "web3";
import Config, { app } from "/utils/config";
import { getWalletAccount } from "../utils/web3/init";
import { toast } from "react-toastify";
import { ToastDisplay } from "/components/ToastDisplay";

var landABI;

if (app === "production") {
  landABI = require("/utils/abis/production/land.json");
} else if (app === "staging") {
  landABI = require("/utils/abis/staging/land.json");
} else {
  landABI = require("/utils/abis/local/land.json");
}

const web3 = new Web3(Web3.givenProvider || "https://rpc.velaverse.io");
export const landAddress = Config.LAND_ADDR;

export const smLand = new web3.eth.Contract(landABI, landAddress);

const MigrateLand = () => {
  const initialize = async () => {
    // console.log(
    //   "%c ==================== migrateData ====================",
    //   "color:yellow"
    // );
    // console.log(migrateData);
    // const account = await getWalletAccount();
    // migrateData.map(async (_data) => {
    //   for (const [owner, value] of Object.entries(_data)) {
    // const migrated = await smLand.methods
    //   .migrateLands(owner, value.x, value.y)
    //   .send({
    //     from: account,
    //   });
    //   }
    // });
  };

  const onMigrate = async (owner, arrX, arrY) => {
    const migrated = await smLand.methods.migrateLands(owner, arrX, arrY).send({
      from: await getWalletAccount(),
    });

    if (migrated && migrated.status) {
      toast(
        <ToastDisplay
          type="success"
          title="Success"
          description={`Migate: ${owner} successfully.`}
        />
      );
    }
  };

  return (
    <>
      <div className="text-xl">MIGRATE LAND</div>
      {/* 
      {migrateData.map((_data, k) => {
        for (const [owner, val] of Object.entries(_data)) {
          return (
            <>
              <div className="py-2 border-b" key={owner}>
                <div>{`N = ${k + 1}`}</div>
                <div>
                  <span className="text-orange-400">OWNER: </span>
                  {owner}
                </div>
                <div>
                  <span className="text-blue-400">X: </span>
                  {`[${val.x}]`}
                </div>
                <div>
                  <span className="text-green-400">Y: </span>
                  {`[${val.y}]`}
                </div>
                <div>
                  {typeof val.name !== "undefined" && (
                    <>
                      <span className="text-yellow-400">NAME: </span>
                      {val.name}
                    </>
                  )}
                </div>
                <button
                  className="btn-primary"
                  onClick={(e) => onMigrate(owner, val.x, val.y)}
                >
                  Migrate
                </button>
              </div>
            </>
          );
        }
      })} 
      */}
    </>
  );
};

export default MigrateLand;
