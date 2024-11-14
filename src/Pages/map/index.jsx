import { MapContainer, TileLayer } from "react-leaflet";
import { getBoxData, markerHandler } from "../../api/api.handlers.js";
import { useEffect, useRef, useState } from "react";

import ClusteredMarkers from "./components/markers/ClusteredMarkers.jsx";
import Control from "../../components/customControl/index.jsx";
import CrossroadWidget from "./widgets/crossroadData";
import DynamicMarkers from "./components/markers/DynamicMarkers.jsx";
import InfoWidget from "./widgets/infoWidget/index.jsx";
import MapEvents from "./components/MapEvents/index.jsx";
import MapModals from "./components/MapModals/index.jsx";
import PropTypes from "prop-types";
import Sidebar from "./components/sidebar/index.jsx";
import { ToastContainer } from "react-toastify";
import TrafficLightContainer from "./components/trafficLightMarkers/managementLights.jsx";
import WeatherWidget from "./widgets/weather/index.jsx";
import ZoomControl from "./components/controls/customZoomControl/index.jsx";
import baseLayers from "../../configurations/mapLayers.js";
import toaster from "../../tools/toastconfig.jsx";
import { useMapAlarms } from "./hooks/useMapAlarms.js";
import { useMapMarkers } from "./hooks/useMapMarkers.jsx";
import { useTheme } from "../../customHooks/useTheme.jsx";

const home = [41.2995, 69.2401]; // Tashkent

const MapComponent = ({ changedMarker, t }) => {
  const {
    markers,
    setMarkers,
    bottomSectionData,
    getDataHandler,
    clearMarkers,
    updateMarkers,
    useClusteredMarkers,
    filter,
    widgets,
    isDraggable,
  } = useMapMarkers();

  const { fetchAlarmsData } = useMapAlarms();

  // sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  //theme
  const { theme, currentLayer } = useTheme();

  const center = JSON.parse(localStorage.getItem("mapCenter"))
    ? JSON.parse(localStorage.getItem("mapCenter"))
    : home;
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

  const map = useRef(null);

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
    setIsSidebarVisible(false);
    console.log(marker);
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
    setIsSidebarVisible(true);
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

  // Add useEffect to handle changedMarker updates
  useEffect(() => {
    if (changedMarker) {
      toaster(changedMarker, map);
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker.cid === changedMarker.cid && marker.type === changedMarker.type
            ? changedMarker
            : marker
        )
      );
    }
  }, [changedMarker]);

  return (
    <>
      <MapContainer
        ref={map}
        id="monitoring"
        attributionControl={false}
        center={center}
        zoom={zoom}
        zoomDelta={0.6}
        doubleClickZoom={false}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
      >
        <Sidebar
          t={t}
          mapRef={map}
          isVisible={isSidebarVisible}
          setIsVisible={setIsSidebarVisible}
        />
        <ToastContainer containerId="alarms" className="z-[9998]" />
        <MapEvents
          changedMarker={changedMarker}
          fetchAlarmsData={fetchAlarmsData}
          setZoom={setZoom}
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
        {/* zoomcontrol */} <ZoomControl theme={theme} />{" "}
        <Control position="bottomright">
          <div className="bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded">
            Zoom: {zoom}
          </div>
        </Control>
        {/* <Control position="topleft">
          <FilterControl
            activeSidePanel={activeSidePanel}
            setActiveSidePanel={setActiveSidePanel}
            filter={filter}
            changeFilter={setFilter}
          />
        </Control> */}
        {/* <RegionControl
          activeSidePanel={activeSidePanel}
          setActiveSidePanel={setActiveSidePanel}
          t={t}
        /> */}
        {/* settings */}
        {/* <WidgetControl

          isDraggable={isDraggable}
          setIsDraggable={setIsDraggable}
          widgets={widgets}
          setWidgets={setWidgets}
          t={t}
        /> */}
        {/* layerchanger */}
        {/* <TileChanger
          activeSidePanel={activeSidePanel}
          setActiveSidePanel={setActiveSidePanel}
        /> */}
        <Control position="topright">
          {widgets.weather ? (
            <WeatherWidget t={t} />
          ) : (
            <div style={{ display: "none" }}></div>
          )}
        </Control>{" "}
        <Control position="topright">
          {widgets.crossroad ? (
            <CrossroadWidget />
          ) : (
            <div style={{ display: "none" }}></div>
          )}
        </Control>
        <Control position="bottomcenter">
          {widgets.bottomsection && (
            <InfoWidget cardsInfoData={bottomSectionData} />
          )}
        </Control>
        {/* <DynamicWidgets widgets={widgets} t={t} /> */}
        {/* lights */}
        {/* signs  */}
        {/* {<SignsContainer isVisible={filter.signs} />} */}
        {/* aalarm history */}
        {/* <Control position="topleft">
          <DeviceErrorHistory
            activeSidePanel={activeSidePanel}
            setActiveSidePanel={setActiveSidePanel}
          />
        </Control> */}
        {/* Device Management */}
        {/* {isPermitted && (
          <Control position="topleft">
            <DeviceManagement
              refreshHandler={getDataHandler}
              activeSidePanel={activeSidePanel}
              setActiveSidePanel={setActiveSidePanel}
            />
          </Control>
        )} */}
        {/* <Control position="topleft">
          <IconButton
            // color={theme === "light" ? "black" : "white"}
            size="lg"
            onClick={toggleFullSceen}
          >
            {fulscreen ? (
              <ArrowsPointingInIcon className="w-8 h-8 p-1" />
            ) : (
              <ArrowsPointingOutIcon className="w-8 h-8 p-1" />
            )}
          </IconButton>
        </Control> */}
        {/* <LanguageSwitcher /> */}
        {/* <Control position="topleft">
          <IconButton
            // color={theme === "light" ? "black" : "white"}
            size="lg"
            onClick={() =>
              setActiveSidePanel(activeSidePanel === "alarms" ? null : "alarms")
            }
          >
            {activeSidePanel === "alarms" ? (
              <TbBell className="w-6 h-6" />
            ) : (
              <TbBellRinging className="w-6 h-6" />
            )}
          </IconButton>
          <SidePanel
            title={t("alarms")}
            wrapperClass="fixed top-5  inline-block text-left"
            isOpen={activeSidePanel === "alarms"}
            setIsOpen={() => setActiveSidePanel(null)}
            content={<CurrentAlarms data={currentAlarms} />}
          />
        </Control> */}
        {/* <Control position="topleft">
          <IconButton
            size="lg"
            onClick={() => {
              setActiveSidePanel(
                activeSidePanel === "markers" ? null : "markers"
              );
            }}
          >
            <FaRegMap className="w-5 h-5" />
          </IconButton> */}
        {/* <SidePanel
            title={t("markers")}
            wrapperClass="absolute -top-28  inline-block text-left"
            sndWrapperClass="absolute left-full ml-2 no-scrollbar overflow-y-scroll w-[15vw] "
            isOpen={activeSidePanel === "markers"}
            setIsOpen={() => setActiveSidePanel(null)}
            content={
              <div className="flex rounded-b-lg flex-col p-3 bg-gray-900/80 text-blue-gray-900">
                {["clustered", "clustered_dynamically", "dynamic"].map(
                  (type) => (
                    <Radio
                      key={type}
                      checked={useClusteredMarkers === type}
                      className="checked:bg-white"
                      value={type === useClusteredMarkers}
                      onChange={() => {
                        setUseClusteredMarkers(type);
                        type !== "dynamic" ? getDataHandler() : setMarkers([]);
                      }}
                      label={
                        <Typography className="mr-3 text-white">
                          {t(type) || ""}
                        </Typography>
                      }
                    />
                  )
                )}
              </div>
            }
          /> */}
        {/* </Control> */}
        {/* <Control position="topleft">
          <IconButton
            // color={theme === "light" ? "black" : "white"}
            size="lg"
            onClick={() => toggleTheme()}
          >
            {theme === "light" ? (
              <MdBedtime className="w-7 h-7 p-1" />
            ) : (
              <IoMdSunny className="w-7 h-7 p-1" />
            )}
          </IconButton>
        </Control> */}
        {filter.trafficlights && <TrafficLightContainer />}
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
          />
        ) : (
          <DynamicMarkers
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
          />
        )}
      </MapContainer>

      <MapModals
        crossroadModal={{ isOpen: isbigMonitorOpen, marker: activeMarker }}
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

export default MapComponent;
