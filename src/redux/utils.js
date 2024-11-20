export const safeParseJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);

    // Handle null, undefined, or invalid strings
    if (!value || value === "undefined" || value.trim() === "") {
      console.warn(
        `Invalid or undefined value for key "${key}". Using fallback.`
      );
      return fallback;
    }

    return JSON.parse(value); // Parse JSON if valid
  } catch (error) {
    console.warn(`Failed to parse JSON for key "${key}":`, error);
    localStorage.removeItem(key); // Clear the invalid key
    return fallback; // Return fallback if parsing fails
  }
};

export const migrateLocalStorage = (initialState) => {
  Object.entries(initialState).forEach(([key, defaultValue]) => {
    const storageKey = `its_${key}`;
    const storedValue = localStorage.getItem(storageKey);

    if (
      storedValue === null ||
      storedValue === "undefined" ||
      storedValue.trim() === "" ||
      storedValue.trim() === "null"
    ) {
      // If value is invalid, set the default value
      localStorage.setItem(storageKey, JSON.stringify(defaultValue));
    } else {
      try {
        const parsedValue = JSON.parse(storedValue);

        // If both values are objects, merge them
        if (
          typeof defaultValue === "object" &&
          !Array.isArray(defaultValue) &&
          typeof parsedValue === "object"
        ) {
          const mergedValue = { ...defaultValue, ...parsedValue };
          localStorage.setItem(storageKey, JSON.stringify(mergedValue));
        }
      } catch {
        // Reset to default value if parsing fails
        console.warn(
          `Invalid JSON for key "${storageKey}". Resetting to default.`
        );
        localStorage.setItem(storageKey, JSON.stringify(defaultValue));
      }
    }
  });
};
