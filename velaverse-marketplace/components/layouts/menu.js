import Link from "next/link";
import { useRouter } from "next/router";
const Menu = () => {
  const router = useRouter();
  const menuList = [
    {
      link: "/market",
      name: "Market List",
    },
    {
      link: "/collection",
      name: "Collection",
    },
    {
      link: "/gashapon",
      name: "Gashapon",
    },
  ];
  return (
    <div className="menu-sidebar px-2 sm:px-4 py-2">
      <nav className="flex-grow md:block md:overflow-y-auto">
        {menuList.map((element, key) => {
          return (
            <Link href={element.link} key={key}>
              <div
                className={`btn btn-sidebar-menu  ${
                  router.pathname == element.link ? "active" : ""
                }`}
              >
                {element.name}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
export default Menu;
