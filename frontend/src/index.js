import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./hooks/context/thememode";
import { FirebaseProvider } from "./hooks/firebase/firebase..config.jsx";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Suspense fallback={require("./Pages/Page-404")}>
      <BrowserRouter>
        <ThemeProvider>
          <FirebaseProvider>
            <App />
          </FirebaseProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);
