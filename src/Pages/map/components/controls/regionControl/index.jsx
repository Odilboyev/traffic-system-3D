import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { getDistricts, getRegions } from "../../../../../api/api.handlers";

const RegionControl = ({ t }) => {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState({});
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);

  // Access the map instance from react-leaflet's useMap hook
  const map = useMap();

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

  const handleRegionClick = (regionId) => {
    if (hoveredRegion !== regionId) {
      setHoveredRegion(regionId);
    }
  };

  const handleProvinceChange = (district) => {
    if (district) {
      setActiveDistrict(district.id);
      // Use map instance to fly to the district's location
      map.flyTo(JSON.parse(district.location), 15, {
        duration: 1,
      });
    }
  };

  return (
    <div className="flex flex-col p-3 ">
      <div className="rounded-lg flex flex-col gap-2 relative">
        {regions?.map((region) => (
          <div key={region.id} className="relative group border-l">
            <button
              onClick={() => handleRegionClick(region.id)}
              className={`text-left px-3 py-2 w-full hover:bg-gray-800/50 !rounded-none transition-colors font-medium ${
                hoveredRegion === region.id ? "bg-gray-800 text-blue-500" : ""
              }`}
            >
              {region.name}
            </button>
            {hoveredRegion === region.id && districts[region.id] && (
              <div className="ml-2 max-w-[200px] z-50">
                <div className="my-2 group border-l">
                  {districts[region.id].map((district, i) => (
                    <button
                      key={i}
                      onClick={() => handleProvinceChange(district)}
                      className={`text-left px-3 py-2 w-full border-l hover:bg-gray-800/50 !rounded-none transition-colors font-medium ${
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
    </div>
  );
};

RegionControl.propTypes = {
  t: PropTypes.func,
};

export default RegionControl;
