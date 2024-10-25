import { useState } from "react";
import { Button, IconButton, Input } from "@material-tailwind/react";
import {
  EyeDropperIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { t } from "i18next";
const PasswordInput = ({ value, onChange, ...rest }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="relative flex w-full">
      <input
        {...rest}
        type={isPasswordVisible ? "text" : "password"}
        onChange={onChange}
        placeholder={t("password")}
        value={value}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />

      <IconButton
        variant="text"
        color="gray"
        onClick={togglePasswordVisibility}
        className="!absolute right-0 rounded dark:text-white"
      >
        {isPasswordVisible ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </IconButton>
    </div>
  );
};

export default PasswordInput;
