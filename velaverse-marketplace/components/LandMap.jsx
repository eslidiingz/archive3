import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { convertEthToWei, convertWeiToEther } from "/utils/number";
import { getPricePerLand } from "/utils/web3/factory";
import {
  getBalanceToken,
  getTokenSymbol,
  checkTokenAllowance,
  approveToken,
  revokeAllowance,
} from "/utils/web3/token";
import hasWeb3 from "/utils/web3/validator";
import Modal from "./Modal";
import ButtonState from "/components/button/button-state";

const LandMap = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    status: "token-enough",
    body: "Buy Land",
    state: "not-approve-token",
  });

  const rows = 20;
  const cols = 30;

  const buyLand = async (x, y) => {
    if(!hasWeb3()) {
      alert(`MetaMask is not available.`);
      return;
    };
    console.log("mint LAND \nx: " + x + "\ny: " + y);

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

      // let approved = await approveToken();

      // console.log(approved);
    }

    setOpenModal(true);
  };

  const onApproveToken = async () => {
    alert();
    let approved = await approveToken();
  };

  const revokeToken = async () => {
    let revoked = await revokeAllowance();
    console.log(revoked);
  };

  const onModalClosed = () => {
    setOpenModal(false);
  };

  useEffect(() => {}, []);

  return (
    <div className="">
      <Modal open={openModal} onClosed={onModalClosed}>
        {modalContent.status === "token-not-enough" && (
          <>
            <div className="text-center">
              <div className="text-red-600 mb-4">{modalContent.body}</div>
              <a href="#" className="btn-primary">
                Buy TOKEN
              </a>
            </div>
          </>
        )}

        {modalContent.status === "token-enough" && (
          <>
            <div className="text-center">
              <div className="text-center uppercase">{modalContent.body}</div>
              {modalContent.state === "not-approve-token" && (
                <>
                  <ButtonState
                    onFunction={(e) => onApproveToken}
                    text="Approve Token"
                    loading={loading}
                    classStyle="btn-primary my-4"
                  />
                  {/* <button className="btn-primary my-4" onClick={onApproveToken}>
                    Approve Token
                  </button> */}
                </>
              )}
            </div>

            {/* // <div className="flex justify-around my-4"> */}
            {/* <a
                href="#"
                className="inline-flex  justify-center bg-indigo-600 hover:bg-indigo-700 w-32 rounded text-white py-3"
              >
                TOKEN
              </a> */}
            {/* <a
                href="/payment/fait"
                className="inline-flex  justify-center bg-gray-600 hover:bg-gray-700 w-32 rounded text-white py-3"
              >
                FIAT
              </a> */}
            {/* </div> */}
          </>
        )}
      </Modal>

      {/* <button
        className="bg-white rounded px-4 py-1 mx-4"
        onClick={(e) => setOpenModal(true)}
      >
        Modal
      </button> */}

      {
        (hasWeb3())?
        <>
        <button className="bg-white rounded px-4 py-1" onClick={(e) => revokeToken()}>Revoke Token</button>
        <table className="text-xs font-thin text-gray-400 mx-auto">
          <tbody>
          {Array.from(Array(rows), (r, x) => {
            return (
              <tr key={x}>
                {Array.from(Array(cols), (c, y) => {
                  return (
                    <td
                      className="border text-center w-8 h-8 cursor-pointer hover:bg-gray-50"
                      onClick={(e) => buyLand(x, y)}
                      key={x+y}
                    >
                      {x},{y}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          </tbody>
        </table></>: (
          <div align="center">
              <div class="bg-red-100 border border-red-500 text-red-700 py-3 rounded relative" role="alert">
                <strong class="font-bold">ERROR!</strong>&nbsp; 
                <span class="block sm:inline">MetaMask is not available.</span>
              </div>
          </div>
        )
      }
    </div>
  );
};

export default LandMap;
