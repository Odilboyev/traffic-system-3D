// import "./styles.css";

import { ModuleProvider, useModuleContext } from "./context/ModuleContext";
import { memo, useCallback, useEffect, useState } from "react";

import ActiveModuleComponents from "./components/ActiveModuleComponents";
// Import Fines components
import { FinesProvider } from "./context/FinesContext";
import MapControlsPanel from "./components/MapControlsPanel/index.jsx";
import MapLibreContainer from "./components/MapLibreLayer/MapLibreContainer";
import MapModals from "./components/MapModals/index.jsx";
// Import ActiveModuleComponents for module-specific rendering
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import TopPanel from "./components/TrafficMonitoringPanel/components/TopPanel.jsx";
import { ZoomPanelProvider } from "./context/ZoomPanelContext";
import toaster from "../../tools/toastconfig.jsx";
import { useMapContext } from "./context/MapContext.jsx";
import { useMapMarkers } from "./hooks/useMapMarkers.jsx";

const MapComponent = memo(({ t }) => {
  const { map } = useMapContext();
  const { markers, getDataHandler } = useMapMarkers();

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
  // const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  // const [activeSidePanel, setActiveSidePanel] = useState(null);

  // const { show3DLayer } = useTheme();

  // Fetch markers on mount
  useEffect(() => {
    getDataHandler();
  }, [getDataHandler]);

  // Debug markers data
  useEffect(() => {
    console.log("Current markers:", markers);
  }, [markers]);

  // const handleMarkerClick = useCallback((marker) => {
  //   switch (marker.type) {
  //     case "crossroad":
  //       setCrossroadModal({ isOpen: true, marker });
  //       break;
  //     case "device":
  //       setDeviceModal({ isOpen: true, marker });
  //       break;
  //     case "trafficLights":
  //       setTrafficLightsModal({ isOpen: true, marker });
  //       break;
  //     default:
  //       console.warn("Unknown marker type:", marker.type);
  //   }
  // }, []);

  return (
    <div className="map-page w-screen h-screen relative overflow-hidden">
      <ModuleProvider>
        <MapControlsPanel map={map} />

        <FinesProvider>
          <ZoomPanelProvider map={map} condition={11}>
            <TopPanel />
            <div className="map-wrapper">
              <MapLibreContainer />
              {/* All module-specific components are managed by ActiveModuleComponents inside MapLibreContainer */}
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
            <ToastContainer {...toaster} />
          </ZoomPanelProvider>
        </FinesProvider>
      </ModuleProvider>
    </div>
  );
});

MapComponent.propTypes = {
  notifications: PropTypes.array,
  t: PropTypes.func,
};

export default MapComponent;
