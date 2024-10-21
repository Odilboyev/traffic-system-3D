import React from "react";
import Select from "react-select";
import { useTheme } from "../../customHooks/useTheme";

const CustomSelect = ({ ...rest }) => {
  const { theme } = useTheme(); // Retrieve theme (light/dark)
  console.log(theme, "Custom");
  // Custom styles for react-select component
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: theme === "dark" ? "rgb(97 97 97)" : "rgb(250 250 250)", // Dark background for dark mode
      color: theme === "dark" ? "#fff" : "#000", // Adjust text color
      borderColor: state.isFocused
        ? theme === "dark"
          ? "#fff"
          : "#3b82f6"
        : "#d1d5db", // Adjust border on focus
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "", // Add shadow on focus
      "&:hover": {
        borderColor: theme === "dark" ? "#4b5563" : "#3b82f6", // Hover state
      },
      padding: "0.10rem",
      borderRadius: "0.375rem",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: theme === "dark" ? "rgb(97 97 97 / 100)" : "#fff", // Dark background for menu
      color: theme === "dark" ? "#fff" : "#000", // Adjust text color
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? theme === "dark"
          ? "#4b5563"
          : "#3b82f6"
        : state.isFocused
        ? theme === "dark"
          ? "#374151"
          : "#e5e7eb"
        : "transparent", // Adjust selection and focus background
      color: state.isSelected ? "#fff" : theme === "dark" ? "#fff" : "#000", // Adjust selected text color
    }),
    singleValue: (base) => ({
      ...base,
      color: theme === "dark" ? "#fff" : "#000", // Adjust single value color
    }),
  };

  return (
    <Select
      styles={{ ...customStyles, ...rest.styles }}
      className="w-full"
      {...rest}
    />
  );
};

export default CustomSelect;
