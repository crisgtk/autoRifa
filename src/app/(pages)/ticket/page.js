"use client";
import { Suspense } from "react";
import CallToActions from "@/components/common/CallToActions";
import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import Ticket from "@/components/pages/ticket/Ticket";

// Metadata removed - Client Components cannot export metadata

const TicketPage = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Breadcrumb Sections */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">Tu Carrito de compras</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Breadcrumb Sections */}

      {/* Pricing Section Area */}
      <section className="our-pricing pb90 pt-0">
        <div className="container">
          <Suspense fallback={<div className="text-center py-5">Cargando carrito...</div>}>
            <Ticket />
          </Suspense>
        </div>
        {/* End .container */}
      </section>
      {/* End Pricing Section Area */}

      {/* Our CTA */}
      <CallToActions />
      {/* Our CTA */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default TicketPage;
