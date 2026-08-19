"use client";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";
import listings from "@/data/listings";

const images = [
  { src: "/images/car/ssangyong_tivoli/tivoli_2.jpg", alt: "tivoli_2.jpg" },
  { src: "/images/car/ssangyong_tivoli/tivoli_3.jpg", alt: "tivoli_3.jpg" },
  { src: "/images/car/ssangyong_tivoli/tivoli_4.jpg", alt: "tivoli_4.jpg" },
  { src: "/images/car/ssangyong_tivoli/tivoli_5.jpg", alt: "tivoli_5.jpg" },
  { src: "/images/car/ssangyong_tivoli/tivoli_6.jpg", alt: "tivoli_6.jpg" },
  { src: "/images/car/ssangyong_tivoli/tivoli_7.jpg", alt: "tivoli_7.jpg" },
  { src: "/images/car/ssangyong_tivoli/tivoli_8.jpg", alt: "tivoli_8.jpg" },
  { src: "/images/car/ssangyong_tivoli/tivoli_9.jpg", alt: "tivoli_9.jpg" },
  { src: "/images/car/ssangyong_tivoli/tivoli_10.jpg", alt: "tivoli_10.jpg" },
  { src: "/images/car/ssangyong_tivoli/tivoli_11.jpg", alt: "tivoli_11.jpg" },
  { src: "/images/car/ssangyong_tivoli/tivoli_12.jpg", alt: "tivoli_12.jpg" },
];

const PropertyGallery = ({ id }) => {
  const data = listings.filter((elm) => elm.id == id)[0] || listings[0];
  const gridImages = images.slice(0, 4);
  const hiddenImages = images.slice(4);

  return (
    <>
      <Gallery>
        <div className="col-sm-6">
          <div className="sp-img-content mb15-md">
            <div className="popup-img preview-img-1 sp-img">
              <Item
                original={"/images/car/ssangyong_tivoli/tivoli_1.jpg"}
                thumbnail={"/images/car/ssangyong_tivoli/tivoli_1.jpg"}
                width={1600}
                height={739}
              >
                {({ ref, open }) => (
                  <Image
                    src={"/images/car/ssangyong_tivoli/tivoli_1.jpg"}
                    width={1600}
                    height={739}
                    ref={ref}
                    onClick={open}
                    alt="image"
                    role="button"
                    className="w-100 h-100 cover"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </Item>
            </div>
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-6">
          <div className="row">
            {gridImages.map((image, index) => (
              <div className="col-6 ps-sm-0" key={index}>
                <div className="sp-img-content">
                  <div
                    className={`popup-img preview-img-${index + 2} sp-img mb10`}
                  >
                    <Item
                      original={image.src}
                      thumbnail={image.src}
                      width={1600}
                      height={739}
                    >
                      {({ ref, open }) => (
                        <div
                          className="position-relative w-100 h-100 pointer"
                          onClick={open}
                        >
                          <Image
                            width={1600}
                            height={739}
                            className="w-100 h-100 cover"
                            style={{ objectFit: "cover" }}
                            ref={ref}
                            alt={image.alt}
                            src={image.src}
                          />
                          {index === 3 && hiddenImages.length > 0 && (
                            <div className="gallery-more-overlay">
                              <span>Ver todas (+{hiddenImages.length})</span>
                            </div>
                          )}
                        </div>
                      )}
                    </Item>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden items for the rest of the gallery modal */}
        <div className="d-none">
          {hiddenImages.map((image, index) => (
            <Item
              key={index}
              original={image.src}
              thumbnail={image.src}
              width={1600}
              height={739}
            >
              {({ ref, open }) => (
                <span ref={ref} onClick={open} />
              )}
            </Item>
          ))}
        </div>
      </Gallery>
    </>
  );
};

export default PropertyGallery;
