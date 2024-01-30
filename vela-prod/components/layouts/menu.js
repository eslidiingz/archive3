import Link from "next/link";
import { useRouter } from "next/router";
const Menu = () => {
  const router = useRouter();
  const menuList = [
    {
      link: "/market",
      name: "NFT Market",
      status: "open",
    },
    {
      link: "/collection",
      name: "Collection",
      status: "open",
    },
    {
      link: "",
      name: "Mystery Box",
      status: "close",
    },
    {
      link: "",
      name: "Map",
      status: "close",
    },
  ];
  return (
    <div className="menu-sidebar px-2 sm:px-4 py-2">
      <nav className="flex-grow md:block md:overflow-y-auto">
        {menuList.map((element, key) => {
          return (
            <Link href={element.link} key={key}>
              <div
                className={`btn btn-sidebar-menu ${element.status} ${
                  router.pathname == element.link ? "active" : ""
                }`}
                style={
                  key == 0
                    ? { top: "40px" }
                    : { top: "calc(80px * " + key + " + 40px)" }
                }
              >
                <span>{element.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
export default Menu;
