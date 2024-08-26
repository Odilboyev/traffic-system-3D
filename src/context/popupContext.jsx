// PopupManager.js
import { createContext, useState, useContext } from "react";

const PopupContext = createContext();

export function PopupProvider({ children }) {
  const [popupStates, setPopupStates] = useState({}); // store both positions and visibility

  const updatePopupState = (id, newState) => {
    console.log(id, newState);
    setPopupStates((prevStates) => ({
      ...prevStates,
      [id]: { ...prevStates[id], ...newState },
    }));
  };

  return (
    <PopupContext.Provider value={{ popupStates, updatePopupState }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopupContext() {
  return useContext(PopupContext);
}
