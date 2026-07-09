"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

const ProSidebarContent = () => {
  const path = usePathname();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (path !== "/") {
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
