import { getInitialState } from "./slices/mapslice";

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const stateKeysToSync = Object.keys(getInitialState());
  const state = store.getState().map;

  stateKeysToSync.forEach((key) => {
    const localStorageKey = `its_${key}`;

    // Write only valid JSON values to localStorage
    try {
      const value = state[key];
      if (value !== undefined) {
        localStorage.setItem(localStorageKey, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(
        `Failed to save key "${localStorageKey}" to localStorage:`,
        error
      );
    }
  });

  return result;
};

export default localStorageMiddleware;
