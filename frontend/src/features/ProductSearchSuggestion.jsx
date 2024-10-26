import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";

function ProductSearchSuggestion({ data, querySearch }) {
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const suggestionRef = useRef(null);

  const debounceSearch = useDebounce(querySearch, 350); // 500ms debounce delay

  useEffect(() => {
    if (debounceSearch) {
      setLoading(true);
      setShowSuggestions(false); // Hide suggestions until loading is done
      setLoading(false);
      setShowSuggestions(true);
    } else {
      setLoading(false);
      setShowSuggestions(false); // Hide suggestions if the query is cleared
    }
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false); // Hide suggestions if clicked outside
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [debounceSearch, loading]);

  const productSearch =
    data?.filter((item) =>
      item?.title?.toLowerCase().includes(debounceSearch.toLowerCase())
    ) || [];

  const handleSearchNavigation = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div
      style={{
        height: "100%",
        minHeight: "250px",
        position: "absolute",
        right: "0",
        left: "0",
        pointerEvents: showSuggestions ? "auto" : "none",
        zIndex: showSuggestions ? 100 : -1,
      }}
    >
      {loading ? (
        <div className="product-suggestion_loader">Loading...</div>
      ) : showSuggestions && productSearch.length > 0 ? (
        <ul className="product-suggestion" ref={suggestionRef}>
          {productSearch.map((item) => (
            <li key={item.id}>
              <Link
                target="_parent"
                onClick={() => handleSearchNavigation(item.id)}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        !showSuggestions && null
      )}
    </div>
  );
}

export default ProductSearchSuggestion;
