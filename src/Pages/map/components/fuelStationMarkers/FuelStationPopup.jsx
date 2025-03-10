import {
  BuildingOfficeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { getDistricts, getRegions } from "../../../../api/api.handlers";

const FuelStationPopup = ({ station, t }) => {
  const [regionName, setRegionName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      try {
        // Fetch region data
        if (station.region_id) {
          const regionsData = await getRegions();
          const region = regionsData.find((r) => r.id === station.region_id);
          if (region) {
            setRegionName(region.name);
          }
        }

        // Fetch district data
        if (station.district_id && station.region_id) {
          const districtsData = await getDistricts(station.region_id);
          const district = districtsData.find(
            (d) => d.id === station.district_id
          );
          if (district) {
            setDistrictName(district.name);
          }
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationData();
  }, [station]);

  // Mock data for demonstration - in a real app, these would come from the API
  const stationDetails = {
    openingHours: "24/7",
    phoneNumber: "+998 71 123 4567",
    fuelTypes: ["AI-80", "AI-92", "AI-95", "Diesel"],
    prices: {
      "AI-80": "5,500 UZS",
      "AI-92": "6,200 UZS",
      "AI-95": "7,100 UZS",
      Diesel: "6,800 UZS",
    },
  };

  return (
    <div className=" p-3 max-w-sm bg-gray-900/80 backdrop-blur-md">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{station.name}</h3>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              station.type === "petrol"
                ? "bg-blue-100 text-blue-800"
                : station.type === "gas"
                ? "bg-orange-100 text-orange-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {station.type === "petrol"
              ? t
                ? t("Petrol")
                : "Petrol"
              : station.type === "gas"
              ? t
                ? t("Gas")
                : "Gas"
              : t
              ? t("Electric")
              : "Electric"}
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {regionName && (
              <div className="flex items-center gap-2 text-sm">
                <GlobeAltIcon className="h-4 w-4 text-gray-500" />
                <span>{regionName}</span>
              </div>
            )}

            {districtName && (
              <div className="flex items-center gap-2 text-sm">
                <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />
                <span>{districtName}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <MapPinIcon className="h-4 w-4 text-gray-500" />
              <span>
                {t ? t("Coordinates") : "Coordinates"}: {station.lat.toFixed(6)}
                , {station.lng.toFixed(6)}
              </span>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-2 mt-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <span>{stationDetails.openingHours}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="h-4 w-4 text-gray-500" />
              <span>{stationDetails.phoneNumber}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-2">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <CurrencyDollarIcon className="h-4 w-4" />
            {t ? t("Fuel Prices") : "Fuel Prices"}
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(stationDetails.prices).map(([fuel, price]) => (
              <div key={fuel} className="flex justify-between text-sm">
                <span className="text-gray-600">{fuel}</span>
                <span className="font-medium">{price}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm font-medium transition-colors"
          onClick={() =>
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`,
              "_blank"
            )
          }
        >
          {t ? t("Get Directions") : "Get Directions"}
        </button>
      </div>
    </div>
  );
};

export default FuelStationPopup;
