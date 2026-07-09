"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * MainMenu component for desktop navigation.
 * Handles scrollspy highlighting for page sections.
 * 
 * @returns {React.JSX.Element} The rendered desktop menu.
 */
const MainMenu = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (pathname !== "/") {
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
  }, [pathname]);

  return (
    <ul className="ace-responsive-menu">
      <li className="visible_list">
        <Link className="list-item" href="/">
          <span
            className={
              pathname === "/" && activeSection !== "quienes-somos" && activeSection !== "estado-sorteo"
                ? "title menuActive"
                : "title"
            }
          >
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

      <li className="visible_list">
        <Link className="list-item" href="/#estado-sorteo">
          <span className={activeSection === "estado-sorteo" ? "title menuActive" : "title"}>
            Estado del sorteo
          </span>
        </Link>
      </li>

      <li className="visible_list">
        <Link className="list-item" href="/#quienes-somos">
          <span className={activeSection === "quienes-somos" ? "title menuActive" : "title"}>
            Quiénes somos
          </span>
        </Link>
      </li>
    </ul>
  );
};

export default MainMenu;