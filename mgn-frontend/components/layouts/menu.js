import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
const Menu = (props) => {
  const router = useRouter();
  const menuList = [
    {
      link: "/",
      name: "HOME",
      status: "open",
      icon: "home",
    },
    {
      link: "/market",
      name: "MARKET",
      status: "open",
      icon: "market",
    },
    {
      link: "/explore",
      name: "EXPLORE",
      status: "open",
      icon: "explore",
    },
    {
      link: "/stake",
      name: "STAKING",
      status: "open",
      icon: "stack",
    },
    {
      link: "/plans/lab1",
      name: "MAP",
      status: "close",
      icon: "map",
    },
  ];
  return (
    <div className="menu-sidebar">
      <nav className="nav-menu">
        {menuList.map((element, key) => {
          return (
            <Link href={element.link} key={key}>
              <div
                className={`btn-sidebar-menu ${element.status} ${
                  router.pathname == element.link ? "active" : ""
                }`}
              >
                <span className={`icon-menu icon-${element.icon}`}></span>
                <span className="menu-name">{element.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
export default Menu;
