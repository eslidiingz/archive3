import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const router = useRouter();
  const [openSidebar, setOpen] = useState("false");
  const openMenu = () => {
    setOpen(!openSidebar);
  };

  const [openMenuProfile, setOpenProfile] = useState("false");
  const openProfile = () => {
    setOpenProfile(!openMenuProfile);
  };

  return (
    <>
      <div className="absolute navbar">
        <div>
          <div className=" flex gap-6 justify-end">
            <img
              className="icon-bell"
              alt=""
              src="/assets/images/icons/bell.svg"
            />
            <div className="flex gap-4 c-pointer" onClick={openProfile}>
              <img
                className="icon"
                alt=""
                src="/assets/images/icons/security.svg"
              />
              <h4 className="text-navbar">Admin Head Product</h4>
              <img
                className="icon"
                alt=""
                src="/assets/images/icons/down.svg"
              />
            </div>
          </div>
        </div>
        {/* <div className="sm:hidden">
            <div className="flex justify-between">
               <img className="icon-bell" alt="" src="/assets/images/icons/menu-dots.svg" onClick={openMenu} />
               <img className="logo" alt="" src="/assets/images/logo-velaverse.svg" />
               <img className="icon" alt="" src="/assets/images/icons/security.svg" onClick={openProfile} />
            </div>
         </div> */}
      </div>
      {/* <div className={openSidebar? "hidden" : "block md:hidden"}>
         <div className="absolute navbar-mobile">
            <div className="w-full" >
               <div onClick={openMenu}>
                  <img className="icon-close" src="/assets/images/icons/close-circle.svg" alt="" />
               </div>
               <Link href="/">
                  <div className={router.pathname == "/" ? "active" : ""}>
                     <div className="flex justify-between sidebar-menu mx-auto my-8">
                        <div className="flex items-center gap-5 menu">
                           <img className="icon" src="/assets/images/icons/home.svg" alt="" />
                           <h4 className="text-menu">Dashboard</h4>
                        </div>
                        <img alt="" className="arrow" src="/assets/images/icons/next.svg" />
                     </div>
                  </div>
               </Link>

               <Link href="#">
                  <div className={router.pathname == "/land" ? "active" : ""}>
                     <div className="flex justify-between sidebar-menu mx-auto my-8">
                        <div className="flex items-center gap-5 menu">
                           <img className="icon" src="/assets/images/icons/land.svg" alt="" />
                           <h4 className="text-menu">Land &amp; Assets</h4>
                        </div>
                        <img alt="" className="arrow" src="/assets/images/icons/next.svg" />
                     </div>
                  </div>
               </Link>

               <Link href="#">
                  <div className={router.pathname == "/online-traffic" ? "active" : ""}>
                     <div className="flex justify-between sidebar-menu mx-auto my-8">
                        <div className="flex items-center gap-5 menu">
                           <img className="icon" src="/assets/images/icons/chart.svg" alt="" />
                           <h4 className="text-menu">Online Traffic</h4>
                        </div>
                        <img alt="" className="arrow" src="/assets/images/icons/next.svg" />
                     </div>
                  </div>
               </Link>

               <Link href="#">
                  <div className={router.pathname == "/mangeCreator" ? "active" : ""}>
                     <div className="flex justify-between sidebar-menu mx-auto my-8">
                        <div className="flex items-center gap-5 menu">
                           <img className="icon" src="/assets/images/icons/user.svg" alt="" />
                           <h4 className="text-menu">Manage Creator</h4>
                        </div>
                        <img alt="" className="arrow" src="/assets/images/icons/next.svg" />
                     </div>
                  </div>
               </Link>
            </div>
         </div>
      </div> */}
      <div className={openMenuProfile ? "hidden" : "block"}>
        <div className="absolute dropdown-profile divide-y divide-gray-700">
          <div className="twoline-dot">
            <div className="">
              <div>Wallet: 0x8AfCa4EC80B712a1691d4eE593a8B6eaa93b3957 </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-4 mr-1">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            <Link href={``}>
              <a onClick={() => signOut()}>Logout</a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default Navbar;
