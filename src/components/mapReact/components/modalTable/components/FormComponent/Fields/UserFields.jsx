import { MdEmail, MdPerson, MdWork } from "react-icons/md";
import PasswordInput from "../../../../../../PasswordInput";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";

// User-specific fields
const UserFields = ({ formData, handleInputChange, options }) => (
  <>
    {/* Name Input */}
    <InputField
      icon={MdPerson}
      label={"name"}
      value={formData.name || ""}
      onChange={(e) => handleInputChange("name", e.target.value)}
      required
    />
    <InputField
      icon={MdEmail}
      label={t("email")}
      value={formData.email || ""}
      onChange={(e) => handleInputChange("email", e.target.value)}
    />
    <SelectField
      icon={MdWork}
      label={t("role")}
      options={options}
      value={options.find((option) => option.name === formData.role)}
      onChange={(selected) => handleInputChange("role", selected.name)}
    />
    <PasswordInput
      label={t("password")}
      value={formData.password || ""}
      onChange={(e) => handleInputChange("password", e.target.value)}
    />
  </>
);
export default UserFields;
