import { useState, useEffect } from "react";

// infere the type automatically based on the type passed as a value...
// here T is generic type value...
export const useDebounce = <T>(value: T, delay: number) => {
  const [debounceSearch, setDebounceSearch] = useState<T>(value);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      setDebounceSearch(value);
    }, delay);

    return () => {
      clearTimeout(searchTimeout);
    };
  }, [value, delay]);

  return debounceSearch;
};
