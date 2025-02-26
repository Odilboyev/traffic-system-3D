// import "./styles.css";

import { memo, useCallback, useEffect, useState } from "react";

import MapLibreContainer from "./components/MapLibreLayer/MapLibreContainer";
import MapModals from "./components/MapModals/index.jsx";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import TrafficMonitoringPanel from "./components/TrafficMonitoringPanel";
import MapControlsPanel from "./components/MapControlsPanel";
import toaster from "../../tools/toastconfig.jsx";
import { useMapContext } from "./context/MapContext.jsx";
import { useMapMarkers } from "./hooks/useMapMarkers.jsx";
import { useTheme } from "../../customHooks/useTheme.jsx";

const MapComponent = memo(({ notifications, t }) => {
  const { map } = useMapContext();
  const {
    markers,
    setMarkers,
    getDataHandler,
    clearMarkers,
    updateMarkers,
    useClusteredMarkers,
  } = useMapMarkers();

  const [crossroadModal, setCrossroadModal] = useState({
    isOpen: false,
    marker: null,
  });
  const [deviceModal, setDeviceModal] = useState({
    isOpen: false,
    marker: null,
  });
  const [trafficLightsModal, setTrafficLightsModal] = useState({
    isOpen: false,
    marker: null,
  });
  const [isBoxLoading] = useState(false);
  const [isLightsLoading] = useState(false);
  const [changedMarker, setChangedMarker] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeSidePanel, setActiveSidePanel] = useState(null);

  const { show3DLayer } = useTheme();

  // Fetch markers on mount
  useEffect(() => {
    getDataHandler();
  }, [getDataHandler]);

  // Debug markers data
  useEffect(() => {
    console.log("Current markers:", markers);
  }, [markers]);

  const handleMarkerClick = useCallback((marker) => {
    switch (marker.type) {
      case "crossroad":
        setCrossroadModal({ isOpen: true, marker });
        break;
      case "device":
        setDeviceModal({ isOpen: true, marker });
        break;
      case "trafficLights":
        setTrafficLightsModal({ isOpen: true, marker });
        break;
      default:
        console.warn("Unknown marker type:", marker.type);
    }
  }, []);

  return (
    <div className="map-page w-screen h-screen relative overflow-hidden">
      <div className="map-wrapper absolute inset-0">
        <TrafficMonitoringPanel map={map} />

        <MapLibreContainer />
      </div>

      <MapModals
        crossroadModal={crossroadModal}
        deviceModal={deviceModal}
        trafficLightsModal={trafficLightsModal}
        onClose={{
          handleCloseCrossroadModal: () =>
            setCrossroadModal({ isOpen: false, marker: null }),
          handleCloseDeviceModal: () =>
            setDeviceModal({ isOpen: false, marker: null }),
          handleCloseTrafficLightsModal: () =>
            setTrafficLightsModal({ isOpen: false, marker: null }),
        }}
        isBoxLoading={isBoxLoading}
        isLightsLoading={isLightsLoading}
        changedMarker={changedMarker}
        t={t}
      />

      {/* <NotificationBox notifications={notifications} /> */}
      <ToastContainer {...toaster} />
      <MapControlsPanel map={map} />
    </div>
  );
});

MapComponent.propTypes = {
  notifications: PropTypes.array,
  t: PropTypes.func.isRequired,
};

export default MapComponent;
