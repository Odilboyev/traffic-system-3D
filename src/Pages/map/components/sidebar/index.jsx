import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  MapIcon,
} from "@heroicons/react/16/solid";
import { CogIcon, LanguageIcon } from "@heroicons/react/24/solid";
import { FaFilter, FaLocationDot, FaMap } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward, IoMdSunny } from "react-icons/io";
import { MdBedtime, MdHistory } from "react-icons/md";
import { Suspense, useState } from "react";

import CurrentAlarms from "../../sections/currentAlarms";
import DeviceErrorHistory from "../../sections/deviceErrorHistory";
import DeviceManagement from "../../sections/deviceManagement";
import FilterControl from "../controls/filterControl";
import { HiCog8Tooth } from "react-icons/hi2";
import LanguageSwitcher from "../../sections/langSwitcher";
import MarkerClusterType from "../../sections/markerClusterType";
import RegionControl from "../controls/regionControl";
import SidebarItem from "./components/sidebarItem";
import SidebarSecondaryItem from "./components/sidebarSecondaryItem";
import { TbBell } from "react-icons/tb";
import TileLayerControl from "../controls/tileLayerControl";
import WidgetControl from "../controls/widgetControl";
import useLocalStorageState from "../../../../customHooks/uselocalStorageState";
import { useMap } from "react-leaflet";
import { useTheme } from "../../../../customHooks/useTheme";

// Sidebar Component
const Sidebar = ({ t, isVisible, setIsVisible }) => {
  const { theme, toggleTheme } = useTheme();
  const map = useMap();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setActiveSecondaryPanel(null);
  };
  const role = atob(localStorage.getItem("its_user_role"));
  const isPermitted = role === "admin" || role === "boss";

  const [isOpen, setIsOpen] = useLocalStorageState(
    "is_sidebar_open_its",
    false
  );
  const [activeSidePanel, setActiveSidePanel] = useState(null);
  const [activeSecondaryPanel, setActiveSecondaryPanel] = useState(null);
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
    <div
      tabIndex={0}
      onClick={(e) => e.stopPropagation()} // Prevents click events from reaching the map
      // onWheel={(e) => mapRef.current?.leafletElement.scrollWheelZoom.disable()}
      onMouseEnter={() => map.scrollWheelZoom?.disable()}
      onMouseLeave={() => map.scrollWheelZoom?.enable()}
      className={` ${
        isVisible ? "fixed" : "none"
      } z-[9999999999999999999] top-0 left-0 h-full max-h-full overflow-y-scroll no-scrollbar bg-gray-900/50 backdrop-blur-md text-white shadow-lg flex flex-col ${
        isOpen ? "min-w-[16vw]" : "w-18"
      } transition-all duration-300 ease-in-out select-none`}
    >
      {" "}
      {/* Toggle button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleSidebar();
        }}
        className="flex items-center justify-center h-12 border-b border-gray-700 text-gray-400 hover:text-white"
      >
        {isOpen ? (
          <IoIosArrowBack size={24} />
        ) : (
          <IoIosArrowForward size={24} />
        )}
      </button>
      <div className="no-scrollbar pb-[40%] flex flex-col items-center mt-4 space-y-3 overflow-y-auto flex-grow">
        {/* Sidebar items */}
        <div className="flex flex-col items-center mt-4 space-y-3">
          <SidebarItem
            icon={<FaFilter size={24} />}
            label={"markerFilters"}
            isOpen={isOpen}
            activeSidePanel={activeSidePanel}
            setActiveSidePanel={setActiveSidePanel}
            t={t}
            extraContent={<FilterControl t={t} />} // Include your custom component here
          />
          <SidebarItem
            icon={<FaLocationDot size={24} />}
            label="regionControl"
            isOpen={isOpen}
            t={t}
            activeSidePanel={activeSidePanel}
            setActiveSidePanel={setActiveSidePanel}
            extraContent={<RegionControl t={t} />} // Another custom component
          />
          <SidebarItem
            icon={<HiCog8Tooth size={24} />}
            label="widgetControl"
            isOpen={isOpen}
            t={t}
            activeSidePanel={activeSidePanel}
            setActiveSidePanel={setActiveSidePanel}
            extraContent={<WidgetControl t={t} />} // Another custom component
          />
          <SidebarItem
            icon={<MdHistory size={24} />}
            isOpen={isOpen}
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

          {isPermitted && (
            <SidebarItem
              icon={<CogIcon className="w-6 h-6" />}
              isOpen={isOpen}
              label="deviceManagement"
              activeSidePanel={activeSidePanel}
              setActiveSidePanel={setActiveSidePanel}
              extraContent={
                <DeviceManagement
                  setIsSidebarVisible={setIsVisible}
                  activeSidePanel={activeSidePanel}
                  setActiveSidePanel={setActiveSidePanel}
                />
              }
              t={t}
            />
          )}
          <SidebarItem
            icon={<TbBell size={24} />}
            isOpen={isOpen}
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
        </div>
      </div>
      <div
        className={`flex items-center fixed bottom-0 left-0 ${
          isOpen ? "justify-start" : "justify-center"
        } w-full px-4 py-3 gap-2 items-center bg-gray-900/70 backdrop-blur-md`}
      >
        <Suspense fallback={<div></div>}>
          <SidebarSecondaryItem
            icon={LanguageIcon}
            label="language"
            activeSecondaryPanel={activeSecondaryPanel}
            setActiveSecondaryPanel={setActiveSecondaryPanel}
            component={
              <LanguageSwitcher
                setIsOpen={() => setActiveSecondaryPanel(null)}
              />
            }
          />
          {isOpen && (
            <>
              <SidebarSecondaryItem
                icon={FaMap}
                label={"tile_layer_control"}
                activeSecondaryPanel={activeSecondaryPanel}
                setActiveSecondaryPanel={setActiveSecondaryPanel}
                component={<TileLayerControl t={t} />}
              />
              <SidebarSecondaryItem
                icon={MapIcon}
                label={"markers"}
                activeSecondaryPanel={activeSecondaryPanel}
                setActiveSecondaryPanel={setActiveSecondaryPanel}
                component={<MarkerClusterType t={t} />}
              />
              <SidebarSecondaryItem
                onClick={toggleFullSceen}
                icon={fulscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon}
              />
              <SidebarSecondaryItem
                onClick={toggleTheme}
                icon={theme === "light" ? MdBedtime : IoMdSunny}
              />
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
};

// SidebarItem Component with extra content

export default Sidebar;
