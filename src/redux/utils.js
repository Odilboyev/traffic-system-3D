export const safeParseJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Failed to parse JSON for key "${key}":`, error);
    return fallback;
  }
};
export const migrateLocalStorage = (initialState) => {
  Object.entries(initialState).forEach(([key, defaultValue]) => {
    const storedValue = localStorage.getItem(`its_${key}`);

    if (storedValue === null) {
      // If the key doesn't exist, set the default value
      localStorage.setItem(`its_${key}`, JSON.stringify(defaultValue));
    } else {
      try {
        const parsedValue = JSON.parse(storedValue);

        // Merge defaults with stored values if the value is an object
        if (typeof defaultValue === "object" && !Array.isArray(defaultValue)) {
          const mergedValue = { ...defaultValue, ...parsedValue };
          if (JSON.stringify(mergedValue) !== storedValue) {
            localStorage.setItem(`its_${key}`, JSON.stringify(mergedValue));
          }
        }
      } catch {
        // If parsing fails, reset to the default value
        localStorage.setItem(`its_${key}`, JSON.stringify(defaultValue));
      }
    }
  });
};
