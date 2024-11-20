import { MdFlag, MdOutlineCategory } from "react-icons/md";
import { crossroadHandler, modelHandler } from "../utils";
import { useEffect, useState } from "react";

import InputField from "../../../../../../../components/InputField";
import LocationPicker from "../../../../../../../components/LocationPicker";
import SelectField from "../../../../../../../components/SelectField";
import { TbDeviceCctv } from "react-icons/tb";
import { getOverviewCameraModels } from "../../../../../../../api/api.handlers";
import { t } from "i18next";

// CameraView-specific fields
const CameraViewFields = ({ formData, handleInputChange }) => {
  const [crossroads, setCrossroads] = useState(null);
  const [selectedCrossroad, setSelectedCrossroad] = useState(null);
  const [models, setModels] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  useEffect(() => {
    crossroadHandler(
      formData,
      setCrossroads,
      setSelectedCrossroad,
      handleInputChange
    );
  }, []);
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getOverviewCameraModels();
        setModels(data.data);
        modelHandler(formData, data.data, setSelectedModel, handleInputChange);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchModels();
  }, []);

  const handleCrossroadChange = (selected) => {
    setSelectedCrossroad(selected);
    handleInputChange("crossroad_id", selected.id);
    handleInputChange("lat", selected.lat);
    handleInputChange("lng", selected.lng);
  };

  const handleModelChange = (selected) => {
    setSelectedModel(selected);
    handleInputChange("camera_view_model_id", selected.id);
  };

  return (
    <div className="flex gap-10 h-full">
      <div className="flex flex-col gap-3 w-1/3">
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
            required
            icon={TbDeviceCctv}
            label={t(field)}
            value={formData[field] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 w-2/3">
        {models != null && selectedModel != null && (
          <SelectField
            icon={MdOutlineCategory}
            label={t("model")}
            options={models}
            // menuPlacement={"top"}
            value={models.find((item) => item.id == selectedModel?.id)}
            getOptionLabel={(option) => option.name || ""}
            getOptionValue={(option) => option.id}
            onChange={handleModelChange}
            zIndex={5600}
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

export default CameraViewFields;
