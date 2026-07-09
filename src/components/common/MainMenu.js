"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MainMenu = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#quienes-somos") {
        setActiveSection("quienes-somos");
      } else if (hash === "#estado-sorteo") {
        setActiveSection("estado-sorteo");
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    handleHashChange();

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        } else {
          if (entry.target.id === "quienes-somos" && window.scrollY < 300) {
            setActiveSection("");
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const targetQuienes = document.getElementById("quienes-somos");
    if (targetQuienes) {
      observer.observe(targetQuienes);
    }
    const targetSorteo = document.getElementById("estado-sorteo");
    if (targetSorteo) {
      observer.observe(targetSorteo);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
      if (targetQuienes) {
        observer.unobserve(targetQuienes);
      }
      if (targetSorteo) {
        observer.unobserve(targetSorteo);
      }
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