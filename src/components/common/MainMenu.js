import Link from "next/link";
import { usePathname } from "next/navigation";

const MainMenu = () => {
  const pathname = usePathname();

  const handleActive = (link) => {
    if (link === pathname || (link === "/" && pathname === "/")) {
      return "menuActive";
    }
  };

  return (
    <ul className="ace-responsive-menu">
      <li className="visible_list">
        <Link className="list-item" href="/">
          <span className={pathname === "/" ? "title menuActive" : "title"}>
            Inicio
          </span>
        </Link>
      </li>
      
      <li className="visible_list">
        <Link className="list-item" href="/ticket">
          <span className={pathname === "/ticket" ? "title menuActive" : "title"}>
            Comprar ticket
          </span>
        </Link>
      </li>
      
      <li className="visible_list">
        <Link className="list-item" href="/single-v7/1">
          <span className={pathname === "/single-v7/1" ? "title menuActive" : "title"}>
            Auto en sorteo
          </span>
        </Link>
      </li>
    </ul>
  );
};

export default MainMenu;