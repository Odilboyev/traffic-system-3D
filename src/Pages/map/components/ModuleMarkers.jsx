import FuelStationMarkers from "./fuelStationMarkers";
import MonitoringMarkers from "./monitoringMarkers";
import React from "react";
import RoadSignsMarkers from "./roadSignsMarkers";
import TransportMarkers from "./transportMarkers";
import WeatherMarkers from "./weatherMarkers";
import { useModuleContext } from "../context/ModuleContext";

/**
 * Component that renders the appropriate markers based on the active module
 */
const ModuleMarkers = ({ map }) => {
  const { activeModule } = useModuleContext();

  if (!map) return null;

  // Render the appropriate markers based on the active module
  switch (activeModule.id) {
    case "weather":
      return <WeatherMarkers map={map} />;
    case "public_transport":
      return <TransportMarkers map={map} />;
    case "fines":
      // Fines markers are handled by ActiveModuleComponents
      return null;
    case "road_signs":
      return <RoadSignsMarkers map={map} />;
    case "fuel_stations":
      return <FuelStationMarkers map={map} />;
    case "monitoring":
      return <MonitoringMarkers map={map} />;
    default:
      return null;
  }
};

export default ModuleMarkers;
