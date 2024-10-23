// TableHeader.js
import { Typography } from "@material-tailwind/react";
import { t } from "i18next";

const TableHeader = ({
  columns,
  sortedColumn,
  isSubPageOpen,
  showActions,
  sortOrder,
  onHeaderClick,
}) => {
  return (
    <thead className="text-left">
      <tr className="font-bold">
        {columns.map((key, i) => (
          <th
            className="px-3 py-1 text-start border-separate border border-blue-gray-900 dark:border-white dark:text-blue-gray-400 cursor-pointer"
            key={i}
            onClick={() => onHeaderClick(key)}
          >
            <div className="flex justify-between gap-4 items-center">
              <Typography className="font-bold">{t(key)}</Typography>
              {sortedColumn === key && (
                <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
              )}
            </div>
          </th>
        ))}
        {showActions && (
          <th
            className=" py-1 text-start border-separate border border-blue-gray-900 dark:border-white"
            // style={{ width: "250px", minWidth: "250px" }}
          >
            <Typography className="font-bold">{t("actions")}</Typography>
          </th>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;
