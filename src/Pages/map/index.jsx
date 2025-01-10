import "./components/TrafficJamPolylines/styles.css";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { getBoxData, markerHandler } from "../../api/api.handlers.js";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import BaseLayerHandler from "./components/BaseLayerHandler";
import DynamicMarkers from "./components/markers/DynamicMarkers.jsx";
import L from "leaflet";
import MapCRSHandler from "./utils/mapCsrHandler.jsx";
import MapEvents from "./components/MapEvents/index.jsx";
import MapLibreLayer from "./components/MapLibreLayer";
import MapModals from "./components/MapModals/index.jsx";
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
  useEffect(() => {
    if (changedMarkers && changedMarkers.length > 0) {
      // Batch process notifications
      changedMarkers.forEach((changedMarker) => {
        handleToaster(changedMarker);
      });
      // // Dispatch batch marker update
      // dispatchMarkers({
      //   type: "BATCH_UPDATE_MARKERS",
      //   payload: changedMarkers,
      // });
    }
  }, [changedMarkers, handleToaster]);

  return null;
};

const MapComponent = memo(({ changedMarkers, notifications, t }) => {
  const {
    markers,
    setMarkers,
    getDataHandler,
    clearMarkers,
    updateMarkers,
    useClusteredMarkers,
  } = useMapMarkers();

  const filter = useSelector((state) => state.map.filter);
  const { fetchAlarmsData } = useMapAlarms();

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const { theme, currentLayer, showTrafficJam, show3DLayer } = useTheme();

  const center = safeParseJSON("its_currentLocation", home);

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
    const fetchData = async () => {
      await getDataHandler();
      await fetchAlarmsData();
    };
    fetchData();
  }, [filter]); // Only re-fetch when filter changes

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

  const handleMarkerDragEnd = (id, type, event, svetofor_id) => {
    const { lat, lng } = event.target.getLatLng();

    try {
      markerHandler({
        lat: lat,
        lng: lng,
        id,
        type,
        svetofor_id: svetofor_id ? svetofor_id : undefined,
      });
      // getData();
    } catch (error) {
      getDataHandler();
    }
  };

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
        ref={mapRef}
        key={currentLayer}
        id="monitoring"
        attributionControl={false}
        center={JSON.parse(localStorage.getItem("its_currentLocation")) || home}
        zoom={JSON.parse(localStorage.getItem("its_currentZoom")) || 11}
        zoomDelta={0.6}
        doubleClickZoom={false}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
        maxZoom={20}
        className="h-screen w-screen !bg-transparent"
      >
        <NotificationBox notifications={notifications} map={mapRef.current} />
        {/* <BaseLayerHandler /> */}
        <MapLibreLayer />
        {!show3DLayer && <TrafficJamPolylines />}
        <MapCRSHandler currentLayer={currentLayer} />
        {/* <MapMarkerToaster changedMarker={changedMarkers} /> */}
        <Sidebar
          t={t}
          changedMarker={changedMarkers}
          isVisible={isSidebarVisible}
          setIsVisible={setIsSidebarVisible}
          isbigMonitorOpen={isbigMonitorOpen}
          activeMarker={activeMarker}
          handleCloseCrossroadModal={handleCloseCrossroadModal}
          reloadMarkers={getDataHandler}
        />
        {/* {!isbigMonitorOpen ? <FindMeControl /> : ""} */}
        <ToastContainer containerId="alarms" className="z-[9998]" />
        <MapEvents changedMarkers={changedMarkers} />
        {currentLayerDetails && !show3DLayer && (
          <TileLayer
            maxNativeZoom={currentLayerDetails.maxNativeZoom}
            url={currentLayerDetails.url}
            attribution={currentLayerDetails.attribution}
            key={currentLayerDetails.name}
            maxZoom={20}
          />
        )}
        <TrafficJamLayer showTrafficJam={showTrafficJam} />
        <ZoomControl theme={theme} position={"topright"} />{" "}
        {filter.trafficlights && (
          <TrafficLightContainer handleMarkerDragEnd={handleMarkerDragEnd} />
        )}
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
          setMarkers={setMarkers}
          clearMarkers={clearMarkers}
          updateMarkers={updateMarkers}
          L={L}
          useDynamicFetching={useClusteredMarkers === "dynamic"}
        />
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
});

MapComponent.propTypes = {
  changedMarkers: PropTypes.array,
  t: PropTypes.func,
};

export default MapComponent;
