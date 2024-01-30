import Link from "next/link";
import ConnectWallet from "../apps/connect-wallet";
import { getBalance, getTokenSymbol } from "../../utils/web3/init";
import { useEffect, useState } from "react";
import { openProcess } from "../../utils/config.json";

const Header = () => {
  useEffect(() => {
    getAccountBalance();
  }, []);

  const [balance, setBalance] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);

  async function getAccountBalance() {
    setBalance(await getBalance());
    setTokenSymbol(await getTokenSymbol());
  }

  return (
    <header className="epic-topbar" id="header">
      <div className="epic-topbar-bg"></div>
      <nav aria-label="Top" className="mx-auto px-2 sm:px-4 epic-nav">
        <div className="">
          <div className="h-16 flex items-center justify-between">
            <div className="flex">
              <div className="ml-2 flex items-center lg:hidden">
                <button
                  type="button"
                  className="bg-white p-2 rounded-md text-gray-400"
                >
                  <span className="sr-only">Open menu</span>

                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="dropdown flex-1 flex items-center justify-end">
              {balance !== null && (
                <div className="topbar-fill-btn mr-2">
                  {balance}
                  <span className="mx-1">{tokenSymbol}</span>
                </div>
              )}
              <ConnectWallet />
            </div>
            <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right translate-y--20">
              <div
                className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                aria-labelledby="headlessui-menu-button-1"
                id="headlessui-menu-items-117"
                role="menu"
              >
                {/* <div className="px-4 py-3">
                  <p className="text-sm leading-5">Signed in as</p>
                  <p className="text-sm font-medium leading-5 text-gray-900 truncate"></p>
                </div> */}
                <div className="py-2 px-4">
                  <Link href={`/profile/mynft`}>
                    <a className="p">Collected</a>
                  </Link>
                </div>
                {openProcess && (
                  <>
                    <div className="py-2 px-4">
                      <Link href={`/placements`}>
                        <a className="p">Placements List</a>
                      </Link>
                    </div>
                    <div className="py-2 px-4">
                      <Link href={`/profile/offers`}>
                        <a className="p">Offer Received</a>
                      </Link>
                    </div>
                  </>
                )}

                {/* <div className="py-2 px-4">
                  <a className="p">Sign out</a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
