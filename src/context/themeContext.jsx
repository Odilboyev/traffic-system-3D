import React, { createContext, useState, useContext, useEffect } from "react";

export const ThemeContext = createContext();

export const MyThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};
