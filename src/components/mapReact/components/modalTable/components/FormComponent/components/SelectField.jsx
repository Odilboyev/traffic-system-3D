import { t } from "i18next";
import CustomSelect from "../../../../../../customSelect";

const SelectField = ({
  icon: Icon,
  label,
  options,
  selected,
  onChange,
  ...rest
}) => (
  <div className="flex flex-col z-[99999]">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="text-gray-600 dark:text-gray-300" size={24} />
      <label>{t(label)}</label>
    </div>
    <CustomSelect
      label={label}
      options={options}
      value={selected}
      onChange={onChange}
      {...rest}
    />
  </div>
);
export default SelectField;
