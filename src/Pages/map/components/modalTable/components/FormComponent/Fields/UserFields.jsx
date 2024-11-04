import { t } from "i18next";
import { useEffect, useState } from "react";
import { MdEmail, MdPassword, MdPerson, MdWork } from "react-icons/md";
import { getUserRoles } from "../../../../../../../api/api.handlers";
import InputField from "../../../../../../../components/InputField";
import SelectField from "../../../../../../../components/SelectField";

// User-specific fields
const UserFields = ({ formData, handleInputChange }) => {
  const [userRoles, setUserRoles] = useState([]);
  const fetchUserRoles = async () => {
    try {
      const roles = await getUserRoles();
      setUserRoles(roles.data);
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    fetchUserRoles();
  }, []);
  return (
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
        label={"email"}
        value={formData.email || ""}
        onChange={(e) => handleInputChange("email", e.target.value)}
      />
      <SelectField
        icon={MdWork}
        label={"role"}
        options={userRoles}
        getOptionValue={(option) => option.name}
        getOptionLabel={(option) => option.name}
        value={userRoles.find((option) => option.name === formData.role)}
        onChange={(selected) => handleInputChange("role", selected.name)}
      />
      <InputField
        icon={MdPassword}
        inputType="password"
        label={t("password")}
        value={formData.password || ""}
        onChange={(e) => handleInputChange("password", e.target.value)}
      />
    </>
  );
};
export default UserFields;
