import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  A11y,
  HashNavigation,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";
import EffectCarousel from "./effect-carousel.esm.js";
import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/hash-navigation";
import "swiper/css/keyboard";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./effect-carousel.css";
import "./MySwiper.css";

export default function MySwiper() {
  const swiperParameters = {
    modules: [
      A11y,
      HashNavigation,
      Keyboard,
      Navigation,
      Pagination,
      EffectCarousel,
    ],
    slidesPerView: "auto",
    centeredSlides: true,
    loop: true,
    effect: "carousel",
    navigation: true,
    pagination: { el: ".swiper-pagination" },
    keyboard: { enabled: true, pageUpDown: false },
    hashNavigation: { enabled: true, watchState: true },
  };
  return (
    <>
      <Swiper {...swiperParameters}>
        <SwiperSlide className="swiper-slide-83d0" data-hash="slide-1">
          <img
            className="swiper-slide-bg-image swiper-slide-bg-image-c61b swiper-carousel-animate-opacity"
            src="https://studio.swiperjs.com/demo-images/nature/02.jpg"
          />

          <div className="swiper-slide-content swiper-carousel-animate-opacity swiper-slide-content-7bb6">
            <div className="swiper-slide-text swiper-slide-text-de0f">
              Spider-Man: No Way Home
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-83d0" data-hash="slide-2">
          <img
            className="swiper-slide-bg-image swiper-slide-bg-image-c61b swiper-carousel-animate-opacity"
            src="https://studio.swiperjs.com/demo-images/movies/02.jpg"
          />

          <div className="swiper-slide-content swiper-carousel-animate-opacity swiper-slide-content-7bb6">
            <div className="swiper-slide-text swiper-slide-text-de0f">
              Free Guy
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-83d0" data-hash="slide-3">
          <img
            className="swiper-slide-bg-image swiper-slide-bg-image-c61b swiper-carousel-animate-opacity"
            src="https://studio.swiperjs.com/demo-images/movies/03.jpg"
          />

          <div className="swiper-slide-content swiper-carousel-animate-opacity swiper-slide-content-7bb6">
            <div className="swiper-slide-text swiper-slide-text-de0f">
              The Nice Guys
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-83d0" data-hash="slide-4">
          <img
            className="swiper-slide-bg-image swiper-slide-bg-image-c61b swiper-carousel-animate-opacity"
            src="https://studio.swiperjs.com/demo-images/movies/04.jpg"
          />

          <div className="swiper-slide-content swiper-carousel-animate-opacity swiper-slide-content-7bb6">
            <div className="swiper-slide-text swiper-slide-text-de0f">
              John Wick
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-83d0" data-hash="slide-5">
          <img
            className="swiper-slide-bg-image swiper-slide-bg-image-c61b swiper-carousel-animate-opacity"
            src="https://studio.swiperjs.com/demo-images/movies/05.jpg"
          />

          <div className="swiper-slide-content swiper-carousel-animate-opacity swiper-slide-content-7bb6">
            <div className="swiper-slide-text swiper-slide-text-de0f">
              Avatar
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-83d0" data-hash="slide-6">
          <img
            className="swiper-slide-bg-image swiper-slide-bg-image-c61b swiper-carousel-animate-opacity"
            src="https://studio.swiperjs.com/demo-images/movies/06.jpg"
          />

          <div className="swiper-slide-content swiper-carousel-animate-opacity swiper-slide-content-7bb6">
            <div className="swiper-slide-text swiper-slide-text-de0f">
              Encanto
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-83d0" data-hash="slide-7">
          <img
            className="swiper-slide-bg-image swiper-slide-bg-image-c61b swiper-carousel-animate-opacity"
            src="https://studio.swiperjs.com/demo-images/movies/07.jpg"
          />

          <div className="swiper-slide-content swiper-carousel-animate-opacity swiper-slide-content-7bb6">
            <div className="swiper-slide-text swiper-slide-text-de0f">
              Eternals
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-83d0" data-hash="slide-8">
          <img
            className="swiper-slide-bg-image swiper-slide-bg-image-c61b swiper-carousel-animate-opacity"
            src="https://studio.swiperjs.com/demo-images/movies/08.jpg"
          />

          <div className="swiper-slide-content swiper-carousel-animate-opacity swiper-slide-content-7bb6">
            <div className="swiper-slide-text swiper-slide-text-de0f">
              Jurassic World
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-83d0" data-hash="slide-9">
          <img
            className="swiper-slide-bg-image swiper-slide-bg-image-c61b swiper-carousel-animate-opacity"
            src="https://studio.swiperjs.com/demo-images/movies/09.jpg"
          />

          <div className="swiper-slide-content swiper-carousel-animate-opacity swiper-slide-content-7bb6">
            <div className="swiper-slide-text swiper-slide-text-de0f">
              Dr Strange
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide-83d0" data-hash="slide-10">
          <img
            className="swiper-slide-bg-image swiper-slide-bg-image-c61b swiper-carousel-animate-opacity"
            src="https://studio.swiperjs.com/demo-images/movies/10.jpg"
          />

          <div className="swiper-slide-content swiper-carousel-animate-opacity swiper-slide-content-7bb6">
            <div className="swiper-slide-text swiper-slide-text-de0f">
              Guardians Of The Galaxy
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="swiper-pagination" />
    </>
  );
}
