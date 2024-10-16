import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { MdPerson, MdEmail, MdLock, MdWork } from "react-icons/md";
import PasswordInput from "../../../../PasswordInput";
import Select from "react-select";
import { t } from "i18next";
import { useTheme } from "../../../../../customHooks/useTheme";
import CustomSelect from "../../../../customSelect";

const FormComponent = ({ options, onSubmit, onCancel }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-6 p-8 w-full my-20 max-w-lg mx-auto bg-white rounded-xl shadow-2xl dark:text-white dark:bg-gray-800"
    >
      <div className="flex flex-col gap-6">
        {/* Name Input */}
        <div className="flex items-center gap-2">
          <MdPerson className=" text-gray-600 dark:text-gray-300" size={24} />
          <Input
            label={t("name")}
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full dark:text-white"
            required
            color={theme === "light" ? "blue" : "white"}
          />
        </div>

        {/* Email Input */}
        <div className="flex items-center gap-2">
          <MdEmail className=" text-gray-600 dark:text-gray-300" size={24} />
          <Input
            label={t("email")}
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full dark:text-white"
            required
            color={theme === "light" ? "blue" : "white"}
            type="email"
          />
        </div>

        {/* Role Select */}
        <div className="flex items-center gap-2">
          <MdWork className=" text-gray-600 dark:text-gray-300" size={24} />
          <CustomSelect
            label={t("role")}
            isSearchable={false}
            options={options}
            value={options.find((option) => option.name === formData.role)}
            onChange={(selectedOption) =>
              setFormData({ ...formData, role: selectedOption.name })
            }
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.name}
            placeholder="Select Role"
            className="w-full"
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center gap-2">
          <MdLock className=" text-gray-600 dark:text-gray-300" size={24} />
          <PasswordInput
            label={t("password")}
            type="password"
            value={formData.password || ""}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full dark:text-white"
            required
            color={theme === "light" ? "blue" : "white"}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            color="red"
            onClick={onCancel}
            className="font-semibold hover:bg-red-600 transition-all duration-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="green"
            className="font-semibold hover:bg-green-600 transition-all duration-300"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormComponent;
