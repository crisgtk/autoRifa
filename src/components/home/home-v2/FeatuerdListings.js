"use client";
import listings from "@/data/listings";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

const FeaturedListings = () => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".featured-next__active",
          prevEl: ".featured-prev__active",
        }}
        pagination={{
          el: ".featured-pagination__active",
          clickable: true,
        }}
        slidesPerView={1}
        breakpoints={{
          300: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
      >
        {listings.slice(0, 4).map((listing) => (
          <SwiperSlide key={listing.id}>
            <div className="item">
              <div className="listing-style1 mb-0">
                <div className="list-thumb">
                  <Image
                    width={382}
                    height={248}
                    className="w-100 h-100 cover"
                    src={listing.image}
                    alt="listings"
                  />
                  <div className="sale-sticker-wrap">
                    {!listing.forRent && (
                      <div className="list-tag fz12">
                        <span className="flaticon-electricity me-2" />
                        ¡EN SORTEO!
                      </div>
                    )}
                  </div>
                  <div className="list-price">
                    {listing.price} <span>CLP el ticket</span>
                  </div>
                </div>
                <div className="list-content">
                  <h6 className="list-title">
                    <Link href={`/single-v7/${listing.id}`}>
                      {listing.title}
                    </Link>
                  </h6>
                  <p className="list-text">{listing.location}</p>
                  <div className="list-meta d-flex align-items-center">
                    <a href="#">
                      <span className="flaticon-door" /> {listing.bed} Puertas
                    </a>
                    <a href="#">
                      <span className="flaticon-settings" /> {listing.bath} Motor
                    </a>
                    <a href="#">
                      <span className="flaticon-ruler" /> {listing.sqft} km
                    </a>
                  </div>
                  <hr className="mt-2 mb-2" />
                  <div className="list-meta2 d-flex justify-content-between align-items-center">
                    <span className="for-what">En Sorteo</span>
                    <div className="icons d-flex align-items-center">
                      <a href="#">
                        <span className="flaticon-fullscreen" />
                      </a>
                      <a href="#">
                        <span className="flaticon-new-tab" />
                      </a>
                      <a href="#">
                        <span className="flaticon-like" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="rounded-arrow arrowY-center-position">
        <button className="featured-prev__active swiper_button _prev">
          <i className="far fa-chevron-left" />
        </button>
        {/* End prev */}

        <button className="featured-next__active swiper_button _next">
          <i className="far fa-chevron-right" />
        </button>
        {/* End Next */}
      </div>
      {/* End .col for navigation  */}
    </>
  );
};

export default FeaturedListings;
