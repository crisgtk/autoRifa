"use client";
import Link from "next/link";
import Image from "next/image";
import ContactInfo from "./ContactInfo";
import ProSidebarContent from "./ProSidebarContent";

const MobileMenu = () => {
  return (
    <div className="mobilie_header_nav stylehome1">
      <div className="mobile-menu">
        <div className="header innerpage-style">
          <div className="menu_and_widgets">
            <div className="mobile_menu_bar d-flex justify-content-center align-items-center position-relative">
              <a
                className="menubar position-absolute start-0"
                href="#"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileMenu"
                aria-controls="mobileMenu"
              >
                <Image
                  width={25}
                  height={9}
                  src="/images/mobile-dark-nav-icon.svg"
                  alt="mobile icon"
                />
              </a>
              <div className="d-flex align-items-center justify-content-center">
                <Link className="mobile_logo" href="/">
                  <Image
                    width={160}
                    height={55}
                    src="/images/ai1.png"
                    alt="logo"
                    style={{ objectFit: "contain" }}
                  />
                </Link>
                <div className="logo-divider mx-2" style={{ height: "30px" }} />
                <div className="corp-logo-container">
                  <div className="corp-logo-emblem">
                    <Image
                      width={36}
                      height={36}
                      src="/images/logo/logo-corporacion-icon.jpeg"
                      alt="Logo Corporación"
                    />
                  </div>
                  <div className="corp-logo-text">
                    <span className="corp-title">Corp. Discapacitados</span>
                    <span className="corp-subtitle">Ley 20.422</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      {/* /.mobile-menu meta */}

      <div
        className="offcanvas offcanvas-start mobile_menu-canvas"
        tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
        data-bs-scroll="true"
      >
        <div className="rightside-hidden-bar">
          <div className="hsidebar-header">
            <div
              className="sidebar-close-icon"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <span className="far fa-times"></span>
            </div>
            <h4 className="title">Menú</h4>
          </div>
          {/* End header */}

          <div className="hsidebar-content ">
            <div className="hiddenbar_navbar_content">
              <ProSidebarContent />
              {/* End .hiddenbar_navbar_menu */}

              <div className="hiddenbar_footer position-relative bdrt1">
                <div className="row pt45 pb30 pl30">
                  <ContactInfo />
                </div>
                {/* End .row */}


              </div>
              {/* hiddenbar_footer */}
            </div>
          </div>
          {/* End hsidebar-content */}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
