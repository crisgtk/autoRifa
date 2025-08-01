import MobileMenu from "@/components/common/mobile-menu";
import Partner from "@/components/common/Partner";
import Agents from "@/components/home/home-v2/Agents";
import ApartmentType from "@/components/home/home-v2/ApartmentType";
import Explore from "@/components/home/home-v2/Explore";
import ExploreCities from "@/components/home/home-v2/ExploreCities";
import FeaturedListings from "@/components/home/home-v2/FeatuerdListings";
import Header from "@/components/home/home-v2/Header";
import Testimonial from "@/components/home/home-v2/Testimonial";
import About from "@/components/home/home-v2/about";
import Hero from "@/components/home/home-v2/hero";
import React from "react";
import Footer from "@/components/common/default-footer";
import Cta from "@/components/home/home-v2/Cta";
import Pricing from "@/components/home/home-v6/Pricing";


import Link from "next/link";

export const metadata = {
  title: "Home v2 || Homez - Real Estate NextJS Template",
};

const Home_V2 = () => {
  return (
    <>
      {/* Main Header Nav */}
      <Header />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Home Banner Style V2 */}
      <section className="home-banner-style2 p0">
        <div className="home-style2">
          <div className="container maxw1600">
            <div className="home2-hero-banner bdrs12"></div>
            <div className="row">
              <div className="col-xl-10 mx-auto">
                <Hero />
              </div>
            </div>
          </div>
          {/* End .container */}
        </div>
      </section>
      {/* End Home Banner Style V2 */}

      {/* Explore Apartment */}
      <section className="pb90 pb30-md">
        <div className="container">
          <div className="row justify-content-center" data-aos="fade">
            <div className="col-lg-12 card-ticket">
              <Pricing />
            </div>
          </div>
        </div>
      </section>
      {/* End Explore Apartment */}

      
      {/* About Us */}
      <section className="about-us">
        <div className="container">
          <About />
        </div>
      </section>
      {/* End About Us */}

      {/* Featured Listings */}
      <section className="pt0 pb60 pb30-md bgc-white">
        <div className="container">
          <div className="row align-items-center" data-aos="fade-up">
            <div className="col-lg-9">
              <div className="main-title2">
                <h2 className="title">Descubre el auto que estamos sorteando</h2>
                <p className="paragraph">
                  No olvides que puedes participar en el sorteo de este auto, solo necesitas comprar un ticket de $5000 0 3 ticket por $10000.
                </p>
              </div>
            </div>
            {/* <div className="col-lg-3">
              <div className="text-start text-lg-end mb-3">
                <Link className="ud-btn2" href="/grid-full-3-col">
                  Ver todos los sorteos
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div> */}
          </div>
          {/* End header */}

          <div className="row">
            <div className="col-lg-12" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-listing-slider">
                <FeaturedListings />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Explore Featured Listings */}

      {/* Property Cities */}
      {/* End property cities */}


      {/* Our Testimonials */}
      {/* <section className="our-testimonial p-0">
        <div className="cta-banner2 bgc-f7 maxw1600 mx-auto pt110 pt60-md pb110 pb60-md bdrs12 position-relative">
          <div className="container">
            <div className="row">
              <div
                className="col-lg-6 mx-auto"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="main-title text-center">
                  <h2>Ganadores</h2>
                  <p className="paragraph">
                    Estos son
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div
                className="col-lg-8 m-auto"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="testimonial-style2">
                  <Testimonial />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* End Our Testimonials */}

      {/* Our CTA */}
      {/* <Cta /> */}
      {/* End Our CTA */}

      {/* Start Our Footer */}
      <section className="footer-style1 at-home2 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default Home_V2;
