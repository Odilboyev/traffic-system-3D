import { useEffect, useState } from "react";

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
import ParkingLotsModule from "./TrafficMonitoringPanel/components/modules/ParkingLotsModule";
import ParkingMarkers from "./parkingMarkers";
import ParkingModule from "./TrafficMonitoringPanel/components/modules/ParkingModule";
import PropTypes from "prop-types";
import PulsingMarkers from "./PulsingMarkers/PulsingMarkers";
import RegionDistrictFilter from "./RegionDistrictFilter";
// Panels
import RoadSignsMarkers from "./roadSignsMarkers";
import TrafficLightContainer from "./trafficLightMarkers/managementLights";
import TransportMarkers from "./transportMarkers";
import WeatherMarkers from "./weatherMarkers";
import WeatherModule from "./TrafficMonitoringPanel/components/modules/WeatherModule";
import { useModuleContext } from "../context/ModuleContext";

/**
 * Component that renders module-specific components based on the active module
 * This component handles all module-specific rendering including both markers and panels
 */
const ActiveModuleComponents = ({ map }) => {
  const { activeModule } = useModuleContext();
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(13);

  useEffect(() => {
    const mapState = localStorage.getItem("mapState");
    const zoom = mapState ? JSON.parse(mapState).zoom : 13;
    setCurrentZoom(zoom);
  }, []);

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

    case "parking":
      return (
        <>
          {/* Parking markers */}
          <ParkingMarkers map={map} />
          {/* Parking panel */}
          <ParkingModule />
        </>
      );

    default:
      return null;
  }
};

ActiveModuleComponents.propTypes = {
  map: PropTypes.shape({
    addSource: PropTypes.func,
    addLayer: PropTypes.func,
    getLayer: PropTypes.func,
    removeLayer: PropTypes.func,
    getSource: PropTypes.func,
    removeSource: PropTypes.func,
  }),
};

export default ActiveModuleComponents;
