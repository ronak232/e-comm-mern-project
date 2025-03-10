import { useParams } from "react-router-dom";
import { Button } from "../StyledComponents/Button.style";
import { FiShoppingCart } from "react-icons/fi";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import React, { Suspense, useContext, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Rating from "../features/Rating/Rating";
import SkeletonCard from "../Components/SkeletonCard";
import { ThemeContext } from "../hooks/context/thememode";
const ReviewAndComment = React.lazy(() =>
  import("../features/Rating/ReviewAndComment")
);

function ProductDetails({
  allProducts,
  handleAddProduct,
  handleIncrement,
  handleDecrement,
}) {
  const [thumbNailImg, setThumbNailImg] = useState(null);
  const theme = useContext(ThemeContext);
  const darkMode = theme?.state?.darkMode;
  const { id } = useParams();
  const matchedProducts = allProducts
    ?.flat()
    ?.find((product) => product.id === Number(id));

  return (
    <div className="productdetails__container">
      <div className="productdetails__card">
        <div className="productdetails__card_pdpthumbs">
          <Swiper
            style={{
              "--swiper-navigation-color": "#000",
              "--swiper-pagination-color": "#000",
            }}
            loop={true}
            spaceBetween={10}
            navigation={true}
            thumbs={{
              swiper:
                thumbNailImg && !thumbNailImg.destroyed ? thumbNailImg : null,
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="productdetails__card_pdpthumbs_imgs"
          >
            {matchedProducts?.images.map((img) => {
              return (
                <SwiperSlide className="productdetails__card_img">
                  <img src={img} alt="" />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <Swiper
            onSwiper={setThumbNailImg}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="productdetails__pdpgallery"
          >
            {matchedProducts?.images.map((img, index) => {
              return (
                <SwiperSlide key={index}>
                  <img src={img} alt="" />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="productdetails__card_body">
          <h1
            className="productdetails__card_title"
            style={{ color: darkMode ? "white" : "black" }}
          >
            {matchedProducts?.title}
          </h1>
          <p className="productdetails__description">
            {matchedProducts?.description}
          </p>
          <Rating stars={matchedProducts?.rating} />
          <div>
            <Button
              hover="grey"
              padding="4px 10px"
              fontSize="16px"
              borderRadius="4px"
              marginRight="8px"
              onClick={() => handleIncrement(matchedProducts.id)}
            >
              +
            </Button>
            <Button
              hover="grey"
              padding="4px 10px"
              fontSize="16px"
              borderRadius="4px"
              onClick={() => handleDecrement(matchedProducts.id)}
            >
              -
            </Button>
          </div>
          <button
            className="productdetails__card_addtocart"
            onClick={() => handleAddProduct(matchedProducts)}
          >
            <FiShoppingCart className="cart" />
            Add to Cart
          </button>
          <Suspense fallback={<SkeletonCard />}>
            <ReviewAndComment />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
