// localStorageMiddleware.js
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // List of state keys to sync with localStorage
  const stateKeysToSync = [
    "markers",
    "areMarkersLoading",
    "errorMessage",
    "filter",
    "isDraggable",
    "useClusteredMarkers",
    "activeSidePanel",
    "widgets",
  ];

  const state = store.getState().map;

  stateKeysToSync.forEach((key) => {
    const localStorageKey = `its_${key}`;
    localStorage.setItem(localStorageKey, JSON.stringify(state[key]));
  });

  return result;
};

export default localStorageMiddleware;
