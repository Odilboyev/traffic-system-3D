import { useEffect, useState } from "react";
import InputField from "../components/InputField";
import LocationPicker from "../components/LocationPicker";
import SelectField from "../components/SelectField";
import { fetchDataForManagement } from "../../../../../../../api/api.handlers";
import { toast } from "react-toastify";
import { MdCameraAlt, MdFlag } from "react-icons/md";
import { t } from "i18next";
import { crossroadHandler } from "../utils";
import { LiaTrafficLightSolid } from "react-icons/lia";

// TrafficLightsFields-specific fields
const TrafficLightsFields = ({ formData, handleInputChange }) => {
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

  return (
    <>
      {[
        "name",
        "ip",
        "login",
        "password",
        "http_port",
        "ws_port",
        "sdk_port",
        "debug_port",
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
        <LocationPicker
          lat={formData.lat || selectedCrossroad.lat}
          lng={formData.lng || selectedCrossroad.lng}
          handleInputChange={handleInputChange}
        />
      )}
    </>
  );
};

export default TrafficLightsFields;
