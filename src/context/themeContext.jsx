import baseLayers, { layerSave } from "../configurations/mapLayers";
import { createContext, useEffect, useState } from "react";

import useLocalStorageState from "../customHooks/uselocalStorageState";

export const ThemeContext = createContext();

export const MyThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [currentLayer, setCurrentLayer] = useState(
    localStorage.getItem("selectedLayer") || baseLayers[0].name
  );
  const [showTrafficJam, setShowTrafficJam] = useLocalStorageState(
    "trafficJamEnabled",
    false
  );
  const [show3DLayer, setShow3DLayer] = useLocalStorageState(
    "3DLayerEnabled",
    false
  );

  const toggle3DLayer = () => {
    setShow3DLayer((prev) => !prev);
  };

  const toggleTrafficJam = () => {
    if (showTrafficJam) {
      // Turning off traffic jam
      setShowTrafficJam(false);
      // Restore previous theme-appropriate layer
      const previousLayer = currentLayer;
      setCurrentLayer(previousLayer);
    } else {
      // Turning on traffic jam
      setShowTrafficJam(true);
      // Switch to appropriate Yandex layer based on theme
      if (theme === "dark") {
        handleLayerChange("Yandex Dark");
      } else {
        handleLayerChange("Yandex");
      }
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    localStorage.setItem("trafficTheme", theme);
    if (showTrafficJam && !currentLayer.includes("Yandex")) {
      const yandexThemeLayer = theme === "dark" ? "Yandex Dark" : "Yandex";
      handleLayerChange(yandexThemeLayer);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("trafficTheme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  const handleLayerChange = (layerName) => {
    layerSave(layerName);
    setCurrentLayer(layerName);
    // Only update traffic jam state if explicitly changing away from Yandex layers
    if (!layerName.includes("Yandex")) {
      setShowTrafficJam(false);
    }
  };
  useEffect(() => {
    if (theme === "dark") {
      !currentLayer.includes("Dark") && handleLayerChange("Dark");
    } else {
      !currentLayer.includes("Transport") && handleLayerChange("Transport");
    }
  }, [theme]);
  useEffect(() => {
    const previousTheme = localStorage.getItem("trafficTheme");
    if (previousTheme && previousTheme !== theme) {
      document.documentElement.classList.remove(previousTheme);
    }
    document.documentElement.classList.add(theme);
    localStorage.setItem("trafficTheme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        currentLayer,
        setCurrentLayer,
        showTrafficJam,
        setShowTrafficJam,
        toggleTrafficJam,
        show3DLayer,
        setShow3DLayer,
        toggle3DLayer,
        handleLayerChange,
      }}
    >
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};
