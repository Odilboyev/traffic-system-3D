import baseLayers, { layerSave } from "../configurations/mapLayers";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const MyThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [currentLayer, setCurrentLayer] = useState(
    localStorage.getItem("selectedLayer") || baseLayers[0].name
  );
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
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
      value={{ theme, toggleTheme, currentLayer, setCurrentLayer }}
    >
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};
