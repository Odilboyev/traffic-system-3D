import { IconButton } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useMap } from "react-leaflet";
import { getDistricts, getRegions } from "../../../../../api/api.handlers";
import Control from "../../../../../components/customControl";
import SidePanel from "../../../../../components/sidePanel";

const RegionControl = ({ activeSidePanel, setActiveSidePanel, t }) => {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState({});
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await getRegions();
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (hoveredRegion && !districts[hoveredRegion]) {
        try {
          const data = await getDistricts(hoveredRegion);
          setDistricts((prev) => ({
            ...prev,
            [hoveredRegion]: data,
          }));
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [hoveredRegion]);

  const handleMouseEnter = (regionId) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredRegion(regionId);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredRegion(null);
    }, 300);
    setHoverTimeout(timeout);
  };

  const map = useMap();
  const handleProvinceChange = (value) => {
    if (value) {
      setActiveDistrict(value.id);
      setActiveRegion(hoveredRegion);
      map.flyTo(JSON.parse(value.location), 15, {
        duration: 1,
      });
    }
  };

  return (
    <Control className="z-[999999]" position="topleft">
      <IconButton
        size="lg"
        onClick={() =>
          setActiveSidePanel(activeSidePanel === "region" ? null : "region")
        }
      >
        <FaLocationDot className="w-5 h-5" />
      </IconButton>
      <SidePanel
        title={t("selectProvince")}
        sndWrapperClass="min-w-[15vw] absolute left-2"
        isOpen={activeSidePanel === "region"}
        setIsOpen={() => setActiveSidePanel(null)}
        content={
          <div className="rounded-lg flex flex-col gap-2 relative">
            {regions.map((region) => (
              <div
                key={region.id}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(region.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`w-full text-left px-3 py-2 hover:bg-gray-800/50 rounded-none transition-colors font-medium
                    ${
                      activeRegion === region.id
                        ? "bg-gray-800 text-blue-500"
                        : ""
                    }`}
                >
                  {region.name}
                </button>
                {hoveredRegion === region.id && districts[region.id] && (
                  <div
                    className="absolute left-full top-0 ml-2 bg-gray-900 rounded-lg shadow-lg min-w-[200px] z-50"
                    onMouseEnter={() => handleMouseEnter(region.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="py-2">
                      {districts[region.id].map((district) => (
                        <button
                          key={district.id}
                          onClick={() => {
                            handleProvinceChange(district);
                            setActiveSidePanel(null);
                          }}
                          className={`w-full text-left px-4 py-1.5 hover:bg-gray-800/50 transition-colors text-sm
                            ${
                              activeDistrict === district.id
                                ? "bg-gray-800 text-blue-500"
                                : ""
                            }`}
                        >
                          {district.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        }
      />
    </Control>
  );
};

RegionControl.propTypes = {
  activeSidePanel: PropTypes.any,
  setActiveSidePanel: PropTypes.func.isRequired,
};

export default RegionControl;
