import { RiStarFill, RiStarLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { rateOnHover } from "../../redux/feature/rating/ratingSlice.js";
import { handlePostAsyncThunk } from "../../redux/thunk/ratingThunk.js";

function InteractiveRating({ user }) {
  const userRating = useSelector((state) => state.rating);
  const dispatch = useDispatch();

  const { onHover, rateOnSelect } = userRating;

  // function handleMouseOver that takes i as a parameter (represent the hovered star's index) and updates ratingOnHover state with this index value i...
  const handleMouseHover = (i) => {
    console.log("On hover value ", i);
    dispatch(rateOnHover(i));
  };

  console.log("Onhover", onHover, "On select", rateOnSelect);

  const handleOnMouseLeave = () => {
    dispatch(rateOnHover());
  };

  // Resetting the star rating value whenever the mouse leaves a star...
  const handleOnStarSelect = (i) => {
    dispatch(
      handlePostAsyncThunk({
        rating: i,
        userName: user.userName,
        userId: user.userId,
        pId: user.productId,
      })
    );
  };

  return (
    <div className="product-rating">
      {/* We can generate the sequence of the numbers */}
      {Array.from({ length: 5 }, (_, i) => {
        return (
          <button
            className="product-rating-color bg-transparent p-0 text-xl"
            key={i}
            onMouseEnter={() => handleMouseHover(i + 1)}
            onMouseLeave={() => handleOnMouseLeave(0)}
            onClick={() => handleOnStarSelect(i + 1)}
            type="button"
          >
            {onHover >= i + 1 || rateOnSelect >= i + 1 ? (
              <RiStarFill />
            ) : (
              <RiStarLine />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default InteractiveRating;
