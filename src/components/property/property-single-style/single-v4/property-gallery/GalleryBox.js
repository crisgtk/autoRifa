"use client";
import listings from "@/data/listings";
import Image from "next/image";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

const GalleryBox = ({id}) => {
  const imageUrls = [
    "/images/car/ssangyong_tivoli/tivoli_1.jpg",
    "/images/car/ssangyong_tivoli/tivoli_2.jpg",
    "/images/car/ssangyong_tivoli/tivoli_3.jpg",
    "/images/car/ssangyong_tivoli/tivoli_4.jpg",
    "/images/car/ssangyong_tivoli/tivoli_5.jpg",
    "/images/car/ssangyong_tivoli/tivoli_6.jpg",
    "/images/car/ssangyong_tivoli/tivoli_7.jpg",
    "/images/car/ssangyong_tivoli/tivoli_8.jpg",
    "/images/car/ssangyong_tivoli/tivoli_9.jpg",
    "/images/car/ssangyong_tivoli/tivoli_10.jpg",
    "/images/car/ssangyong_tivoli/tivoli_11.jpg",
    "/images/car/ssangyong_tivoli/tivoli_12.jpg",
  ];

  return (
    <>
      <Swiper
        className="overflow-visible"
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".single-pro-slide-next__active",
          prevEl: ".single-pro-slide-prev__active",
        }}
        slidesPerView={1}
        initialSlide={1}
        loop={true}
      >
        {imageUrls.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <div className="item">
              <Image
                width={1170}
                height={600}
                className="bdrs12 w-100 h-100 cover"
                src={imageUrl}
                alt={`Image ${index + 1}`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="rounded-arrow arrowY-center-position">
        <button className="single-pro-slide-prev__active swiper_button _prev">
          <i className="far fa-chevron-left" />
        </button>
        {/* End prev */}

        <button className="single-pro-slide-next__active swiper_button _next">
          <i className="far fa-chevron-right" />
        </button>
        {/* End Next */}
      </div>
      {/* End .col for navigation  */}
    </>
  );
};

export default GalleryBox;
