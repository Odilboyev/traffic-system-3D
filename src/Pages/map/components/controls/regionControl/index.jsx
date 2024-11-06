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
  const [selectedRegion, setSelectedRegion] = useState(null);

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
      if (selectedRegion) {
        try {
          const data = await getDistricts(selectedRegion);
          setDistricts((prev) => ({
            ...prev,
            [selectedRegion]: data,
          }));
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [selectedRegion]);

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
          <div className="rounded-lg flex flex-col gap-2">
            {regions.map((region) => (
              <div key={region.id}>
                <button
                  onClick={() => setSelectedRegion(region.id)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800/50 rounded-none transition-colors font-medium"
                >
                  {region.name}
                </button>
                {selectedRegion === region.id && districts[region.id] && (
                  <div className="ml-4 flex flex-col">
                    {districts[region.id].map((district) => (
                      <button
                        key={district.id}
                        onClick={() => {
                          handleProvinceChange(district.id);
                          setActiveSidePanel(null);
                        }}
                        className="text-left px-3 py-1.5 hover:bg-gray-800/50 rounded-none transition-colors text-sm"
                      >
                        {district.name}
                      </button>
                    ))}
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
