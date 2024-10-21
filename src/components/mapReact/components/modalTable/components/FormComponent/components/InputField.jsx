import { t } from "i18next";

// Reusable input field component
const InputField = ({ icon: Icon, label, value, onChange, ...rest }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="text-gray-600 dark:text-gray-300" size={24} />
      <label>{t(label)}</label>
    </div>{" "}
    <input
      {...rest}
      onChange={onChange}
      value={value}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required
    />
  </div>
);
export default InputField;
