import { t } from "i18next";
import PropTypes from "prop-types";
import PasswordInput from "./PasswordInput";

// Reusable input field component
const InputField = ({
  icon: Icon,
  label,
  inputType,
  type,
  value,
  onChange,
  ...rest
}) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon className="text-gray-600 dark:text-gray-300" size={24} />}
      <label>{t(label)}</label>
    </div>
    {inputType && inputType == "password" ? (
      <PasswordInput label={t(label)} value={value} onChange={onChange} />
    ) : (
      <input
        {...rest}
        type={type ?? "text"}
        onChange={onChange}
        value={value}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
    )}
  </div>
);

InputField.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string,
  inputType: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InputField;
