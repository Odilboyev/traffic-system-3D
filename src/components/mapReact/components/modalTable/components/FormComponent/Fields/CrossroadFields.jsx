import { MdMode } from "react-icons/md";
import InputField from "../components/InputField";
import LocationPicker from "../components/LocationPicker";

// User-specific fields
const CrossroadFields = ({ formData, handleInputChange }) => (
  <>
    {/* Name Input */}
    <InputField
      icon={MdMode}
      label={"name"}
      value={formData.name || ""}
      onChange={(e) => handleInputChange("name", e.target.value)}
      required
    />
    <LocationPicker
      lat={formData.lat}
      lng={formData.lng}
      handleInputChange={handleInputChange}
    />
  </>
);
export default CrossroadFields;
