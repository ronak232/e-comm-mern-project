import { useDispatch, useSelector } from "react-redux";
import Rating from "./Rating";
import { useEffect } from "react";
import { handleGetUserRating } from "../../redux/thunk/ratingThunk";
import { useParams } from "react-router-dom";

function ShowStarRating() {
  const { getProductRating } = useSelector((state) => state.rating);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(handleGetUserRating(id));
  }, [dispatch, id]);

  return (
    <div className="w-full">
      <ul className="flex flex-col gap-4">
        {getProductRating &&
          getProductRating?.map((item) => {
            return (
              <li className="border-b-2 border-0">
                <Rating stars={item.rating} />
                <p className="mt-2 pb-1 text-[14px] text-slate-600">
                  {item.userName}
                </p>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default ShowStarRating;
