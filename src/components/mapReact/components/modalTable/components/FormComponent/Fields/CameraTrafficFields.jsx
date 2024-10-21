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
  const [selectedCrossroad, setSelectedCrossroad] = useState(
    crossroads &&
      (formData.crossroad_id ? formData.crossroad_id : crossroads[0].id)
  );

  const crossroadHandler = async () => {
    try {
      const data = await fetchDataForManagement("GET", "crossroad", {
        params: { limit: 0 }, // Optional: Fetch only active crossroads
      });
      console.log("Crossroads Data:", data.data);
      setCrossroads(data.data);
      setSelectedCrossroad(data.data[0].id);
    } catch (error) {
      console.error("Error fetching crossroads:", error);
      toast.error("Failed to fetch crossroads.");
      throw new Error(error);
    }
  };
  useEffect(() => {
    crossroadHandler();
  }, []);

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
          icon={MdCameraAlt}
          label={t(field)}
          value={formData[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      ))}
      {crossroads && (
        <SelectField
          icon={MdFlag}
          label={t("crossroad")}
          options={crossroads}
          value={selectedCrossroad}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          onChange={(selected) => {
            console.log(selected);
            console.log(
              crossroads?.find((v) => v.id == selectedCrossroad)?.lat
            );
            setSelectedCrossroad(selected.id);
            handleInputChange("crossroad_id", selected.id);
            handleInputChange(
              "lat",
              crossroads?.find((v) => v.id == selected.id)?.lat
            );
            handleInputChange(
              "lng",
              crossroads?.find((v) => v.id == selected.id)?.lng
            );
          }}
        />
      )}
      {crossroads && selectedCrossroad && (
        <LocationPicker
          lat={
            formData.lat
              ? formData.lat
              : crossroads?.find((v) => v.id == selectedCrossroad)?.lat ||
                undefined
          }
          lng={
            formData.lng
              ? formData.lng
              : crossroads?.find((v) => v.id == selectedCrossroad)?.lng ||
                undefined
          }
          handleInputChange={(e) => {
            handleInputChange("lat", e.lat);
            handleInputChange("lng", e.lng);
          }}
        />
      )}
    </>
  );
};

export default CameraTrafficFields;
