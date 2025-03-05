import React, { createContext, useContext, useState } from "react";

// Create the context with default values
const ModuleContext = createContext({
  activeModule: { id: "monitoring", name: "Monitoring", markerType: "monitoring" },
  setActiveModule: () => {},
});

// Create a provider component
export const ModuleProvider = ({ children }) => {
  const [activeModule, setActiveModule] = useState({
    id: "monitoring",
    name: "Monitoring",
    markerType: "monitoring",
  });

  return (
    <ModuleContext.Provider value={{ activeModule, setActiveModule }}>
      {children}
    </ModuleContext.Provider>
  );
};

// Create a custom hook to use the context
export const useModule = () => useContext(ModuleContext);

export default ModuleContext;
