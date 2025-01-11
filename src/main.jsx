import "./index.css";
import "../tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";

import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "./App.jsx";
import { I18nextProvider } from "react-i18next";
// import { MapMarkersProvider } from "./Pages/map/hooks/useMapMarkers.jsx";
import { MyThemeProvider } from "./context/themeContext.jsx";
import { PopupProvider } from "./context/popupContext.jsx";
import PrivateRoutes from "./private.router.jsx";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import SignIn from "./Pages/Login/index.jsx";
import { ThemeProvider } from "@material-tailwind/react";
import i18n from "./i18.js";
import { store } from "./redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      {/* <MapMarkersProvider> */}
      <ThemeProvider>
        <PopupProvider>
          <HashRouter>
            <MyThemeProvider>
              <Routes>
                <Route element={<PrivateRoutes />}>
                  <Route path="/" element={<App />} />
                  <Route
                    path="*"
                    element={<Navigate to={"/login"} replace />}
                  />
                </Route>{" "}
                <Route path="/login" element={<SignIn />} />
                <Route path="*" element={<Navigate to={"/login"} replace />} />
              </Routes>
            </MyThemeProvider>
          </HashRouter>
        </PopupProvider>
      </ThemeProvider>
    </Provider>
  </I18nextProvider>
  // </React.StrictMode>
);
