import Link from "next/link";
import ConnectWallet from "../apps/connect-wallet";
import {
  getBalance,
  getTokenSymbol,
  getWalletAccount,
  web3,
} from "../../utils/web3/init";
import { useEffect, useState, useContext, Fragment } from "react";
import Config from "../../utils/config";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

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
    {
      link: "/profile/asset-list",
      name: "Asset List",
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
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  function onOpenMenu(e) {
    props.onOpenedMenu && props.onOpenedMenu(e);
    setActiveMenu(!activeMenu);
  }

  const [openDropdownMobile, setOpenDropdownMobile] = useState(false);

  function onOpenDropdown() {
    setOpenDropdownMobile(!openDropdownMobile);
  }

  const fetchAdminRoles = async () => {
    const account = await getWalletAccount();
    const { rows } = await fetchWhitelistUser(account);
    if (rows && rows.length > 0) {
      setRoles(rows[0]);
    }
  };

  async function getAccountBalance() {
    setBalance(await getBalance());
    console.log("getTokenSymbol");
    setTokenSymbol(await getTokenSymbol());
  }

  const toggleSubMenuItems = (_currentActive) => {
    if (activeSubMenu == _currentActive) setActiveSubMenu(null);
    else setActiveSubMenu(_currentActive);
  };

  const handleMapSelected = (_mapName) => {
    window.location.href = `/land2d/${_mapName}`;
    // router.push(`/land2d/${_mapName}`);
  };

  const handleDemoSelected = (_mapName) => {
    window.location.href = `https://${_mapName}.velaverse.io/`;
    // router.push(`/land2d/${_mapName}`);
  };

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

  return (
    <>
      <div
        className={
          router.pathname == "/login"
            ? "hidden"
            : "" || router.pathname == "/register"
            ? "hidden"
            : "" || router.pathname == "/renew-password"
            ? "hidden"
            : "" || router.pathname == "/login/passcode"
            ? "hidden"
            : ""
        }
      >
        <Disclosure
          as="nav"
          className="bg-white shadow fixed top-0 left-0 right-0 z-50"
        >
          {/* <Disclosure as="nav" className="bg-white shadow sticky top-0 z-50"> */}
          {({ open }) => (
            <>
              <div className="max-screen-theme mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <Link href="https://www.velaverse.io/">
                        <a>
                          <img
                            className="block lg:hidden h-8 w-auto"
                            src={"/assets/image/logo.svg"}
                            alt="Classcoin"
                          />
                          <img
                            className="hidden lg:block h-8 w-auto"
                            src={"/assets/image/logofont.svg"}
                            alt="Classcoin"
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      {/* <Link href={"/market"}>
                        <a
                          href="#"
                          className={` ${
                            dir == "/market" ? "header-active" : ""
                          } text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium`}
                        >
                          NFT Market
                        </a>
                      </Link> */}
                      {/* <Link href={"/explore"}>
                        <a
                          href="#"
                          className={` ${
                            dir == "/explore" ? "header-active" : ""
                          } text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium`}
                        >
                          NFT Market
                        </a>
                      </Link> */}
                      {/* <Link href={"/collection"}>
                        <a
                          href="#"
                          className={` ${
                            dir == "/collection" ? "header-active" : ""
                          } text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium`}
                        >
                          Collection
                        </a>
                      </Link> */}
                      <Menu
                        as="a"
                        className={` ${
                          dir == "/map" ? "header-active" : ""
                        } text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium relative`}
                      >
                        <Menu.Button className="font-medium">Map</Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none transform opacity-100 scale-100 map-dropdown">
                            <div className="py-1">
                              <Menu.Item>
                                <Link href="/map">
                                  <a
                                    href="#"
                                    className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Map
                                  </a>
                                </Link>
                              </Menu.Item>
                              <hr />
                              <Menu.Item>
                                <Link href={"#"}>
                                  <a
                                    href="#"
                                    className="relative flex justify-content-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => toggleSubMenuItems("korat")}
                                  >
                                    Korat
                                    <span className="ms-auto">
                                      <i className="fas fa-chevron-right"></i>
                                    </span>
                                    <div
                                      className={`absolute bg-white rounded top-[-4px] p-1 right-[-11.6rem] ${
                                        activeSubMenu != "korat" ? "hidden" : ""
                                      }`}
                                    >
                                      <ul>
                                        <li>
                                          <a
                                            href="#"
                                            className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() =>
                                              handleMapSelected("yaamo")
                                            }
                                          >
                                            Yaamo
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            href="#"
                                            className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-44"
                                            onClick={() =>
                                              handleMapSelected("sut")
                                            }
                                          >
                                            SUT
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </a>
                                </Link>
                              </Menu.Item>
                              <Menu.Item>
                                <Link href={"#"}>
                                  <a
                                    href="#"
                                    className="relative flex justify-content-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => toggleSubMenuItems("phuket")}
                                  >
                                    Phuket
                                    <span className="ms-auto">
                                      <i className="fas fa-chevron-right"></i>
                                    </span>
                                    <div
                                      className={`absolute bg-white rounded top-[-4px] p-1 right-[-11.6rem] ${
                                        activeSubMenu != "phuket"
                                          ? "hidden"
                                          : ""
                                      }`}
                                    >
                                      <ul>
                                        <li>
                                          <a
                                            href="#"
                                            className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-44"
                                            onClick={() =>
                                              handleMapSelected("oldtown")
                                            }
                                          >
                                            Old Town
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            href="#"
                                            className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-44"
                                            onClick={() =>
                                              handleMapSelected("crescent")
                                            }
                                          >
                                            Crescent Isle
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </a>
                                </Link>
                              </Menu.Item>
                              <Menu.Item>
                                <Link href="/map">
                                  <a
                                    href="#"
                                    className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                      handleDemoSelected("metaw-whatower")
                                    }
                                  >
                                    WHA Tower
                                  </a>
                                </Link>
                              </Menu.Item>
                              <Menu.Item>
                                <Link href={"#"}>
                                  <a
                                    href="#"
                                    className="relative flex justify-content-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => toggleSubMenuItems("metaw")}
                                  >
                                    Meta W
                                    <span className="ms-auto">
                                      <i className="fas fa-chevron-right"></i>
                                    </span>
                                    <div
                                      className={`absolute bg-white rounded top-[-4px] p-1 right-[-11.6rem] ${
                                        activeSubMenu != "metaw" ? "hidden" : ""
                                      }`}
                                    >
                                      <ul>
                                        <li>
                                          <a
                                            href="#"
                                            className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-44"
                                            onClick={() =>
                                              handleDemoSelected(
                                                "metaw-esie1-hdmc"
                                              )
                                            }
                                          >
                                            HDMC
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            href="#"
                                            className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-44"
                                            onClick={() =>
                                              handleDemoSelected(
                                                "metaw-esie1-fordmotor"
                                              )
                                            }
                                          >
                                            Ford Motor
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            href="#"
                                            className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-44"
                                            onClick={() =>
                                              handleDemoSelected(
                                                "metaw-esie1-suzuki"
                                              )
                                            }
                                          >
                                            Suzuki Intersection
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            href="#"
                                            className="relative block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-44"
                                            onClick={() =>
                                              handleDemoSelected(
                                                "metaw-esie1-wtp"
                                              )
                                            }
                                          >
                                            Phase 1&2
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </a>
                                </Link>
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      {/* <Link href="/land">
                        <a
                          className={` ${
                            dir == "/land" ? "header-active" : ""
                          } text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium`}
                        >
                          Land
                        </a>
                      </Link> */}
                      {(roles.roles === "admin" ||
                        roles.roles === "approver") && (
                        <Link href={"/approve"}>
                          <a
                            href="#"
                            className={` ${
                              dir == "/approve" ? "header-active" : ""
                            } text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium`}
                          >
                            Approve
                          </a>
                        </Link>
                      )}
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
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="pt-4 pb-3 border-t border-gray-200 space-y-1">
                  <div className="mobile-menu">
                    <Link href={"/market"}>
                      <a
                        href="#"
                        className={` ${
                          dir == "/market" ? "menu-item-active" : ""
                        } menu-item`}
                      >
                        NFT Market
                      </a>
                    </Link>
                    <Link href={"/explore"}>
                      <a
                        href="#"
                        className={` ${
                          dir == "/explore" ? "menu-item-active" : ""
                        } menu-item`}
                      >
                        Explore
                      </a>
                    </Link>
                    <Link href={"/collection"}>
                      <a
                        href="#"
                        className={` ${
                          dir == "/collection" ? "header-active" : ""
                        } text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium`}
                      >
                        Collection
                      </a>
                    </Link>
                    <Link href="/map">
                      <a
                        className={` ${
                          dir == "/map" ? "menu-item-active" : ""
                        } menu-item`}
                      >
                        Map
                      </a>
                    </Link>
                    {(roles.roles === "admin" ||
                      roles.roles === "approver") && (
                      <Link href={"/approve"}>
                        <a
                          href="#"
                          className={` ${
                            dir == "/approve" ? "menu-item-active" : ""
                          } menu-item`}
                        >
                          Approve
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
                <ConnectWallet />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
};

export default Header;
