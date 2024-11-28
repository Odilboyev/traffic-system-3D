import { MapContainer, TileLayer } from "react-leaflet";
import { getBoxData, markerHandler } from "../../api/api.handlers.js";
import { memo, useEffect, useState } from "react";

import Control from "../../components/customControl/index.jsx";
import DynamicMarkers from "./components/markers/DynamicMarkers.jsx";
import MapEvents from "./components/MapEvents/index.jsx";
import MapModals from "./components/MapModals/index.jsx";
import PropTypes from "prop-types";
import Sidebar from "./components/sidebar/index.jsx";
import { ToastContainer } from "react-toastify";
import TrafficLightContainer from "./components/trafficLightMarkers/managementLights.jsx";
import ZoomControl from "./components/controls/customZoomControl/index.jsx";
import baseLayers from "../../configurations/mapLayers.js";
import { safeParseJSON } from "../../redux/utils.js";
import { useMapAlarms } from "./hooks/useMapAlarms.js";
import { useMapMarkers } from "./hooks/useMapMarkers.jsx";
import { useSelector } from "react-redux";
import { useTheme } from "../../customHooks/useTheme.jsx";

const home = [41.2995, 69.2401]; // Tashkent

const MapComponent = ({ changedMarker, t }) => {
  const {
    markers,
    setMarkers,
    getDataHandler,
    clearMarkers,
    updateMarkers,
    useClusteredMarkers,
  } = useMapMarkers();
  const isDraggable = useSelector((state) => state.map.isDraggable);
  const filter = useSelector((state) => state.map.filter);
  const [map, setMap] = useState(null);
  const { fetchAlarmsData } = useMapAlarms();

  // sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  //theme
  const { theme, currentLayer } = useTheme();

  // const
  const center = safeParseJSON("its_currentLocation", home);

  const [zoom, setZoom] = useState(
    localStorage.getItem("mapZoom") ? localStorage.getItem("mapZoom") : 13
  );

  //variables
  /// ----------------------------------------------------------------
  const [isbigMonitorOpen, setIsbigMonitorOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);

  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);
  const [isBoxLoading, setIsBoxLoading] = useState(false);
  const [activeBox, setActiveBox] = useState(null);

  const [isLightsModalOpen, setIsLightsModalOpen] = useState(false);
  const [isLightsLoading, setIsLightsLoading] = useState(false);
  const [activeLight, setActiveLight] = useState(null);

  const currentLayerDetails = baseLayers.find((v) => v.name === currentLayer);

  useEffect(() => {
    getDataHandler();
    fetchAlarmsData();
  }, []);

  const handleMarkerDragEnd = (id, type, event) => {
    const { lat, lng } = event.target.getLatLng();

    try {
      markerHandler({ lat: lat + "", lng: lng + "", id, type });
      // getData();
    } catch (error) {
      getDataHandler();
    }
  };

  // handle visibility of modals
  const handleMonitorCrossroadOpen = (marker) => {
    setActiveMarker(marker);
    setIsbigMonitorOpen(true);
  };

  const handleBoxModalOpen = async (box) => {
    if (box) {
      setIsBoxLoading(true);
      try {
        const res = await getBoxData(box.cid);
        setIsBoxLoading(false);
        setActiveBox(res);
        setIsBoxModalOpen(true);
        setIsSidebarVisible(false);
        setIsSidebarVisible(false);
      } catch (error) {
        setIsBoxLoading(false);
        throw new Error(error);
      }
      // setActiveBox(box ? box : null);
    }
  };
  const handleLightsModalOpen = async (light) => {
    if (light) {
      setActiveLight(light);
      setIsSidebarVisible(false);

      setIsLightsModalOpen(true);
    }
  };
  // ----------------------------------------------------------------

  const handleCloseCrossroadModal = () => {
    // setIsSidebarVisible(true);
    setIsbigMonitorOpen(false);
    setActiveMarker(null);
  };

  const handleCloseDeviceModal = () => {
    setIsSidebarVisible(true);
    setIsBoxModalOpen(false);
    setActiveBox(null);
    setIsBoxLoading(false);
  };

  const handleCloseTrafficLightsModal = () => {
    setIsSidebarVisible(true);
    setIsLightsModalOpen(false);
    setActiveLight(null);
    setIsLightsLoading(false);
  };
  return (
    <>
      <MapContainer
        // ref={map}
        id="monitoring"
        attributionControl={false}
        center={center}
        zoom={JSON.parse(localStorage.getItem("its_currentZoom")) ?? 13}
        zoomDelta={0.6}
        doubleClickZoom={false}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        <Sidebar
          t={t}
          // mapRef={map}
          changedMarker={changedMarker}
          isVisible={isSidebarVisible}
          setIsVisible={setIsSidebarVisible}
          isbigMonitorOpen={isbigMonitorOpen}
          activeMarker={activeMarker}
          handleCloseCrossroadModal={handleCloseCrossroadModal}
        />
        <ToastContainer containerId="alarms" className="z-[9998]" />
        <MapEvents
          setMap={setMap}
          setZoom={setZoom}
          setMarkers={setMarkers}
          changedMarker={changedMarker}
          fetchAlarmsData={fetchAlarmsData}
          // setZoom={setZoom}
        />
        {currentLayerDetails && (
          <TileLayer
            maxNativeZoom={currentLayerDetails.maxNativeZoom}
            url={currentLayerDetails.url}
            attribution={currentLayerDetails.attribution}
            key={currentLayerDetails.name}
            maxZoom={20}
          />
        )}
        {/* zoomcontrol */}{" "}
        <ZoomControl theme={theme} position={"bottomright"} />{" "}
        <Control position="bottomright">
          <div className="bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded">
            Zoom: {zoom}
          </div>
        </Control>
        {filter.trafficlights && <TrafficLightContainer />}
        {/* <Control position="bottomcenter"> */}
        {/* </Control> */}
        {/* 
        {useClusteredMarkers === "clustered" ||
        useClusteredMarkers === "clustered_dynamically" ? (
          <ClusteredMarkers
            usePieChartForClusteredMarkers={
              useClusteredMarkers === "clustered_dynamically"
            }
            key={useClusteredMarkers}
            handleMonitorCrossroad={handleMonitorCrossroadOpen}
            handleBoxModalOpen={handleBoxModalOpen}
            handleLightsModalOpen={handleLightsModalOpen}
            handleMarkerDragEnd={handleMarkerDragEnd}
            markers={markers}
            filter={filter}
            isDraggable={isDraggable}
            setMarkers={setMarkers}
            clearMarkers={clearMarkers}
            updateMarkers={updateMarkers}
            changedMarker={changedMarker}
            L={L}
          />
        ) : ( */}
        <DynamicMarkers
          usePieChartForClusteredMarkers={
            useClusteredMarkers === "clustered_dynamically"
          }
          key={useClusteredMarkers}
          handleMonitorCrossroad={handleMonitorCrossroadOpen}
          handleBoxModalOpen={handleBoxModalOpen}
          handleLightsModalOpen={handleLightsModalOpen}
          handleMarkerDragEnd={handleMarkerDragEnd}
          markers={markers}
          filter={filter}
          isDraggable={isDraggable}
          setMarkers={setMarkers}
          clearMarkers={clearMarkers}
          updateMarkers={updateMarkers}
          changedMarker={changedMarker}
          L={L}
          useDynamicFetching={useClusteredMarkers === "dynamic"}
        />
        {/* )} */}
      </MapContainer>

      <MapModals
        // crossroadModal={{ isOpen: isbigMonitorOpen, marker: activeMarker }}
        isBoxLoading={isBoxLoading}
        deviceModal={{ isOpen: isBoxModalOpen, device: activeBox }}
        isLightsLoading={isLightsLoading}
        trafficLightsModal={{ isOpen: isLightsModalOpen, light: activeLight }}
        onClose={{
          crossroad: handleCloseCrossroadModal,
          device: handleCloseDeviceModal,
          trafficLights: handleCloseTrafficLightsModal,
        }}
      />
    </>
  );
};

MapComponent.propTypes = {
  changedMarker: PropTypes.object,
  t: PropTypes.func,
};

export default memo(MapComponent);
