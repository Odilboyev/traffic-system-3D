import { t } from "i18next";
import { useEffect, useState } from "react";
import { MdFlag, MdLocationOn, MdMode } from "react-icons/md";
import { PiRoadHorizon } from "react-icons/pi";
import {
  getDistricts,
  getRegions,
} from "../../../../../../../api/api.handlers";
import InputField from "../../../../../../../components/InputField";
import LocationPicker from "../../../../../../../components/LocationPicker";
import SelectField from "../../../../../../../components/SelectField";

const CrossroadFields = ({ formData, handleInputChange }) => {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const roadTypes = [
    { id: "road_type_1", name: t("road_type_1") },
    { id: "road_type_2", name: t("road_type_2") },
    { id: "road_type_3", name: t("road_type_3") },
    { id: "road_type_4", name: t("road_type_4") },
  ];

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
      if (selectedRegion || formData.region_id) {
        try {
          const data = await getDistricts(
            selectedRegion?.id || formData.region_id
          );
          setDistricts(data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [selectedRegion, formData.region_id]);

  const handleRegionChange = (selected) => {
    setSelectedRegion(selected);
    setSelectedDistrict(null);
    handleInputChange("region_id", selected.id);
    handleInputChange("district_id", null);
  };

  const handleDistrictChange = (selected) => {
    setSelectedDistrict(selected);
    handleInputChange("district_id", selected.id);
  };

  return (
    <div className="flex gap-4 h-full min-h-[50vh]">
      <div className="flex flex-col gap-8 ">
        <InputField
          icon={MdMode}
          label={"name"}
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
        />

        <SelectField
          icon={MdFlag}
          label={t("region")}
          options={regions}
          value={regions.find((region) => region.id === formData.region_id)}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          onChange={handleRegionChange}
          required
          zIndex={6500}
        />
        <SelectField
          icon={MdFlag}
          label={t("district")}
          options={districts}
          value={districts.find(
            (district) => district.id === formData.district_id
          )}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          onChange={handleDistrictChange}
          required
          zIndex={6400}
        />
        <SelectField
          icon={PiRoadHorizon}
          label={t("road_type")}
          options={roadTypes}
          value={roadTypes.find((type) => type.id === formData.road_type)}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          onChange={(selected) => handleInputChange("road_type", selected.id)}
          required
          zIndex={6300}
        />
        <div className="flex gap-4">
          <InputField
            icon={MdLocationOn}
            type="number"
            label="Latitude"
            value={formData.lat || ""}
            onChange={(e) =>
              handleInputChange("lat", parseFloat(e.target.value))
            }
            required
          />
          <InputField
            icon={MdLocationOn}
            type="number"
            label="Longitude"
            value={formData.lng || ""}
            onChange={(e) =>
              handleInputChange("lng", parseFloat(e.target.value))
            }
            required
          />
        </div>
      </div>
      <div className="flex-grow">
        <LocationPicker
          lat={formData.lat}
          lng={formData.lng}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default CrossroadFields;
