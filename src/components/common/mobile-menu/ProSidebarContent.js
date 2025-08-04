import { usePathname } from "next/navigation";
import Link from "next/link";

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

const ProSidebarContent = () => {
  const path = usePathname();

  return (
    <Sidebar width="100%" backgroundColor="#fff" className="my-custom-class">
      <Menu>
        <MenuItem
          component={
            <Link
              className={path === "/" ? "active" : ""}
              href="/"
            />
          }
        >
          Inicio
        </MenuItem>
        
        <MenuItem
          component={
            <Link
              className={path === "/ticket" ? "active" : ""}
              href="/ticket"
            />
          }
        >
          Comprar ticket
        </MenuItem>
        
        <MenuItem
          component={
            <Link
              className={path === "/single-v7/1" ? "active" : ""}
              href="/single-v7/1"
            />
          }
        >
          Auto en sorteo
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default ProSidebarContent;
