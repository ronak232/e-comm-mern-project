import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getImageUrl } from "../utils/getImages";

function LogoSlider() {
  return (
    <section>
      <div className="logo-slider">
        <div className="logo-slider-container">
          <Swiper
            className="abc"
            tag="div"
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              reverseDirection: false,
            }}
            loop={true}
            modules={[Autoplay, Navigation]}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 0,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 0,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 0,

                navigation: "true",
              },
            }}
          >
            <SwiperSlide className="logo-slider-wrapper" tag="div">
              <a href="/">
                <img
                  src={getImageUrl("apple.jpg")}
                  alt=""
                  className="logo-slider-wrapper-img"
                />
              </a>
            </SwiperSlide>
            <SwiperSlide className="logo-slider-wrapper" tag="div">
              <a href="/">
                <img
                  src={getImageUrl("amazon.png")}
                  alt=""
                  className="logo-slider-wrapper-img"
                />
              </a>
            </SwiperSlide>
            <SwiperSlide className="logo-slider-wrapper" tag="div">
              <a href="/">
                <img
                  src={getImageUrl("samsung.png")}
                  alt=""
                  className="logo-slider-wrapper-img"
                />
              </a>
            </SwiperSlide>
            <SwiperSlide className="logo-slider-wrapper" tag="div">
              <a href="/">
                <img
                  src={getImageUrl("channel.jpg")}
                  alt=""
                  className="logo-slider-wrapper-img"
                />
              </a>
            </SwiperSlide>
            <SwiperSlide className="logo-slider-wrapper" tag="div">
              <a href="/">
                <img
                  src={getImageUrl("puma.png")}
                  alt=""
                  className="logo-slider-wrapper-img"
                />
              </a>
            </SwiperSlide>
          </Swiper>
        </div>
        {/* <img src="/static/images/apple.jpg" /> */}
      </div>
    </section>
  );
}

export default LogoSlider;
