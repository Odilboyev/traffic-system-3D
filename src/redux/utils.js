export const safeParseJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);

    // Check if the value is null, undefined, or an invalid string
    if (value === null || value === "undefined" || value.trim() === "") {
      console.warn(
        `Invalid or undefined value for key "${key}". Using fallback.`
      );
      return fallback;
    }

    return JSON.parse(value); // Try parsing the valid JSON value
  } catch (error) {
    console.warn(`Failed to parse JSON for key "${key}":`, error);
    localStorage.clear();
    window.location.reload();
    return fallback; // Return fallback if parsing fails
  }
};

export const migrateLocalStorage = (initialState) => {
  Object.entries(initialState).forEach(([key, defaultValue]) => {
    const storageKey = `its_${key}`;
    const storedValue = localStorage.getItem(storageKey);

    // If the key doesn't exist, is undefined, or is invalid, set the default value
    if (
      storedValue === null ||
      storedValue === "undefined" ||
      storedValue.trim() === ""
    ) {
      localStorage.setItem(storageKey, JSON.stringify(defaultValue));
    } else {
      try {
        const parsedValue = JSON.parse(storedValue);

        // Merge defaults with stored values if the value is an object
        if (typeof defaultValue === "object" && !Array.isArray(defaultValue)) {
          const mergedValue = { ...defaultValue, ...parsedValue };
          localStorage.setItem(storageKey, JSON.stringify(mergedValue));
        }
      } catch {
        // If parsing fails, reset to the default value
        console.warn(
          `Invalid JSON for key "${storageKey}". Resetting to default.`
        );
        localStorage.setItem(storageKey, JSON.stringify(defaultValue));
      }
    }
  });
};
