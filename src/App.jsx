import "react-toastify/dist/ReactToastify.css";

import { useContext, useEffect, useState } from "react";

import MapComponent from "./Pages/map/index.jsx";
import { ThemeContext } from "./context/themeContext.jsx";
import WarningMessage from "./components/offlineWarning/index.jsx";

const App = () => {
  const { theme } = useContext(ThemeContext);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      location.reload();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`min-h-screen app-container relative ${
        theme === "dark" ? "bg-gray-900 text-white" : "text-black"
      }`}
    >
      {!isOnline && <WarningMessage />}
      <MapComponent />
    </div>
  );
};

export default App;
