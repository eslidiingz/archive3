import { LandMaintenanceContext } from "context/LandMaintenanceContext";
import React, { useContext } from "react";

const FunctionGetLandByToken = () => {
  const { params, setParams, onParamsChange, smartContract } = useContext(
    LandMaintenanceContext
  );

  /** Get land by token ID */
  const submitGetLandByToken = async (e) => {
    if (params.getLandByToken && parseInt(params.getLandByToken) >= 0) {
      const rsGetLandByToken = await smartContract.getLandsByToken(
        params.getLandByToken
      );
      setParams((prevParam) => ({
        ...prevParam,
        getLandByTokenResult: rsGetLandByToken,
      }));
    }
  };

  return (
    <div className="section-group-function">
      <div className="input-group mt-2">
        <button
          className="button-primary"
          onClick={(e) => submitGetLandByToken()}
        >
          GetLandByToken
        </button>
        <input
          type="number"
          className="input"
          placeholder="tokenId"
          name="getLandByToken"
          onChange={(e) => onParamsChange(e)}
          value={params.getLandByToken}
        />
      </div>
      <div className="section-funciton-result">
        {params.getLandByTokenResult &&
          `
          x=${parseInt(Number(params.getLandByTokenResult.x))},
          y=${parseInt(Number(params.getLandByTokenResult.y))},
          tokenId=${parseInt(Number(params.getLandByTokenResult.tokenId))},
          isLocked=${params.getLandByTokenResult.isLocked}
          `}
      </div>
    </div>
  );
};

export default FunctionGetLandByToken;
