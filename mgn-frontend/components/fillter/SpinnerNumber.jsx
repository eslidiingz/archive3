// import { useState } from "react";
import React, { useState } from "react";
import Spinner from "../Spinner";

export default function SpinnerNumber({
  setInfoInputAmount,
  handleChangeTotalPrice,
  disabled = false,
}) {
  const [count, setCount] = useState(1);

  setInfoInputAmount(count);
  handleChangeTotalPrice(count);

  const handleChangeAmount = (enteredAmount) => {
    if (enteredAmount > 0) {
      setCount(enteredAmount);
    } else {
      setCount(0);
    }
  };

  return (
    <>
      <div className="modal_spinner">
        <div className="d-flex justify-content-center align-content-center align-items-center">
          <button
            className="btn-minus_spinner"
            disabled={disabled}
            onClick={() => handleChangeAmount(count - 1)}
          >
            <i className="fas fa-minus"></i>
          </button>
          <div className="layout-text_spinner">
            <p> {count} </p>
          </div>
          <button
            disabled={disabled}
            onClick={() => handleChangeAmount(count + 1)}
            className="btn-plus_spinner"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </>
  );
}
// export default Test;
