import { IconButton, Input, Typography } from "@material-tailwind/react";
import moment from "moment/moment";
import { useState } from "react";
import {
  MdDelete,
  MdEdit,
  MdHistory,
  MdPowerSettingsNew,
  MdSearch,
} from "react-icons/md";
import CustomSelect from "../../../../../components/customSelect";
import StatusBadge from "../../../../../components/statusBadge";

const TableRow = ({
  type,
  item,
  selectedFilter,
  columns,
  showActions,
  isSubPageOpen,
  locationHandler,
  historyHandler,
  role,
  editButtonCallback,
  deleteButtonCallback,
  activateButtonCallback,
  tableSelectOptions,
}) => {
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [editedData, setEditedData] = useState({ ...item, password: "" }); // Track current input changes

  // Function to handle input change
  const handleInputChange = (key, value) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value,
      id: item.id, // Ensure the id remains intact during updates
    }));
  };

  // const handleSave = () => {
  //   setIsEditing(false);
  //   try {
  //     editButtonCallback(editedData); // Callback with updated data when save is clicked
  //   } catch (error) {
  //     setEditedData({ ...item, password: "" });
  //   }
  // };

  return (
    <tr className="dark:text-white  !overflow-visible text-black hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
      {columns.map((key, index) => (
        <td
          key={`${item.id}-${index}`} // Use a unique key for each row and column
          className="px-4  !overflow-visible py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white"
        >
          {key === "statuserror" ? (
            <StatusBadge
              style={{ margin: "0.25rem 0 " }}
              status={item[key]}
              statusName={item.statuserror_name && item.statuserror_name}
            />
          ) : key === "role" ? (
            isEditing && tableSelectOptions.length > 0 ? (
              <CustomSelect
                isSearchable={false}
                options={tableSelectOptions} // Pass the options array
                value={tableSelectOptions.find(
                  (option) => option.value || option.name === editedData.role
                )} // Bind the current value to the selected role
                onChange={(selectedOption) =>
                  handleInputChange("role", selectedOption.name)
                } // Handle the change event, use name as the value
                getOptionLabel={(option) => option.name} // Display the name as the label
                getOptionValue={(option) => option.name} // Use name as the value
                placeholder="Select Role" // Add placeholder text
                styles={{}}
              />
            ) : (
              <Typography>{item[key]}</Typography>
            )
          ) : key === "date_create" ? (
            isEditing ? (
              // If in editing mode, change 'date_create' to a password field
              <Input
                type="password"
                label="password"
                placeholder="Enter new password"
                value={editedData["password"] || ""}
                onChange={(e) => handleInputChange("password", e.target.value)} // Use password field
                className="w-full dark:!text-white placeholder:text-gray-700"
              />
            ) : (
              <Typography>{item[key]}</Typography>
            )
          ) : key !== "id" ? (
            isEditing ? (
              <Input
                type="text"
                value={editedData[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full dark:!text-white"
              />
            ) : (
              <p>
                {key === "duration"
                  ? moment.utc(item[key] * 1000).format("HH:mm:ss")
                  : item[key]}
              </p>
            )
          ) : (
            <p>{item[key]}</p> // Render ID as a non-editable field
          )}
        </td>
      ))}

      {showActions && !isSubPageOpen && type !== "currentAlarms" && (
        <td
          className={` !overflow-visible py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white`}
          // style={{ width: "200px", minWidth: "200px" }}
        >
          <div className="flex items-center justify-start h-full gap-2 w-full">
            {" "}
            {type != "users" && selectedFilter != 0 && (
              <>
                {type != "crossroad" && (
                  <IconButton
                    size="sm"
                    className="mr-1"
                    color="amber"
                    onClick={() => historyHandler(item)}
                  >
                    <MdHistory className="text-white text-xl" />
                  </IconButton>
                )}
                <IconButton
                  size="sm"
                  className="mr-1"
                  color="green"
                  onClick={() => locationHandler(item.lat, item.lng)}
                >
                  <MdSearch className="text-white text-xl" />
                </IconButton>
              </>
            )}
            {selectedFilter != 0 && (
              <>
                <IconButton
                  size="sm"
                  className="mr-1"
                  color="blue"
                  //
                  onClick={() => editButtonCallback(item)} // Enter edit mode
                >
                  <MdEdit className="text-white text-xl" />
                </IconButton>

                <IconButton
                  size="sm"
                  className="mr-1"
                  color="red"
                  onClick={() => deleteButtonCallback(item)}
                >
                  <MdDelete className="text-white text-xl" />
                </IconButton>
              </>
            )}
            {activateButtonCallback && selectedFilter == 0 && (
              <IconButton
                size="sm"
                color="green"
                onClick={() => activateButtonCallback(item)}
              >
                <MdPowerSettingsNew className="text-white text-xl" />
              </IconButton>
            )}
          </div>{" "}
        </td>
      )}
    </tr>
  );
};

export default TableRow;
