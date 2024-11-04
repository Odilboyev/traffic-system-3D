import { MdMode } from "react-icons/md";
import InputField from "../../../../../../../components/InputField";
import LocationPicker from "../../../../../../../components/LocationPicker";

const CrossroadFields = ({ formData, handleInputChange }) => (
  <div className="flex flex-col gap-4 h-full ">
    <div className="">
      <InputField
        icon={MdMode}
        label={"name"}
        value={formData.name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
        required
      />
    </div>
    <div className="flex gap-4">
      <InputField
        type="number"
        label="Latitude"
        value={formData.lat || ""}
        onChange={(e) => handleInputChange("lat", parseFloat(e.target.value))}
        required
      />
      <InputField
        type="number"
        label="Longitude"
        value={formData.lng || ""}
        onChange={(e) => handleInputChange("lng", parseFloat(e.target.value))}
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
