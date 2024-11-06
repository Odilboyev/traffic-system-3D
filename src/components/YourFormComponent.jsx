import { useEffect, useState } from "react";
import { getDistricts, getRegions } from "../api/api.handlers";
import CustomSelect from "./CustomSelect";

function YourFormComponent() {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await getRegions();
        setRegions(
          data.map((region) => ({
            value: region.id,
            label: region.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchRegions();
  }, []);

  // Fetch districts when region is selected
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedRegion) {
        try {
          const data = await getDistricts(selectedRegion.value);
          setDistricts(
            data.map((district) => ({
              value: district.id,
              label: district.name,
            }))
          );
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      } else {
        setDistricts([]);
        setSelectedDistrict(null);
      }
    };
    fetchDistricts();
  }, [selectedRegion]);

  return (
    <div>
      <CustomSelect
        value={selectedRegion}
        onChange={(option) => {
          setSelectedRegion(option);
          setSelectedDistrict(null); // Reset district when region changes
        }}
        options={regions}
        placeholder="Select Region"
      />

      <CustomSelect
        value={selectedDistrict}
        onChange={setSelectedDistrict}
        options={districts}
        placeholder="Select District"
        isDisabled={!selectedRegion} // Disable district selection until region is selected
      />
    </div>
  );
}

export default YourFormComponent;
