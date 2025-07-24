"use client";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";
import listings from "@/data/listings";

const images = [
  {
    src: "/images/car/mini_cooper/mini_cooper_2.jpeg",
    alt: "2.jpg",
  },
  {
    src: "/images/car/mini_cooper/mini_cooper_3.jpeg",
    alt: "3.jpg",
  },
  {
    src: "/images/car/mini_cooper/mini_cooper_4.jpeg",
    alt: "4.jpg",
  },
  {
    src: "/images/car/mini_cooper/mini_cooper_5.jpeg",
    alt: "5.jpg",
  },
  {
    src: "/images/car/mini_cooper/mini_cooper_6.jpeg",
    alt: "6.jpg",
  },
  {
    src: "/images/car/mini_cooper/mini_cooper_7.jpeg",
    alt: "7.jpg",
  },
];

const PropertyGallery = ({ id }) => {
  const data = listings.filter((elm) => elm.id == id)[0] || listings[0];
  return (
    <>
      <Gallery>
        <div className="col-sm-6">
          <div className="sp-img-content mb15-md">
            <div className="popup-img preview-img-1 sp-img">
              <Item
                original={"/images/car/mini_cooper/mini_cooper_1.jpeg"}
                thumbnail={"/images/car/mini_cooper/mini_cooper_1.jpeg"}
                width={1280}
                height={720}
              >
                {({ ref, open }) => (
                  <Image
                    src={"/images/car/mini_cooper/mini_cooper_1.jpeg"}
                    width={1280}
                    height={720}
                    ref={ref}
                    onClick={open}
                    alt="image"
                    role="button"
                    className="w-100 h-100 cover"
                  />
                )}
              </Item>
            </div>
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-6">
          <div className="row">
            {images.map((image, index) => (
              <div className="col-6 ps-sm-0" key={index}>
                <div className="sp-img-content">
                  <div
                    className={`popup-img preview-img-${index + 2} sp-img mb10`}
                  >
                    <Item
                      original={image.src}
                      thumbnail={image.src}
                      width={1280}
                      height={720}
                    >
                      {({ ref, open }) => (
                        <Image
                          width={1280}
                          height={720}
                          className="w-100 h-100 cover"
                          ref={ref}
                          onClick={open}
                          role="button"
                          src={image.src}
                          alt={image.alt}
                        />
                      )}
                    </Item>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Gallery>
    </>
  );
};

export default PropertyGallery;
