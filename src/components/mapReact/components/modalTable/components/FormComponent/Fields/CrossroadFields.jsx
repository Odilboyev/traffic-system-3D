import { MdMode } from "react-icons/md";
import InputField from "../components/InputField";
import LocationPicker from "../components/LocationPicker";

const CrossroadFields = ({ formData, handleInputChange }) => (
  <div className="flex flex-col gap-4 h-full ">
    <div>
      <InputField
        icon={MdMode}
        label={"name"}
        value={formData.name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
        required
      />
    </div>
    <div className="flex-grow h-[55vh]">
      <LocationPicker
        lat={formData.lat}
        lng={formData.lng}
        handleInputChange={handleInputChange}
      />
    </div>
  </div>
);

export default CrossroadFields;
