import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./hooks/context/thememode";
import { FirebaseProvider } from "./hooks/firebase/firebase..config.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ModalProvider } from "./hooks/context/useModal";

const root = ReactDOM.createRoot(document.getElementById("root"));
const query = new QueryClient();
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <FirebaseProvider>
        <QueryClientProvider client={query}>
          <ModalProvider>
            <App />
          </ModalProvider>
        </QueryClientProvider>
      </FirebaseProvider>
    </ThemeProvider>
  </BrowserRouter>
);
