import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import { RxClock } from "react-icons/rx";
import { getImageUrl } from "../utils/getImages";

function Blog() {
  return (
    <div className="blogs">
      <div className="blogs__container">
        <Swiper
          tag="div"
          loop={true}
          pagination={{
            clickable: true,
          }}
          modules={[Navigation]}
          className="blogs__post_slider"
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
          }}
        >
          <div className="blogs__post_slider-container">
            {/* {data?.Blog?.map((item) => {
              return (
                <SwiperSlide className="blogs__post_slider-slide">
                  <div className="blogs__post_slider-card" key={item?.id}>
                    <span className="blogs__post_slider-card-label">
                      <RxClock className="blogs__post_slider-card-label-clock" />
                      {item?.label}
                    </span>
                    <div className="blogs__post_slider-card-img">
                      <img src={item?.imgUrl} alt="" />
                    </div>
                    <div className="blogs__post_slider-card-body">
                      <a href="/" className="blogs__post_slider-card-link">
                        {item?.title}
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })} */}
            <SwiperSlide className="blogs__post_slider-slide">
              <div className="blogs__post_slider-card">
                SOmeImage
                <span className="blogs__post_slider-card-label">
                  <RxClock className="blogs__post_slider-card-label-clock" />
                  {/* {item?.label} */}
                </span>
                <div className="blogs__post_slider-card-img">
                  <img src={getImageUrl("login-logo.png")} alt="" />
                </div>
                <div className="blogs__post_slider-card-body">
                  <a href="/" className="blogs__post_slider-card-link">
                    {/* {item?.title} */}
                  </a>
                </div>
              </div>
            </SwiperSlide>
          </div>
        </Swiper>
      </div>
    </div>
  );
}

export default Blog;
