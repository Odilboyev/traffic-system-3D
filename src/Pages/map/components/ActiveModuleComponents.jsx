// Markers
import FineMarkers from "./FineMarkers";
// Panels
import FinesPanel from "./FinesPanel";
import FinesStats from "./fines/FinesStats";
import FuelStationHeatmap from "./fuelStationMarkers/FuelStationHeatmap";
import FuelStationMarkers from "./fuelStationMarkers";
import FuelStationsModule from "./TrafficMonitoringPanel/components/modules/FuelStationsModule";
import HeatmapControl from "./controls/heatmapControl";
import ITSModule from "./TrafficMonitoringPanel/components/modules/ITSModule";
import PulsingMarkers from "./PulsingMarkers/PulsingMarkers";
import RegionDistrictFilter from "./RegionDistrictFilter";
// Panels
import RoadSignsMarkers from "./roadSignsMarkers";
import TrafficLightContainer from "./trafficLightMarkers/managementLights";
import TransportMarkers from "./transportMarkers";
import WeatherMarkers from "./weatherMarkers";
import WeatherModule from "./TrafficMonitoringPanel/components/modules/WeatherModule";
import { useEffect } from "react";
import { useModuleContext } from "../context/ModuleContext";
import { useState } from "react";
import { useZoomPanel } from "../context/ZoomPanelContext";

/**
 * Component that renders module-specific components based on the active module
 * This component handles all module-specific rendering including both markers and panels
 */
const ActiveModuleComponents = ({ map }) => {
  const { activeModule } = useModuleContext();
  const conditionMet = useZoomPanel();
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(13);
  console.log(currentZoom, "zom");
  useEffect(() => {
    setCurrentZoom(
      JSON.parse(localStorage.getItem("mapState"))
        ? JSON.parse(localStorage.getItem("mapState")).zoom
        : 13
    );
  }, [localStorage.getItem("mapState")]);

  if (!map) return null;

  // Render both markers and panels based on the active module
  switch (activeModule.id) {
    case "its":
      return (
        <>
          {currentZoom >= 20 && <TrafficLightContainer />}

          <PulsingMarkers map={map} />

          {/* ITS markers */}
          {/* <MonitoringMarkers map={map} /> */}
          {/* ITS panels */}
          <ITSModule map={map} />
          {/* <NotificationBox /> */}
        </>
      );
    case "fuel":
      return (
        <>
          {showHeatmap && <FuelStationHeatmap map={map} />}

          <RegionDistrictFilter map={map} />
          <div className="absolute bottom-4 right-4 z-10">
            <HeatmapControl onToggle={setShowHeatmap} />
          </div>
          {/* Fuel stations markers */}
          <FuelStationMarkers map={map} />
          {/* Fuel stations panel */}
          <FuelStationsModule map={map} />
        </>
      );
    case "fines":
      return (
        <>
          {/* Fines module markers */}
          <FineMarkers map={map} />
          {/* Fines module panels */}
          <FinesPanel />
          <FinesStats />
        </>
      );

    case "public_transport":
      return (
        <>
          {/* Public transport markers */}
          <TransportMarkers map={map} />
          {/* Add transport panel component here when available */}
        </>
      );
    case "road_signs":
      return (
        <>
          {/* Road signs markers */}
          <RoadSignsMarkers map={map} />
          {/* Add road signs panel component here when available */}
        </>
      );
    case "weather":
      return (
        <>
          {/* Weather markers */}
          <WeatherMarkers map={map} />
          {/* Weather panel */}
          <WeatherModule map={map} />
        </>
      );

    default:
      return null;
  }
};

export default ActiveModuleComponents;
