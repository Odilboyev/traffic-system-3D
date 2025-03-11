import { createContext, useContext, useEffect, useState } from "react";

// Create the context with default values
const ModuleContext = createContext({
  activeModule: { id: "its", name: "ITS" },
  setActiveModule: () => {},
  modules: [],
});

// Create a provider component
export const ModuleProvider = ({ children }) => {
  // Define all available modules
  const availableModules = [
    { id: "its", name: "ITS" },
    { id: "fuel", name: "Yoqilg'i stansiyalari" },
    { id: "fines", name: "Jarimalar" },
    { id: "public_transport", name: "Jamoat transporti" },
    { id: "road_signs", name: "Road signs" },
    { id: "weather", name: "Ob-havo" },
  ];

  // Initialize state from localStorage or use default
  const [activeModule, setActiveModule] = useState(() => {
    const savedModule = localStorage.getItem("activeModule");
    return savedModule
      ? JSON.parse(savedModule)
      : {
          id: "its",
          name: "ITS",
        };
  });

  // Save to localStorage when activeModule changes
  useEffect(() => {
    localStorage.setItem("activeModule", JSON.stringify(activeModule));
  }, [activeModule]);

  return (
    <ModuleContext.Provider
      value={{ activeModule, setActiveModule, modules: availableModules }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

// Create a custom hook to use the context
export const useModuleContext = () => useContext(ModuleContext);

export default ModuleContext;
