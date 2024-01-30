import { useMetaMask } from "metamask-react";
import { getWalletAddress } from "../../utils/wallet/connector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useContext, Fragment } from "react";
import { useRouter } from "next/router";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { UserIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { getWalletAccount } from "../../utils/web3/init";
import { fetchWhitelistUser } from "../../utils/api/whitelist-api";
import { WalletContext } from "../../pages/_app";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ConnectWallet = (props) => {
  const router = useRouter();

  /** Use Context state */
  const { walletState, setWalletState } = useContext(WalletContext);

  const fetchAdminRoles = async () => {
    const account = "0xE40845297c6693863Ab3E10560C97AACb32cbc6C";
    // const account = await getWalletAccount();
    const { rows } = await fetchWhitelistUser(account);

    if (rows && rows.length > 0) {
      const _result = await rows.filter((item) => item.flag === "Y");
      if (_result.length > 0) {
        setRoles(_result[0]);
      }
    }
  };
  const [dir, setDir] = useState("/market");
  const [roles, setRoles] = useState("");

  const { status, connect, account } = useMetaMask();

  function onOpenedDropdown(e) {
    props.openDropdown && props.openDropdown(e);
    setActiveMenu(!activeMenu);
  }

  const [activeMenu, setActiveMenu] = useState(false);

  useEffect(() => {
    if (status === "connected") {
      setWalletState((prevState) => ({
        ...prevState,
        connected: true,
      }));
    }
  }, [status]);

  useEffect(() => {
    router.events.on("routeChangeComplete", function () {
      setActiveMenu(false);
    });
    fetchAdminRoles();
  }, [router]);

  if (walletState.connected === false) {
    if (status === "initializing")
      return (
        <button className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Synchronisation with MetaMask
        </button>
      );

    if (status === "unavailable")
      return (
        <button className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          MetaMask not available
        </button>
      );

    if (status === "notConnected")
      return (
        <button
          onClick={connect}
          className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Connect Wallet
        </button>
      );

    if (status === "connecting")
      return (
        <button className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Connecting...
        </button>
      );
  }

  if (status === "connected")
    return (
      <>
        <Menu as="div" className="ml-3 relative z-30 hidden sm:block">
          <div>
            <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none">
              <span className="sr-only">Open user menu</span>
              <div className="icon-user"></div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
              <div className="px-4 py-3">
                <p className="text-sm">Your Wallet Address</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getWalletAddress(account)}
                </p>
              </div>
              <div className="py-1">
                {/* {roles === "" && (
                  <Menu.Item>
                    <Link href={"/approve/register"}>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Register Form
                      </a>
                    </Link>
                  </Menu.Item>
                )}
                {roles.roles === "newbie" && (
                  <Menu.Item>
                    <a className="block px-4 py-2 text-sm text-yellow-700 hover:bg-gray-100">
                      Waiting Approve
                    </a>
                  </Menu.Item>
                )}

                {roles.roles === "minter" && (
                  <Menu.Item>
                    <a className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100">
                      Verified
                    </a>
                  </Menu.Item>
                )} */}
                <Menu.Item>
                  <Link href={"/profile/mynft/"}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Assets
                    </a>
                  </Link>
                </Menu.Item>
                {/* <Menu.Item>
                  <Link href={"/profile/mycollection/"}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Collections
                    </a>
                  </Link>
                </Menu.Item> */}
                <Menu.Item>
                  <Link href={"/placements/"}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Placements List
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link href={"/profile/offers/"}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Offer Received
                    </a>
                  </Link>
                </Menu.Item>
              </div>
              {/* <div className="py-1">
                <Menu.Item>
                  <Link href={"/"}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </a>
                  </Link>
                </Menu.Item>
              </div> */}
            </Menu.Items>
          </Transition>
        </Menu>

        <div className="pt-2 pb-3 border-t border-gray-200 space-y-1 block sm:hidden">
          <div className="px-4 py-3 flex">
            <UserIcon className="h-6 w-6 text-gray-900" aria-hidden="true" />
            <div className="ml-2">
              <p className="text-sm text-gray-900">Your Wallet Address</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {getWalletAddress(account)}
              </p>
            </div>
          </div>
          <div className="mobile-menu">
            <Link href={"/profile/mynft/"}>
              <a
                href="#"
                className={` ${
                  dir == "/profile/mynft/" ? "menu-item-active" : ""
                } menu-item`}
              >
                My Assets
              </a>
            </Link>
            {/* <Link href={"/profile/mycollection/"}>
              <a
                href="#"
                className={` ${
                  dir == "/profile/mycollection/" ? "menu-item-active" : ""
                } menu-item`}
              >
                My Collection
              </a>
            </Link> */}
            <Link href="/placements/">
              <a
                className={` ${
                  dir == "/placements/" ? "menu-item-active" : ""
                } menu-item`}
              >
                Placements List
              </a>
            </Link>
            <Link href={"/profile/offers/"}>
              <a
                href="#"
                className={` ${
                  dir == "/profile/offers/" ? "menu-item-active" : ""
                } menu-item`}
              >
                Offcer Received
              </a>
            </Link>
          </div>
        </div>
      </>
    );

  return null;
};

export default ConnectWallet;
