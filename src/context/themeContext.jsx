import { createContext, useState, useContext, useEffect } from "react";
import baseLayers from "../configurations/mapLayers";

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
