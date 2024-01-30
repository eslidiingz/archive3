import Link from "next/link";
import { Button, Dropdown } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useWalletContext } from "../../context/wallet";
import { shortWallet } from "../../utils/misc";
import { useRouter } from "next/router";

function Topbar({ handleWallet }) {
  const router = useRouter();

  const { wallet, walletBalance, tokenSymbol, usdcBalance, walletAction } = useWalletContext();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const copyWalletAddress = () => {
    let copyText = document.getElementById('wallet-hidden')

    navigator.clipboard.writeText(copyText.value);

    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied";
  }

  const defaultCopayWallet = () => {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "copy";
  }


  return (
    <>
      <div className="navbar">
        <Button
          variant="primary"
          className="d-lg-none d-block btn-Offcanvas-sm"
          onClick={handleShow}
        >
          <i className="fas fa-ellipsis-v"></i>
        </Button>
        <Link href="/">
          <div className="d-flex align-items-center">
            <img src="/assets/image/nav/logoW.svg" className="img_topbarLogo" />
            <p className="mb-0 text_topbarLogo">SIAM CANNABIS</p>
          </div>
        </Link>

        <div className="navbar-right ps-0 ps-lg-4">
          <div className="wallet-address d-none d-md-flex">
            <button
              // className="btn btn-connect"
              className={wallet ? "d-none" : "btn btn-connect"}
              onClick={(e) => handleWallet()}
            >
              {wallet
                ? "Wallet Address:" + `${shortWallet(wallet)}`
                : "Connect Wallet"}
            </button>
          </div>

          <Dropdown>
            <Dropdown.Toggle
              variant="user-btn pe-0"
              id="dropdown-basic"
              align="end"
            >
              {/* <img src="/assets/image/nav/046-user 1.svg"/> */}
              <div
                className={
                  wallet
                    ? "d-md-flex d-none justify-content-center align-items-center btn-connect-dropdown"
                    : "d-none"
                }
              >
                <img
                  src="/assets/image/nav/046-user 1.svg"
                  className="img-filter_connect d-none d-md-flex"
                />
                <p className="mx-2">
                  {wallet ? "Wallet : " + `${shortWallet(wallet)}` : " "}
                </p>
              </div>
              <img
                src="/assets/image/nav/046-user 1.svg"
                className="d-block d-md-none"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <div className="dropdown-info d-flex d-md-none">
                <div className="user-account">
                  {/* connect wallet moblie ver  */}
                  <div
                    className={
                      wallet
                        ? "d-none"
                        : "cursor-pointer text-connect wallet-address"
                    }
                    onClick={(e) => handleWallet()}
                  >
                    {wallet
                      ? "Wallet Address:" + `${shortWallet(wallet)}`
                      : "Connect Wallet"}
                  </div>
                  {/* End-connect wallet moblie ver  */}

                  <div className={wallet ? "wallet-address" : "d-none"}>
                    <div className="wallet-address-title ">
                      Your Wallet Address
                    </div>
                    <div className="wallet-address-address">
                      {wallet ? shortWallet(wallet) : "-"}
                    </div>
                  </div>
                </div>
              </div>

              <Dropdown.Divider className="d-flex d-md-none" />
              <div className="dropdown-info">
                <div className="coin">
                  <div className="coin-img">
                    <img src="/assets/image/card/coin-usdc.svg" />
                  </div>
                  <div className="coin-value">{usdcBalance ?? 0}</div>
                  <div className="coin-name">USDC</div>
                </div>
                <div className="coin">
                  <div className="coin-img">
                    <img src="/assets/image/card/coin-cnb.svg" />
                  </div>
                  <div className="coin-value">{walletBalance ?? 0}</div>
                  <div className="coin-name">CNB</div>
                </div>
              </div>
              {wallet && (
                <>
                  <hr />
                  <div className="mx-5 mb-2">
                    <button
                      type="buttom"
                      className="btn-time btn "
                      onClick={router.reload}
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </Dropdown.Menu>
            {wallet ? (
              <span
                className="btn btn-secondary p-2 btn-copy-wallet"
                onClick={copyWalletAddress}
                onMouseOut={defaultCopayWallet}
              >
                <i
                  className="fas fa-copy"
                  role="button"
                  title="copy wallet address"
                ></i>
                <span class="tooltiptext" id="myTooltip">
                  Copy
                </span>
                <input
                  type="hidden"
                  id="wallet-hidden"
                  name="walletAddressHidden"
                  value={wallet}
                />
              </span>
            ) : (
              ""
            )}
          </Dropdown>
        </div>

        <Offcanvas
          className="ci-bg-green"
          show={show}
          onHide={handleClose}
          placement="start"
        >
          <Offcanvas.Header
            closeButton
            className="set-btn-close"
          ></Offcanvas.Header>
          <Offcanvas.Body>
            <Sidebar />
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
}
export default Topbar;
