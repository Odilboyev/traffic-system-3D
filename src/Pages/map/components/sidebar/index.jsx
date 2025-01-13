import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/16/solid";
import { Checkbox, Typography } from "@material-tailwind/react";
import {
  FaCar,
  FaFilter,
  FaLocationDot,
  FaMap,
  FaRoad,
  FaRoadLock,
} from "react-icons/fa6";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdCar,
  IoMdCube,
  IoMdSunny,
} from "react-icons/io";
import {
  MdBedtime,
  MdBubbleChart,
  MdHistory,
  MdOutlineLanguage,
  MdOutlineTraffic,
  MdTraffic,
  MdWidgets,
} from "react-icons/md";
import { TbBell, TbServerCog } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

import CrossroadWidget from "../../widgets/crossroadData";
import CurrentAlarms from "../../sections/currentAlarms";
import DateTime from "./components/time";
import DeviceErrorHistory from "../../sections/deviceErrorHistory";
import DeviceManagement from "../../sections/deviceManagement";
import { FaCarCrash } from "react-icons/fa";
import FilterControl from "../controls/filterControl";
import { HiCog6Tooth } from "react-icons/hi2";
import InfoWidget from "../../widgets/infoWidget";
import LanguageSwitcher from "../../sections/langSwitcher";
import Logo from "./components/logo";
import MarkerClusterType from "../../sections/markerClusterType";
import MarkerControl from "../controls/markerControl";
import RegionControl from "../controls/regionControl";
import RoadDrawerControl from "./components/RoadDrawerControl";
import SidebarItem from "./components/sidebarItem";
import SidebarSecondaryItem from "./components/sidebarSecondaryItem";
import TileLayerControl from "../controls/tileLayerControl";
import UserName from "./components/userName";
import WeatherCard from "./components/weather/weatherCard";
import WidgetControl from "../controls/widgetControl";
import { isPermitted } from "../../constants/roles";
import useLocalStorageState from "../../../../customHooks/uselocalStorageState";
import { useSelector } from "react-redux";
import { useTheme } from "../../../../customHooks/useTheme";

// Sidebar Component
const Sidebar = ({
  t,
  isVisible,
  changedMarker,
  setIsVisible,
  isbigMonitorOpen,
  activeMarker,
  handleCloseCrossroadModal,
  reloadMarkers,
}) => {
  // const map = useMap();
  const {
    theme,
    toggleTheme,
    toggleTrafficJam,
    showTrafficJam,
    toggle3DLayer,
    show3DLayer,
  } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorageState(
    "is_sidebar_open_its",
    false
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1024
  );
  const [currentLocation, setCurrentLocation] = useLocalStorageState(
    "its_currentLocation"
  );
  const widgets = useSelector((state) => state.map.widgets);

  // Add resize event listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useMapEvents({
  //   moveend: () => {
  //     const center = map.getCenter();
  //     setCurrentLocation([+center.lat, +center.lng]);
  //   },
  // });

  const [activeSidePanel, setActiveSidePanel] = useState(null);
  const [activeSecondaryPanel, setActiveSecondaryPanel] = useState(null);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setActiveSidePanel(null);
    // setActiveSecondaryPanel(null);
  };

  const [fulscreen, setFullscreen] = useState(false);

  const toggleFullSceen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };
  return (
    <div className="pointer-events-none">
      {" "}
      <div
        // onPointerEnter={() => map.scrollWheelZoom?.disable()}
        // onPointerLeave={() => map.scrollWheelZoom.enable()}
        className={` ${
          isVisible ? "fixed" : "none"
        } z-10 top-0 left-0 h-full max-h-full  pointer-events-auto no-scrollbar transition-all duration-200 ease-in-out bg-gray-100/30  dark:bg-gray-900/30 backdrop-blur-2xl  shadow-lg flex flex-col ${
          isSidebarOpen
            ? isMobile
              ? "w-[80vw]"
              : isTablet
              ? "w-[40vw]"
              : "w-[15vw]"
            : "w-18"
        } transition-all duration-300 ease-in-out select-none`}
      >
        {/* Toggle button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
          className="flex items-center rounded-none justify-center h-12 border-b border-gray-700 hover:text-white"
        >
          {isSidebarOpen ? (
            <IoIosArrowBack className="w-4 h-4" />
          ) : (
            <IoIosArrowForward className="w-4 h-4" />
          )}
        </button>
        {/* main content of sidebar */}
        <div className="overflow-y-scroll scrollbar-hide pb-[40%] flex flex-col items-center space-y-3 gap-1 h-[calc(100vh-100px)]">
          {/* Widgets */}
          <Logo t={t} isSidebarOpen={isSidebarOpen} />
          {widgets.time && (
            <DateTime
              t={t}
              isSidebarOpen={isSidebarOpen}
              currentLocation={currentLocation}
            />
          )}{" "}
          {widgets.weather && (
            <WeatherCard t={t} isSidebarOpen={isSidebarOpen} />
          )}
          {/* Sidebar items */}
          <div className="flex flex-col items-center space-y-2 w-full">
            <SidebarItem
              icon={<FaFilter className="w-4 h-4" />}
              label={"markerFilters"}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              activeSidePanel={activeSidePanel}
              setActiveSidePanel={setActiveSidePanel}
              t={t}
              extraContent={<FilterControl t={t} />} // Include your custom component here
            />
            {/* <SidebarItem
              icon={<FaLocationDot className="w-4 h-4" />}
              label="regionControl"
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              t={t}
              activeSidePanel={activeSidePanel}
              setActiveSidePanel={setActiveSidePanel}
              extraContent={
                <RegionControl t={t} activeSidePanel={activeSidePanel} />
              } // Another custom component
            /> */}
            <SidebarItem
              icon={<MdWidgets className="w-4 h-4" />}
              label="widgetControl"
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              t={t}
              activeSidePanel={activeSidePanel}
              setActiveSidePanel={setActiveSidePanel}
              extraContent={<WidgetControl t={t} />} // Another custom component
            />
            {/* <SidebarItem
              icon={<FaRoad className="w-4 h-4" />}
              label="roadDrawer"
              t={t}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              activeSidePanel={activeSidePanel}
              setActiveSidePanel={setActiveSidePanel}
              extraContent={<RoadDrawerControl map={map} t={t} />}
            /> */}
            {isPermitted && (
              <SidebarItem
                icon={<TbServerCog className="w-4 h-4" />}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                label="deviceManagement"
                activeSidePanel={activeSidePanel}
                setActiveSidePanel={setActiveSidePanel}
                extraContent={
                  <DeviceManagement
                    setIsSidebarVisible={setIsVisible}
                    activeSidePanel={activeSidePanel}
                    setActiveSidePanel={setActiveSidePanel}
                    reloadMarkers={reloadMarkers}
                  />
                }
                t={t}
              />
            )}
            <SidebarItem
              icon={<TbBell className="w-4 h-4" />}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              label="currentAlarms"
              activeSidePanel={activeSidePanel}
              setActiveSidePanel={(e) => {
                setActiveSidePanel(e);
                setIsVisible(false);
              }}
              content={
                <CurrentAlarms
                  activeSidePanel={activeSidePanel}
                  setActiveSidePanel={(e) => {
                    setActiveSidePanel(e);
                    setIsVisible(true);
                  }}
                />
              }
              t={t}
            />
            {/* <ErrorBoundary> */}
            <SidebarItem
              icon={<MdHistory className="w-4 h-4" />}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              label="deviceErrorHistory"
              activeSidePanel={activeSidePanel}
              setActiveSidePanel={(e) => {
                setActiveSidePanel(e);
                setIsVisible(false);
              }}
              content={
                <DeviceErrorHistory
                  activeSidePanel={activeSidePanel}
                  setActiveSidePanel={(e) => {
                    setActiveSidePanel(e);
                    setIsVisible(true);
                  }}
                />
              }
              t={t}
            />
            {/* </ErrorBoundary> */}
          </div>
        </div>

        <div
          className={`w-full max-w-full no-scrollbar gap-2 items-center bg-blue-gray-100/30 backdrop-blur dark:bg-gray-900  border-t border-gray-500/20
            flex flex-col absolute bottom-0  py-3 left-0 ${
              isSidebarOpen ? "justify-evenly " : "justify-center"
            } `}
        >
          <div className="mb-2 w-full">
            <UserName t={t} isSidebarOpen={isSidebarOpen} />
          </div>
          <div className="flex items-center  w-full justify-evenly">
            <SidebarSecondaryItem
              onClick={toggleTrafficJam}
              icon={IoMdCar}
              className={showTrafficJam ? "relative overflow-hidden" : ""}
              iconClassName={
                showTrafficJam
                  ? "text-blue-500 transform scale-110" // Highlight when active
                  : ""
              }
            />
            {isSidebarOpen && (
              <>
                <SidebarSecondaryItem
                  onClick={toggleTheme}
                  icon={theme === "light" ? MdBedtime : IoMdSunny}
                />{" "}
                <SidebarSecondaryItem
                  icon={MdOutlineLanguage}
                  label="language"
                  activeSecondaryPanel={activeSecondaryPanel}
                  setActiveSecondaryPanel={setActiveSecondaryPanel}
                  component={
                    <LanguageSwitcher
                      setIsSidebarOpen={() => setActiveSecondaryPanel(null)}
                    />
                  }
                />
                <SidebarSecondaryItem
                  icon={HiCog6Tooth}
                  label={"settings"}
                  activeSecondaryPanel={activeSecondaryPanel}
                  setActiveSecondaryPanel={setActiveSecondaryPanel}
                  component={<MarkerControl t={t} />}
                />
                <SidebarSecondaryItem
                  icon={FaMap}
                  label={"tile_layer_control"}
                  activeSecondaryPanel={activeSecondaryPanel}
                  setActiveSecondaryPanel={setActiveSecondaryPanel}
                  component={<TileLayerControl t={t} />}
                />
                <SidebarSecondaryItem
                  icon={MdBubbleChart}
                  label={"clusterization"}
                  activeSecondaryPanel={activeSecondaryPanel}
                  setActiveSecondaryPanel={setActiveSecondaryPanel}
                  component={<MarkerClusterType t={t} />}
                />
                <SidebarSecondaryItem
                  onClick={toggleFullSceen}
                  icon={
                    fulscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon
                  }
                />
                <>
                  <SidebarSecondaryItem
                    onClick={toggle3DLayer}
                    icon={IoMdCube}
                    className={show3DLayer ? "relative" : ""}
                    iconClassName={
                      show3DLayer
                        ? "text-blue-500 transform scale-110" // Highlight when active
                        : ""
                    }
                    label="3D Layer"
                  />
                  {/* Other existing sidebar items */}
                </>
              </>
            )}
          </div>
        </div>
      </div>
      {widgets.bottomsection && (
        <InfoWidget
          t={t}
          changedMarker={changedMarker}
          isSideBarOpen={isSidebarOpen}
        />
      )}
      {isbigMonitorOpen && activeMarker ? (
        <CrossroadWidget
          t={t}
          isVisible={isVisible}
          marker={activeMarker}
          isOpen={isbigMonitorOpen}
          onClose={handleCloseCrossroadModal}
        />
      ) : (
        <div style={{ display: "none" }}></div>
      )}
    </div>
  );
};

export default Sidebar;
