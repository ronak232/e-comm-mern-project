import { createContext, useContext, useState } from "react";
const useCurrency = (currenyConverter) => useContext(currenyConverter);

export const MyCurrency = () => {
  const currenyConverter = createContext(null);

  const [fetchCurrency, setFetchCurrency] = useState({
    preferredCurrency: null,
    selectedCountry: null,
  });
};
