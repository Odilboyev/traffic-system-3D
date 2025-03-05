import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context with default values
const ModuleContext = createContext({
  activeModule: { id: "monitoring", name: "Monitoring", markerType: "monitoring" },
  setActiveModule: () => {},
});

// Create a provider component
export const ModuleProvider = ({ children }) => {
  // Initialize state from localStorage or use default
  const [activeModule, setActiveModule] = useState(() => {
    const savedModule = localStorage.getItem('activeModule');
    return savedModule 
      ? JSON.parse(savedModule) 
      : {
          id: "monitoring",
          name: "Monitoring",
          markerType: "monitoring",
        };
  });
  
  // Save to localStorage when activeModule changes
  useEffect(() => {
    localStorage.setItem('activeModule', JSON.stringify(activeModule));
  }, [activeModule]);

  return (
    <ModuleContext.Provider value={{ activeModule, setActiveModule }}>
      {children}
    </ModuleContext.Provider>
  );
};

// Create a custom hook to use the context
export const useModule = () => useContext(ModuleContext);

export default ModuleContext;
