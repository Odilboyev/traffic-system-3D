import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "../public/tailwind.css";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./private.router.jsx";
import SignIn from "./Pages/Login/index.jsx";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import { MyThemeProvider } from "./context/themeContext.jsx";
import { ThemeProvider } from "@material-tailwind/react";
// import { Route, Routes } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ThemeProvider>
    <HashRouter>
      <MyThemeProvider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<App />} />
            <Route path="*" element={<Navigate to={"/login"} replace />} />
          </Route>
          <Route element={<SignIn />} path="/login" />
        </Routes>
      </MyThemeProvider>
    </HashRouter>
    {/* <App /> */}
  </ThemeProvider>
  // </React.StrictMode>
);
