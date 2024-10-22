import { useEffect, useState } from "react";
import InputField from "../components/InputField";
import LocationPicker from "../components/LocationPicker";
import SelectField from "../components/SelectField";
import { fetchDataForManagement } from "../../../../../../../api/api.handlers";
import { toast } from "react-toastify";
import { MdCameraAlt, MdFlag } from "react-icons/md";
import { t } from "i18next";

// CameraTraffic-specific fields
const CameraTrafficFields = ({ formData, handleInputChange }) => {
  const [crossroads, setCrossroads] = useState(null);
  const [selectedCrossroad, setSelectedCrossroad] = useState(null);

  const crossroadHandler = async () => {
    try {
      const data = await fetchDataForManagement("GET", "crossroad", {
        params: { limit: 0 }, // Optional: Fetch only active crossroads
      });
      console.log("Crossroads Data:", data.data);
      setCrossroads(data.data);
      const defaultCrossroad = formData.crossroad_id
        ? data.data.find((item) => item.id == formData.crossroad_id)
        : data.data[0];
      setSelectedCrossroad(defaultCrossroad);
    } catch (error) {
      console.error("Error fetching crossroads:", error);
      toast.error("Failed to fetch crossroads.");
      throw new Error(error);
    }
  };
  useEffect(() => {
    crossroadHandler();
  }, []);
  const handleCrossroadChange = (selected) => {
    console.log("Selected Crossroad:", selected);
    setSelectedCrossroad(selected);
    handleInputChange("crossroad_id", selected.id);
    handleInputChange("lat", selected.lat);
    handleInputChange("lng", selected.lng);
  };
  useEffect(() => {
    console.log(selectedCrossroad, "cross");
  }, [selectedCrossroad]);

  return (
    <>
      {[
        "name",
        "ip",
        "login",
        "password",
        "rtsp_port",
        "http_port",
        "https_port",
        "sdk_port",
      ].map((field) => (
        <InputField
          key={field}
          isrequired
          icon={MdCameraAlt}
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
          handleInputChange={(latlng) => {
            handleInputChange("lat", latlng.lat);
            handleInputChange("lng", latlng.lng);
          }}
        />
      )}
    </>
  );
};

export default CameraTrafficFields;
