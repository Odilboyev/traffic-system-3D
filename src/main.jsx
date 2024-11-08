import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "../tailwind.css";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./private.router.jsx";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "@material-tailwind/react";
import { MyThemeProvider } from "./context/themeContext.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18.js";
import { PopupProvider } from "./context/popupContext.jsx";
import SignIn from "./Pages/Login/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <I18nextProvider i18n={i18n}>
    <ThemeProvider>
      <PopupProvider>
        <HashRouter>
          <MyThemeProvider>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<App />} />

                <Route path="*" element={<Navigate to={"/login"} replace />} />
              </Route>{" "}
              <Route path="/login" element={<SignIn />} />
              <Route path="*" element={<Navigate to={"/login"} replace />} />
            </Routes>
          </MyThemeProvider>
        </HashRouter>
      </PopupProvider>

      {/* <App /> */}
    </ThemeProvider>
  </I18nextProvider>

  // </React.StrictMode>
);
