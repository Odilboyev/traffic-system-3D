// src/contexts/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const MyThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Apply the initial theme to the document body
    document.documentElement.classList.add(theme);
    document.documentElement.style.setProperty(
      "--primary-color",
      getComputedStyle(document.documentElement).getPropertyValue(
        `--${theme}-primary-color`
      )
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      document.documentElement.classList.remove(prevTheme);
      document.documentElement.classList.add(newTheme);
      document.documentElement.style.setProperty(
        "--primary-color",
        getComputedStyle(document.documentElement).getPropertyValue(
          `--${newTheme}-primary-color`
        )
      );
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { MyThemeProvider, ThemeContext };
