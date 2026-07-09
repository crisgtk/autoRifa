"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

/**
 * ProSidebarContent component for mobile navigation.
 * Handles scrollspy highlighting for page sections in the mobile menu drawer.
 * 
 * @returns {React.JSX.Element} The rendered mobile navigation sidebar.
 */
const ProSidebarContent = () => {
  const path = usePathname();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (path !== "/") {
      setActiveSection("");
      return;
    }

    /**
     * Handles scroll events to detect the active section based on vertical scroll position.
     * 
     * @returns {void}
     */
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition < 200) {
        setActiveSection((prev) => (prev !== "" ? "" : prev));
        return;
      }

      const quienesSection = document.getElementById("quienes-somos");
      const sorteoSection = document.getElementById("estado-sorteo");

      let currentSection = "";

      if (quienesSection) {
        const offsetTop = quienesSection.offsetTop;
        if (scrollPosition >= offsetTop - 250) {
          currentSection = "quienes-somos";
        }
      }

      if (sorteoSection) {
        const offsetTop = sorteoSection.offsetTop;
        if (scrollPosition >= offsetTop - 250) {
          currentSection = "estado-sorteo";
        }
      }

      setActiveSection((prev) => (prev !== currentSection ? currentSection : prev));
    };

    /**
     * Handles hash change events to set the active section based on the URL hash fragment.
     * 
     * @returns {void}
     */
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#quienes-somos") {
        setActiveSection("quienes-somos");
      } else if (hash === "#estado-sorteo") {
        setActiveSection("estado-sorteo");
      } else {
        handleScroll();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    // Call initially to sync state
    handleHashChange();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, [path]);

  return (
    <Sidebar width="100%" backgroundColor="#fff" className="my-custom-class">
      <Menu>
        <MenuItem
          component={
            <Link
              className={(path === "/" && activeSection !== "quienes-somos" && activeSection !== "estado-sorteo") ? "active" : ""}
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

        <MenuItem
          component={
            <Link
              className={activeSection === "estado-sorteo" ? "active" : ""}
              href="/#estado-sorteo"
            />
          }
        >
          Estado del sorteo
        </MenuItem>
        
        <MenuItem
          component={
            <Link
              className={activeSection === "quienes-somos" ? "active" : ""}
              href="/#quienes-somos"
            />
          }
        >
          Quiénes somos
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default ProSidebarContent;
