import "./components/TrafficJamPolylines/styles.css";
import "leaflet-rotate-map";

import { memo, useCallback, useEffect, useRef, useState } from "react";

import BaseLayerHandler from "./components/BaseLayerHandler";
import DynamicMarkers from "./components/markers/DynamicMarkers.jsx";
import L from "leaflet";
import MapCRSHandler from "./utils/mapCsrHandler.jsx";
import MapEvents from "./components/MapEvents/index.jsx";
import MapLibreLayer from "./components/MapLibreLayer";
import MapModals from "./components/MapModals/index.jsx";
import MapOrientationControl from "./components/controls/MapOrientationControl";
import NotificationBox from "../../components/NotificationBox/index.jsx";
import PropTypes from "prop-types";
import Sidebar from "./components/sidebar/index.jsx";
import { ToastContainer } from "react-toastify";
import TrafficJamLayer from "./utils/trafficJamTilelayer.jsx";
import TrafficJamPolylines from "./components/TrafficJamPolylines";
import TrafficLightContainer from "./components/trafficLightMarkers/managementLights.jsx";
import ZoomControl from "./components/controls/customZoomControl/index.jsx";
import baseLayers from "../../configurations/mapLayers.js";
import { safeParseJSON } from "../../redux/utils.js";
import toaster from "../../tools/toastconfig.jsx";
import { useMapAlarms } from "./hooks/useMapAlarms.js";
import { useMapMarkers } from "./hooks/useMapMarkers.jsx";
import { useSelector } from "react-redux";
import { useTheme } from "../../customHooks/useTheme.jsx";

const home = [41.2995, 69.2401]; // Tashkent

const MapMarkerToaster = ({ changedMarkers }) => {
  const map = useMap();
  const handleToaster = useCallback(
    (changedMarker) => {
      toaster(changedMarker, map);
    },
    [map]
  );
  // useEffect(() => {
  //   if (changedMarkers && changedMarkers.length > 0) {
  //     // Batch process notifications
  //     changedMarkers.forEach((changedMarker) => {
  //       handleToaster(changedMarker);
  //     });
  //     // // Dispatch batch marker update
  //     // dispatchMarkers({
  //     //   type: "BATCH_UPDATE_MARKERS",
  //     //   payload: changedMarkers,
  //     // });
  //   }
  // }, [changedMarkers, handleToaster]);

  return null;
};

const MapComponent = memo(({ notifications, t }) => {
  const {
    markers,
    setMarkers,
    clearMarkers,
    updateMarkers,
    filter,
    changedMarker,
    setChangedMarker,
  } = useMapMarkers();

  const [crossroadModal, setCrossroadModal] = useState({
    isOpen: false,
    marker: null,
  });
  const [deviceModal, setDeviceModal] = useState({
    isOpen: false,
    device: null,
  });
  const [trafficLightsModal, setTrafficLightsModal] = useState({
    isOpen: false,
    light: null,
  });
  const [isBoxLoading, setIsBoxLoading] = useState(false);
  const [isLightsLoading] = useState(false);

  // Debug markers data
  useEffect(() => {
    console.log('Current markers:', markers);
  }, [markers]);

  const handleMonitorCrossroadOpen = (marker) => {
    setCrossroadModal({ isOpen: true, marker });
  };

  const handleBoxModalOpen = async (box) => {
    setIsBoxLoading(true);
    setDeviceModal({ isOpen: true, device: box });
    setIsBoxLoading(false);
  };

  const handleLightsModalOpen = (light) => {
    setTrafficLightsModal({ isOpen: true, light });
  };

  const handleCloseCrossroadModal = () => {
    setCrossroadModal({ isOpen: false, marker: null });
  };

  const handleCloseDeviceModal = () => {
    setDeviceModal({ isOpen: false, device: null });
  };

  const handleCloseTrafficLightsModal = () => {
    setTrafficLightsModal({ isOpen: false, light: null });
  };

  return (
    <div className="map-page w-screen h-screen relative overflow-hidden">
      <div className="map-wrapper absolute inset-0">
        <MapLibreLayer 
          markers={markers} 
          onMarkerClick={(marker) => setChangedMarker(marker)} 
        />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <Sidebar t={t} changedMarker={changedMarker} />
        <NotificationBox notifications={notifications} />
        <MapModals
          crossroadModal={crossroadModal}
          deviceModal={deviceModal}
          trafficLightsModal={trafficLightsModal}
          isBoxLoading={isBoxLoading}
          isLightsLoading={isLightsLoading}
          onClose={{
            crossroad: handleCloseCrossroadModal,
            device: handleCloseDeviceModal,
            lights: handleCloseTrafficLightsModal,
          }}
          t={t}
        />
        <ToastContainer className="pointer-events-auto" />
      </div>
    </div>
  );
});

MapComponent.displayName = "MapComponent";

export default MapComponent;
