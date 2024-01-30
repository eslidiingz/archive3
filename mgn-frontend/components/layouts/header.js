import Link from "next/link";
import ConnectWallet from "../apps/connect-wallet";
import {
  getBalance,
  getTokenSymbol,
  getWalletAccount,
  web3,
} from "../../utils/web3/init";
import { useEffect, useState, useContext } from "react";
import Config from "../../utils/config";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { fetchWhitelistUser } from "../../utils/api/whitelist-api";
// import { useMoralis } from "react-moralis";
import { WalletContext } from "/pages/_app";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = (props) => {
  const router = useRouter();

  /** Use Context state */
  const { walletState, setWalletState } = useContext(WalletContext);

  const menuList = [
    {
      link: "/profile/mynft",
      name: "My Assets",
      show: true,
    },
    {
      link: "/profile/mycollection",
      name: "My Collections",
      show: Config.OPEN_PROCESS,
    },
    {
      link: "/placements",
      name: "Placements List",
      show: Config.OPEN_PROCESS,
    },
    {
      link: "/profile/offers",
      name: "Offer Received",
      show: Config.OPEN_PROCESS,
    },
  ];

  useEffect(() => {
    getAccountBalance();
  }, [props]);

  const [balance, setBalance] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const [roles, setRoles] = useState("");
  const [dir, setDir] = useState("/market");

  function onOpenMenu(e) {
    props.onOpenedMenu && props.onOpenedMenu(e);
    setActiveMenu(!activeMenu);
  }

  const [openDropdownMobile, setOpenDropdownMobile] = useState(false);

  function onOpenDropdown() {
    setOpenDropdownMobile(!openDropdownMobile);
  }

  useEffect(() => {
    router.events.on("routeChangeComplete", function () {
      setOpenDropdownMobile(false);
      setActiveMenu(false);
    });
    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf("/"));
    setDir(dir);
    fetchAdminRoles();
  }, [router]);

  const fetchAdminRoles = async () => {
    const account = "0xE40845297c6693863Ab3E10560C97AACb32cbc6C";
    // const account = await getWalletAccount();
    const { rows } = await fetchWhitelistUser(account);
    if (rows && rows.length > 0) {
      setRoles(rows[0]);
    }
  };

  async function getAccountBalance() {
    setBalance(await getBalance());
    setTokenSymbol(await getTokenSymbol());
  }

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow sticky top-0 z-50">
        {({ open }) => (
          <>
            <div className="mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href={"/"}>
                      <a>
                        <img
                          className="block lg:hidden h-10 w-auto"
                          src={"/assets/image/logofont.svg"}
                          alt="Weedblock"
                        />
                        <img
                          className="hidden lg:block h-10 w-auto"
                          src={"/assets/image/logofont.svg"}
                          alt="Weedblock"
                        />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center text-black">
                  {walletState.connected === true && (
                    <div className="show-coin">
                      {balance} {tokenSymbol}
                    </div>
                  )}

                  <div className="mr-2">
                    <ConnectWallet />
                  </div>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <div className="icon-user"></div>
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <ConnectWallet />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default Header;
