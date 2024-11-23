import { useEffect, useState } from "react";

const useLocalStorageState = (key, defaultValue) => {
  // Initialize state with value from localStorage or defaultValue
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.warn(`Failed to read localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      // Update localStorage whenever state changes
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Failed to save to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

export default useLocalStorageState;
