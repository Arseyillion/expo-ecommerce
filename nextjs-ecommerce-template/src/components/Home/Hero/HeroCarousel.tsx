"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useCarousel } from "@/hooks/useCarousel";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const HeroCarousal = () => {
  const { carousel, loading, error } = useCarousel();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-300 rounded-lg"></div>
      </div>
    );
  }

  if (error || !carousel || !carousel.slides || carousel.slides.length === 0) {
    // Return fallback carousel if there's an error or no data
    return (
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        className="hero-carousel"
      >
        <SwiperSlide>
          <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
            <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                  30%
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  Sale
                  <br />
                  Off
                </span>
              </div>

              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                <a href="#">True Wireless Noise Cancelling Headphone</a>
              </h1>

              <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at ipsum at risus euismod lobortis in
              </p>

              <a
                href="#"
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
              >
                Shop Now
              </a>
            </div>

            <div>
              <Image
                src="/images/hero/hero-01.png"
                alt="headphone"
                width={351}
                height={358}
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    );
  }

  return (
    <Swiper
      spaceBetween={carousel.spaceBetween}
      centeredSlides={carousel.centeredSlides}
      autoplay={{
        delay: carousel.autoplayDelay,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {carousel.slides
        .filter(slide => slide.isActive)
        .sort((a, b) => a.order - b.order)
        .map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row px-5">
            <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                  {slide.discountPercentage}
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  {slide.discountText.split(' ').map((word, i) => (
                    <span key={i}>
                      {word}
                      {i < slide.discountText.split(' ').length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>

              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                <a href={slide.buttonLink}>{slide.title}</a>
              </h1>

              <p>
                {slide.description}
              </p>

              <a
                href={slide.buttonLink}
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
              >
                {slide.buttonText}
              </a>
            </div>

            <div>
              <Image
                src={slide.image}
                alt={slide.title}
                width={351}
                height={358}
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
