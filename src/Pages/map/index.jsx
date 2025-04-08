// import "./styles.css";

import { memo, useEffect, useState } from "react";

// Import Fines components
import { FinesProvider } from "./context/FinesContext";
import MapControlsPanel from "./components/MapControlsPanel/index.jsx";
import MapLibreContainer from "./components/MapLibreLayer/MapLibreContainer";
import MapModals from "./components/MapModals/index.jsx";
import { ModuleProvider } from "./context/ModuleContext";
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
  const {  getDataHandler } = useMapMarkers();

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
  // Fetch markers on mount
  useEffect(() => {
    getDataHandler();
  }, [getDataHandler]);

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
