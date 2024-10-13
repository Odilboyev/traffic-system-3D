// TableRow.js
import { Typography, IconButton } from "@material-tailwind/react";
import { MdEdit, MdDelete, MdHistory } from "react-icons/md";
import { LiaSearchLocationSolid } from "react-icons/lia";
import moment from "moment/moment";
import StatusBadge from "../../../../statusBadge";

const TableRow = ({
  title,
  item,
  columns,
  showActions,
  isSubPageOpen,
  locationHandler,
  historyHandler,
  encryptedRole,
}) => {
  return (
    <tr className="dark:text-white text-black hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
      {columns.map((key, index) => (
        <td
          key={index}
          className="px-4 py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white"
        >
          {key === "statuserror" ? (
            <StatusBadge
              style={{ margin: "0.25rem 0 " }}
              status={item[key]}
              statusName={item.statuserror_name && item.statuserror_name}
            />
          ) : (
            <Typography>
              {key === "duration"
                ? moment.utc(item[key] * 1000).format("HH:mm:ss")
                : item[key]}
            </Typography>
          )}
        </td>
      ))}

      {showActions && !isSubPageOpen && (
        <td className="p-2 flex gap-2 justify-start">
          {title != "users" && (
            <>
              {" "}
              <IconButton
                color="amber"
                size="sm"
                onClick={() => historyHandler(item)}
              >
                <MdHistory className="text-white" />
              </IconButton>
              <IconButton
                color="green"
                size="sm"
                onClick={() => locationHandler(item.lat, item.lng)}
              >
                <LiaSearchLocationSolid className="text-white" />
              </IconButton>
            </>
          )}

          {encryptedRole === "admin" && (
            <>
              <IconButton color="blue" size="sm">
                <MdEdit className="text-white" />
              </IconButton>
              <IconButton color="red" size="sm">
                <MdDelete className="text-white" />
              </IconButton>
            </>
          )}
        </td>
      )}
    </tr>
  );
};

export default TableRow;
