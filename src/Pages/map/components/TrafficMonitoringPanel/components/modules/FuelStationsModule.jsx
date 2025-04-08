import { FaFilter, FaGasPump, FaSearch } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { RiGasStationFill, RiOilFill } from "react-icons/ri";

import SlidePanel from "../../../../../../components/SlidePanel/SlidePanel";
import { getFuelStationWidgets } from "../../../../../../api/api.handlers";
import { useZoomPanel } from "../../../../context/ZoomPanelContext";

const FuelStationsModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fuelType, setFuelType] = useState("all");
  const [widgetData, setWidgetData] = useState({
    widget_1: { name: "", data: [] },
    widget_2: { name: "", data: [] },
  });
  const conditionMet = useZoomPanel();

  useEffect(() => {
    const fetchWidgetData = async () => {
      try {
        const data = await getFuelStationWidgets();
        setWidgetData(data);
      } catch (error) {
        console.error("Error fetching fuel station widgets:", error);
      }
    };
    fetchWidgetData();
  }, []);

  // Convert widget_1 data to fuelPrices format
  const fuelTypeData = widgetData.widget_1.data || [];

  // Process regional data from widget_2
  const regionalData = widgetData.widget_2.data || [];

  // Transform regional data into fuel stations list
  const fuelStations = regionalData.map((region) => ({
    id: region.region_id,
    name: region.region_name,
    stations: region.stations.map((station) => ({
      type: station.name,
      count: station.count_station,
    })),
  }));

  // Filter stations based on search term and fuel type
  const filteredStations = fuelStations.filter((station) => {
    // First check if the station name matches the search term
    const matchesSearch = station.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // If no search match, exclude immediately
    if (!matchesSearch) return false;

    // If showing all types, include the station
    if (fuelType === "all") return true;

    // Find the specific station type we're filtering for
    const targetType = {
      benzin: "petrol",
      gaz: "gas",
      elektro: "electro",
    }[fuelType];

    // Find the station data for the selected type
    const stationOfType = station.stations.find((s) => s.type === targetType);

    // Include the station if it has the selected type AND has a count greater than 0
    return stationOfType && stationOfType.count > 0;
  });

  // Process widget data for display
  const getTotalByType = (type) => {
    const item = fuelTypeData.find((item) => item.name === type);
    return item ? item.count_station : 0;
  };

  const fuelPrices = [
    { type: "Benzin", count: getTotalByType("petrol") },
    { type: "Gaz", count: getTotalByType("gas") },
    { type: "Elektro", count: getTotalByType("electro") },
  ];
  const content = (
    <div className="fuel-stations-module left-side-panels h-full max-h-full overflow-y-auto max-w-[30vw] scrollbar-hide space-y-4 text-[#E2E8F0] font-sans">
      {/* Fuel Prices */}
      <div className="p-4 bg-[#1a1f2e]/90 backdrop-blur-md rounded-lg border border-cyan-500/20 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
        <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
          <RiOilFill className="mr-2 text-cyan-500" />
          {widgetData.widget_1.name}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {fuelPrices.map((fuel, index) => (
            <div
              key={index}
              className="p-3 rounded-md bg-[#2a3441]/80 border border-cyan-500/10 flex items-center justify-between hover:bg-[#2a3441] transition-all duration-300"
            >
              <span className="text-sm text-cyan-100">{fuel.type}</span>
              <div className="flex items-center">
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
                  {fuel.count}
                </span>
                <span className="ml-1 text-xs text-cyan-300">ta</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fuel Stations */}
      <div className="p-4 bg-[#1a1f2e]/90 backdrop-blur-md rounded-lg border border-cyan-500/20 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
        <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
          <RiGasStationFill className="mr-2 text-cyan-500" />
          {widgetData.widget_2.name}
        </h3>

        {/* Stations List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredStations.length > 0 ? (
            filteredStations.map((station) => (
              <div
                key={station.id}
                className="group p-4 rounded-md bg-[#2a3441]/80 border border-cyan-500/10 hover:bg-[#2a3441] transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <h4 className="text-lg font-semibold text-cyan-100 mb-3">
                    {station.name}
                  </h4>
                  <div className="space-y-2">
                    {station.stations.map((stationType, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-1"
                      >
                        <span className="text-sm text-cyan-200">
                          {stationType.type === "petrol" && "Benzin"}
                          {stationType.type === "gas" && "Gaz"}
                          {stationType.type === "electro" && "Elektro"}
                        </span>
                        <div className="flex items-center">
                          <span className="text-md font-bold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
                            {stationType.count}
                          </span>
                          <span className="ml-1 text-xs text-cyan-300">ta</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-cyan-300/60">
              Yoqilg'i stansiyalari topilmadi
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SlidePanel side="left" isOpen={conditionMet} content={content} />
    </>
  );
};

export default FuelStationsModule;
