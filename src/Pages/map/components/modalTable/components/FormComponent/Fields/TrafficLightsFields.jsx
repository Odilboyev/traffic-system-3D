import { useEffect, useState } from "react";
import InputField from "../../../../../../../components/InputField";
import LocationPicker from "../../../../../../../components/LocationPicker";
import SelectField from "../../../../../../../components/SelectField";
import { fetchDataForManagement } from "../../../../../../../api/api.handlers";
import { toast } from "react-toastify";
import { MdCameraAlt, MdFlag } from "react-icons/md";
import { t } from "i18next";
import { crossroadHandler } from "../utils";
import { LiaTrafficLightSolid } from "react-icons/lia";

// TrafficLightsFields-specific fields
const TrafficLightsFields = ({ formData, handleInputChange }) => {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: "HIKVISION",
    },
    {
      id: 2,
      name: "FAMA",
    },
  ]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [crossroads, setCrossroads] = useState(null);
  const [selectedCrossroad, setSelectedCrossroad] = useState(null);

  useEffect(() => {
    crossroadHandler(
      formData,
      setCrossroads,
      setSelectedCrossroad,
      handleInputChange
    );
  }, []);

  const handleCrossroadChange = (selected) => {
    setSelectedCrossroad(selected);
    handleInputChange("crossroad_id", selected.id);
    handleInputChange("lat", selected.lat);
    handleInputChange("lng", selected.lng);
  };
  const handleVendorChange = (selected) => {
    setSelectedVendor(selected);
    handleInputChange("vendor_id", selected.id);
  };
  return (
    <div className="flex gap-10 h-full">
      <div className="flex flex-col gap-3 w-1/3">
        {[
          "name",
          "ip",
          "login",
          "password",
          "http_port",
          "ws_port",
          "sdk_port",
          "debug_port",
          "udp_port",
        ].map((field) => (
          <InputField
            key={field}
            required
            icon={LiaTrafficLightSolid}
            label={t(field)}
            value={formData[field] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3 w-2/3">
        {vendors && (
          <SelectField
            icon={MdFlag}
            label={t("vendor")}
            options={vendors}
            value={vendors.find((item) => item.id == selectedVendor?.id)}
            getOptionLabel={(option) => option.name || ""}
            getOptionValue={(option) => option.id}
            onChange={handleVendorChange}
            zIndex={6000}
          />
        )}
        {crossroads != null && selectedCrossroad != null && (
          <SelectField
            icon={MdFlag}
            label={t("crossroad")}
            options={crossroads}
            value={crossroads.find((item) => item.id == selectedCrossroad?.id)}
            getOptionLabel={(option) => option.name || ""}
            getOptionValue={(option) => option.id}
            onChange={handleCrossroadChange}
          />
        )}
        {crossroads && selectedCrossroad && (
          <div className="flex-grow">
            <LocationPicker
              lat={formData.lat || selectedCrossroad.lat}
              lng={formData.lng || selectedCrossroad.lng}
              handleInputChange={handleInputChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficLightsFields;