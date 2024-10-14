import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./hooks/context/thememode";
import { FirebaseProvider } from "./hooks/firebase/firebase..config.jsx";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </ThemeProvider>
  </BrowserRouter>
);
