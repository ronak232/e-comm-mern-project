import React from "react";
import data from "../mock-json/data.json";
import { RiArrowUpSLine } from "react-icons/ri";
import { Link } from "react-router-dom";

function Store() {
  return (
    <section>
      <div className="products-listed">
        <div className="products-listed--container">
          <div className="products-listed--container-best">
            <ul className="products-listed--container-best-items">
              <h4 className="text-stone-600 font-semibold">Bestsellers</h4>
              {data?.Products?.bestseller?.map((item) => {
                return (
                  <li
                    key={item?.id}
                    className="products-listed--container-best-items-list"
                  >
                    <img
                      className="products-listed--images"
                      src={item?.img}
                      alt=""
                    />
                    <div className="products-listed--links">
                      <a href="/">{item?.title}</a>
                      <span className="products-listed--links-price">
                        {item?.price}
                      </span>
                    </div>
                  </li>
                );
              })}
              <p>...</p>
              <Link
                className="products-listed--container-best-links-more"
                to="/shop"
              >
                View More
                <RiArrowUpSLine className="arrow" />
              </Link>
            </ul>
          </div>
          <div className="products-listed--container-new">
            <h4 className="text-stone-600 font-semibold">New arrivals </h4>
            <ul className="products-listed--container-new-items">
              {data?.Products?.newArrivals?.map((item) => {
                return (
                  <li
                    key={item?.id}
                    className="products-listed--container-new-items-list"
                  >
                    <img
                      className="products-listed--images"
                      src={item?.img}
                      alt=""
                    />
                    <div className="products-listed--links">
                      <a href="/">{item?.title}</a>
                      {/* </h6> */}
                      <div className="products-listed--links-price">
                        {item?.price}
                      </div>
                    </div>
                  </li>
                );
              })}
              <p>...</p>
              <Link
                className="products-listed--container-new-links-more"
                to="/shop"
              >
                View More
                <RiArrowUpSLine className="arrow" />
              </Link>
            </ul>
          </div>
          <div className="products-listed--container-top">
            <ul className="products-listed--container-top-items">
              <h4 className="text-stone-600 font-semibold">Top rated</h4>
              {data?.Products?.topRated?.map((item) => {
                return (
                  <li
                    key={item?.id}
                    className="products-listed--container-top-items-list"
                  >
                    <img
                      className="products-listed--images"
                      src={item?.img}
                      alt=""
                    />
                    <div className="products-listed--links">
                      <a href="/">{item?.title}</a>
                      <div className="products-listed--links-price">
                        {item?.price}
                      </div>
                    </div>
                  </li>
                );
              })}
              <p>...</p>
              <Link
                className="products-listed--container-top-links-more"
                to="/shop"
              >
                View More
                <RiArrowUpSLine className="arrow" />
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Store;
