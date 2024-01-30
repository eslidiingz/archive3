import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { connectProvider, modalConnect } from "/utils/connector/provider";

function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [openSidebar, setOpen] = useState("false");
  const handleToggle = () => {
    setOpen(!openSidebar);
  };

  const connectWallet = async () => {
    const web3Modal = modalConnect();
    const instance = await web3Modal.connect();
    const provider = connectProvider(instance);
    const signer = provider.getSigner();
  };
  const changeNetwork = async () => {
    let params = {
      chainId: "0x" + Number(555).toString(16),
      chainName: "VELA1 Chain",
      nativeCurrency: {
        name: "CLASS",
        symbol: "CLASS",
        decimals: 18,
      },
      rpcUrls: ["https://rpc.velaverse.io/"],
      blockExplorerUrls: ["https://exp.velaverse.io"],
    };
    console.log(params);
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [params],
    });
  };

  useEffect(() => {
    connectWallet();
    changeNetwork();
  }, []);

  useEffect(() => {
    if (status == "unauthenticated") {
      // ไม่ล็อคอินเตะ
      window.location.href = "/signin";
    }
  }, [session]);

  return (
    <>
      <div className={`bg-sidebar relative ${openSidebar ? "open" : ""}`}>
        <div className="logo"></div>

        <div className="xl:hidden">
          <div
            className="w-full flex justify-center mb-5"
            onClick={handleToggle}
          >
            <img
              className="icon-ham"
              alt=""
              src="/assets/images/icons/hamburger.svg"
            />
          </div>
        </div>

        <div className="w-full">
          {/* <Link href="/dashboard">
						<div className={router.pathname == "/dashboard" ? "active py-2" : "py-2"}>
							<div className="flex justify-center xl:justify-between sidebar-menu mx-auto">
								<div className="flex items-center gap-5 menu">
									<img
										className="icon"
										src="/assets/images/icons/home.svg"
										alt=""
									/>
									<h4 className="text-menu">Dashboard</h4>
								</div>
								<img
									alt=""
									className="arrow"
									src="/assets/images/icons/next.svg"
								/>
							</div>
						</div>
					</Link> */}

          {/* <Link href="/land/reserve">
						<div
							className={
								router.pathname == "/land/reserve" ? "active py-2" : "py-2"
							}
						>
							<div className="flex justify-center xl:justify-between sidebar-menu mx-auto">
								<div className="flex items-center gap-5 menu">
									<img
										className="icon"
										src="/assets/images/icons/square.svg"
										alt=""
									/>
									<h4 className="text-menu">Land Reserve</h4>
								</div>
								<img
									alt=""
									className="arrow"
									src="/assets/images/icons/next.svg"
								/>
							</div>
						</div>
					</Link> */}

          {/* Land Menu */}
          <Link href="/land">
            <div
              className={router.pathname == "/land" ? "active py-2" : "py-2"}
            >
              <div className="flex justify-center xl:justify-between sidebar-menu mx-auto">
                <div className="flex items-center gap-5 menu">
                  <img
                    className="icon"
                    src="/assets/images/icons/square.svg"
                    alt=""
                  />
                  <h4 className="text-menu">Land</h4>
                </div>
                <img
                  alt=""
                  className="arrow"
                  src="/assets/images/icons/next.svg"
                />
              </div>
            </div>
          </Link>

          {/* Asset Menu */}
          <Link href="/asset">
            <div
              className={router.pathname == "/asset" ? "active py-2" : "py-2"}
            >
              <div className="flex justify-center xl:justify-between sidebar-menu mx-auto">
                <div className="flex items-center gap-5 menu">
                  <img
                    className="icon"
                    src="/assets/images/icons/land.svg"
                    alt=""
                  />
                  <h4 className="text-menu">Assets</h4>
                </div>
                <img
                  alt=""
                  className="arrow"
                  src="/assets/images/icons/next.svg"
                />
              </div>
            </div>
          </Link>

          <hr />

          {/* Checkland */}
          <Link href="/landMaintenance">
            <div
              className={
                router.pathname == "/landMaintenance" ? "active py-2" : "py-2"
              }
            >
              <div className="flex justify-center xl:justify-between sidebar-menu mx-auto">
                <div className="flex items-center gap-5 menu">
                  <IconLandMaintenance />
                  <h4 className="text-menu">Land Maintenance</h4>
                </div>
                <img
                  alt=""
                  className="arrow"
                  src="/assets/images/icons/next.svg"
                />
              </div>
            </div>
          </Link>

          {/* <Link href="/online-traffic">
						<div
							className={
								router.pathname == "/online-traffic" ? "active py-2" : "py-2"
							}
						>
							<div className="flex justify-center xl:justify-between sidebar-menu mx-auto">
								<div className="flex items-center gap-5 menu">
									<img
										className="icon"
										src="/assets/images/icons/chart.svg"
										alt=""
									/>
									<h4 className="text-menu">Online Traffic</h4>
								</div>
								<img
									alt=""
									className="arrow"
									src="/assets/images/icons/next.svg"
								/>
							</div>
						</div>
					</Link>

					<Link href="/ManageCreator">
						<div
							className={
								router.pathname == "/ManageCreator" ? "active py-2" : "py-2"
							}
						>
							<div className="flex justify-center xl:justify-between sidebar-menu mx-auto">
								<div className="flex items-center gap-5 menu">
									<img
										className="icon"
										src="/assets/images/icons/user.svg"
										alt=""
									/>
									<h4 className="text-menu">Manage Creator</h4>
								</div>
								<img
									alt=""
									className="arrow"
									src="/assets/images/icons/next.svg"
								/>
							</div>
						</div>
					</Link> */}
        </div>
      </div>
    </>
  );
}
export default Sidebar;

export const IconLandMaintenance = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 inline"
    >
      <path
        fillRule="evenodd"
        d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
        clipRule="evenodd"
      />
      <path d="M10.076 8.64l-2.201-2.2V4.874a.75.75 0 00-.364-.643l-3.75-2.25a.75.75 0 00-.916.113l-.75.75a.75.75 0 00-.113.916l2.25 3.75a.75.75 0 00.643.364h1.564l2.062 2.062 1.575-1.297z" />
      <path
        fillRule="evenodd"
        d="M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
};
