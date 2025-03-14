import { useCallback, useState } from "react";
import paginate from "../utils/paginate";

function FilterProduct({ setcartFilter, cartFilter, allProducts }) {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [paginationOnFilter, setPaginationOnFilter] = useState(1);

  // To filter only the product categories
  const allCategories = [
    ...new Set(allProducts?.flat()?.map((item) => item?.category))//flat() method is used to flatten the paginated arrays into a single array before applying the filtering logic.
  ];

  // to avoid running filterProductItems for every re-render
  // useCallback hook to memoize the function and only recreate it when its dependencies change.
  // This helps to optimize performance by preventing unnecessary re-creations of the function.
  const filterProductItems = useCallback(
    (category) => {
      if (category === selectedCategory) {
        setSelectedCategory(null);
        setcartFilter(allProducts.flat(5)); // Reset to default mapping data
      } else {
        const filterCategory = allProducts
          ?.flat()
          ?.filter((items) => items?.category === category);
        setcartFilter(filterCategory);
        setSelectedCategory(category);
      }
    },
    [allProducts, selectedCategory, setcartFilter]
  );

  const clearAllFilter = () => {
    setSelectedCategory([]);
    setPaginationOnFilter(paginate(paginationOnFilter));
  };

  return (
    <aside className="products__filter">
      <div className="products__filter-category">
        <div className="products__filter-category--options-dropdown">
          <h3>Categories</h3>
          <div className="products__filter-category--options-dropdown-items">
            {allCategories?.map((category, index) => {
              return (
                <button
                  className="filters-btn"
                  key={index}
                  onClick={() => filterProductItems(category)}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div>
        <button onClick={() => clearAllFilter()}>Clear Filter</button>
      </div>
    </aside>
  );
}

export default FilterProduct;
