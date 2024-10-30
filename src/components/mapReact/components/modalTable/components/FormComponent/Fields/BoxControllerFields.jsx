import { useEffect, useState } from "react";
import InputField from "../components/InputField";
import LocationPicker from "../components/LocationPicker";
import SelectField from "../components/SelectField";
import { fetchDataForManagement } from "../../../../../../../api/api.handlers";
import { toast } from "react-toastify";
import {
  MdAllInbox,
  MdFlag,
  MdOutlineAllInbox,
  MdSensors,
} from "react-icons/md";
import { t } from "i18next";
import { crossroadHandler, fetchSingleBox } from "../utils";

// BoxMonitorFields-specific fields
const BoxMonitorFields = ({ formData, handleInputChange }) => {
  const [crossroads, setCrossroads] = useState(null);
  const [selectedCrossroad, setSelectedCrossroad] = useState(null);
  const [sensors, setSensors] = useState(null);
  const [selectedSensors, setSelectedSensors] = useState([]);

  useEffect(() => {
    crossroadHandler(
      formData,
      setCrossroads,
      setSelectedCrossroad,
      handleInputChange
    );
    fetchSingleBox(
      formData?.id,
      setSensors,
      setSelectedSensors,
      handleInputChange
    );
  }, []);

  const handleCrossroadChange = (selected) => {
    setSelectedCrossroad(selected);
    handleInputChange("crossroad_id", selected.id);
    handleInputChange("lat", selected.lat);
    handleInputChange("lng", selected.lng);
  };
  const handleSensorChange = (selected) => {
    setSelectedSensors(selected);

    // Update sensor status: 1 for selected, 0 for not selected
    const updatedSensors = sensors.map((sensor) => ({
      ...sensor,
      status: selected.some((s) => s.sensor_id === sensor.sensor_id) ? 1 : 0,
    }));

    // Update form data with the modified sensors
    handleInputChange("sensors", updatedSensors);
  };
  return (
    <>
      {["name", "sn", "ip"].map((field) => (
        <InputField
          key={field}
          required
          icon={MdOutlineAllInbox}
          label={t(field)}
          value={formData[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      ))}
      {sensors && (
        <SelectField
          isMulti
          icon={MdSensors}
          label={t("sensors")}
          options={sensors}
          value={selectedSensors}
          getOptionLabel={(option) => option.name || ""}
          getOptionValue={(option) => option.sensor_id.toString()}
          onChange={handleSensorChange}
          zIndex="99999999"
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
        <LocationPicker
          lat={formData.lat || selectedCrossroad.lat}
          lng={formData.lng || selectedCrossroad.lng}
          handleInputChange={handleInputChange}
        />
      )}
    </>
  );
};

export default BoxMonitorFields;
