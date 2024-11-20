import { useEffect, useState } from "react";

const useLocalStorageState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      // Return parsed value if it's valid JSON, otherwise fallback to defaultValue
      return saved && saved !== "undefined" ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.warn(`Error parsing localStorage key "${key}":`, error);
      return defaultValue; // Fallback if parsing fails
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state)); // Safely update localStorage
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

export default useLocalStorageState;
