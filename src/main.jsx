import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "../public/tailwind.css";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./private.router.jsx";
import { lazy, Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from "@material-tailwind/react";
import { MyThemeProvider } from "./context/themeContext.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18.js";
import { PopupProvider } from "./context/popupContext.jsx";

const SignIn = lazy(() => import("./Pages/Login/index.jsx"));

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
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <SignIn />
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to={"/login"} replace />} />
              </Route>
              <Route element={<SignIn />} path="/login" />
            </Routes>
          </MyThemeProvider>
        </HashRouter>
      </PopupProvider>

      {/* <App /> */}
    </ThemeProvider>
  </I18nextProvider>

  // </React.StrictMode>
);
