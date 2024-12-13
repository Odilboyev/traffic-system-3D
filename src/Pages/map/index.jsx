import { MapContainer, TileLayer } from "react-leaflet";
import { getBoxData, markerHandler } from "../../api/api.handlers.js";
import { memo, useEffect, useRef, useState } from "react";

import { CRS } from "leaflet";
import Control from "../../components/customControl/index.jsx";
import DynamicMarkers from "./components/markers/DynamicMarkers.jsx";
import L from "leaflet";
import MapEvents from "./components/MapEvents/index.jsx";
import MapModals from "./components/MapModals/index.jsx";
import PropTypes from "prop-types";
import Sidebar from "./components/sidebar/index.jsx";
import { ToastContainer } from "react-toastify";
import TrafficLightContainer from "./components/trafficLightMarkers/managementLights.jsx";
import ZoomControl from "./components/controls/customZoomControl/index.jsx";
import baseLayers from "../../configurations/mapLayers.js";
import { safeParseJSON } from "../../redux/utils.js";
import { useMap } from "react-leaflet";
import { useMapAlarms } from "./hooks/useMapAlarms.js";
import { useMapMarkers } from "./hooks/useMapMarkers.jsx";
import { useSelector } from "react-redux";
import { useTheme } from "../../customHooks/useTheme.jsx";

const home = [41.2995, 69.2401]; // Tashkent

const MapCRSHandler = ({ currentLayer }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      // Store current view state
      const center = map.getCenter();
      const zoom = map.getZoom();

      // Update CRS
      map.options.crs = currentLayer.includes("Yandex")
        ? L.CRS.EPSG3395
        : L.CRS.EPSG3857;

      // Force a re-render of the map
      map.invalidateSize();

      // Reset view with new CRS
      setTimeout(() => {
        map.setView(center, zoom, { animate: false });
      }, 100);
    }
  }, [currentLayer, map]);

  return null;
};

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
  const { theme, currentLayer, showTrafficJam } = useTheme();

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

  const mapRef = useRef(null);

  const currentLayerDetails = baseLayers.find((v) => v.name === currentLayer);

  useEffect(() => {
    getDataHandler();
    fetchAlarmsData();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      if (currentLayer === "Yandex") {
        map.options.crs = L.CRS.EPSG3395;
      } else {
        map.options.crs = L.CRS.EPSG3857;
      }
      map.invalidateSize();
      const center = map.getCenter();
      const zoom = map.getZoom();
      map.setView(center, zoom, { animate: false });
    }
  }, [currentLayer]);

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

  const [trafficTimestamp, setTrafficTimestamp] = useState(
    Math.floor(Date.now() / 60000) * 60
  );
  useEffect(() => {
    if (showTrafficJam) {
      const interval = setInterval(() => {
        setTrafficTimestamp(Math.floor(Date.now() / 60000) * 60);
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [showTrafficJam]);
  return (
    <>
      <MapContainer
        ref={mapRef}
        key={currentLayer}
        id="monitoring"
        attributionControl={false}
        center={center}
        zoom={JSON.parse(localStorage.getItem("its_currentZoom")) ?? 13}
        zoomDelta={0.6}
        doubleClickZoom={false}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
        maxZoom={20}
      >
        <MapCRSHandler currentLayer={currentLayer} />
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
        <MapEvents changedMarker={changedMarker} />
        {currentLayerDetails && (
          <TileLayer
            maxNativeZoom={currentLayerDetails.maxNativeZoom}
            url={currentLayerDetails.url}
            attribution={currentLayerDetails.attribution}
            key={currentLayerDetails.name}
            maxZoom={20}
          />
        )}
        {showTrafficJam && (
          <>
            <TileLayer
              url={`https://core-jams-rdr-cache.maps.yandex.net/1.1/tiles?l=trf&lang=ru_RU&x={x}&y={y}&z={z}&scale=1&tm=${trafficTimestamp}`}
              tileSize={256}
              zoomOffset={0}
              maxNativeZoom={20}
              maxZoom={20}
            />
          </>
        )}
        {/* zoomcontrol */}{" "}
        <ZoomControl theme={theme} position={"bottomright"} />{" "}
        {filter.trafficlights && <TrafficLightContainer />}
        <DynamicMarkers
          t={t}
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
        t={t}
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
