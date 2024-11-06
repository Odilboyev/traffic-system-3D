import { IconButton } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLocationDot } from "react-icons/fa6";
import { getDistricts, getRegions } from "../../../../../api/api.handlers";
import Control from "../../../../../components/customControl";
import SidePanel from "../../../../../components/sidePanel";

const RegionControl = ({
  activeSidePanel,
  setActiveSidePanel,
  handleProvinceChange,
}) => {
  const { t } = useTranslation();
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState({});
  const [hoveredRegion, setHoveredRegion] = useState(null);

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
    setHoveredRegion(regionId);
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
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
                className="relative"
                onClick={() => handleProvinceChange(region)}
                onMouseEnter={() => handleMouseEnter(region.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="w-full text-left px-3 py-2 hover:bg-gray-800/50 rounded-none transition-colors font-medium">
                  {region.name}
                </button>
                {hoveredRegion === region.id && districts[region.id] && (
                  <div className="absolute left-full top-0 ml-2 bg-gray-900 rounded-lg shadow-lg min-w-[200px] z-50">
                    <div className="py-2">
                      {districts[region.id].map((district) => (
                        <button
                          key={district.id}
                          onClick={() => {
                            handleProvinceChange(district);
                            setActiveSidePanel(null);
                          }}
                          className="w-full text-left px-4 py-1.5 hover:bg-gray-800/50 transition-colors text-sm"
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
  activeSidePanel: PropTypes.string,
  setActiveSidePanel: PropTypes.func.isRequired,
  handleProvinceChange: PropTypes.func.isRequired,
};

export default RegionControl;
