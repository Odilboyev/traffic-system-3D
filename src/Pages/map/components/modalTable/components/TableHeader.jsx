// TableHeader.js
import CustomSelect from "@/components/customSelect";
import { Typography } from "@material-tailwind/react";
import { t } from "i18next";
import { filterableColumns, getUniqueColumnValues } from "../utils";

const TableHeader = ({
  columns,
  data,
  sortedColumn,
  isSubPageOpen,
  showActions,
  sortOrder,
  onHeaderClick,
  onFilterChange,
}) => {
  // Columns that should have filter dropdowns

  const renderHeaderContent = (key) => {
    const isFilterable = filterableColumns.includes(key);
    if (isFilterable) {
      const options = getUniqueColumnValues(data, key);
      return (
        <div className="flex flex-col gap-2">
          {/* <Typography className="font-bold">{t(key)}</Typography> */}
          <CustomSelect
            options={options}
            onChange={(selected) => onFilterChange(key, selected?.value)}
            placeholder={`${t(key.replace("_name", ""))} ${t("select")}`}
            className="min-w-[150px]"
            onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking select
          />
        </div>
      );
    }

    return (
      <div className="flex justify-between gap-4 items-center">
        <Typography className="font-bold">{t(key)}</Typography>
        {sortedColumn === key && <span>{sortOrder === "asc" ? "▲" : "▼"}</span>}
      </div>
    );
  };

  return (
    <thead className="text-left">
      <tr className="font-bold">
        {columns.map((key, i) => (
          <th
            className="px-3 py-1 text-start border-separate border border-blue-gray-900 dark:border-white dark:text-blue-gray-400 cursor-pointer"
            key={i}
            style={{
              minWidth:
                filterableColumns.includes(key) || key === "name"
                  ? "15vw"
                  : "auto",
              width:
                filterableColumns.includes(key) || key === "name"
                  ? "15vw"
                  : "auto",
            }}
            onClick={() => onHeaderClick(key)}
          >
            {renderHeaderContent(key)}
          </th>
        ))}
        {showActions && (
          <th className="py-1 text-start border-separate border border-blue-gray-900 dark:border-white">
            <Typography className="font-bold">{t("actions")}</Typography>
          </th>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;
