import { LandMaintenanceContext } from "context/LandMaintenanceContext";
import React, { useContext } from "react";

const FunctionOwnerOf = () => {
  const { params, setParams, onParamsChange, smartContract } = useContext(
    LandMaintenanceContext
  );

  /** Owner Of */
  const submitOwnerOf = async (e) => {
    if (params.ownerOf && parseInt(params.ownerOf) >= 0) {
      const rsOwnerOf = await smartContract.ownerOf(params.ownerOf);
      setParams((prevParam) => ({
        ...prevParam,
        ownerOfResult: rsOwnerOf,
      }));
    }
  };

  return (
    <div className="section-group-function">
      <div className="input-group mt-2">
        <button className="button-primary" onClick={(e) => submitOwnerOf()}>
          ownerOf
        </button>
        <input
          type="number"
          className="input"
          placeholder="tokenId"
          name="ownerOf"
          onChange={(e) => onParamsChange(e)}
          value={params.ownerOf}
        />
      </div>
      <div className="section-funciton-result">
        {params.ownerOfResult && `address: ${params.ownerOfResult}`}
      </div>
    </div>
  );
};

export default FunctionOwnerOf;
