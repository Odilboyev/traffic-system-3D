import { useEffect, useState } from "react";
import { Typography, IconButton, Input } from "@material-tailwind/react";
import {
  MdEdit,
  MdDelete,
  MdHistory,
  MdPowerSettingsNew,
  MdSave,
  MdCancel,
} from "react-icons/md";
import { LiaSearchLocationSolid } from "react-icons/lia";
import moment from "moment/moment";
import StatusBadge from "../../../../statusBadge";
import Select from "react-select";
import CustomSelect from "../../../../customSelect";

const TableRow = ({
  type,
  item,
  selectedFilter,
  columns,
  showActions,
  isSubPageOpen,
  locationHandler,
  historyHandler,
  encryptedRole,
  editButtonCallback,
  deleteButtonCallback,
  activateButtonCallback,
  tableSelectOptions,
}) => {
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [editedData, setEditedData] = useState({ ...item, password: "" }); // Track current input changes

  // Function to handle input change
  const handleInputChange = (key, value) => {
    console.log(key, value);
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
    <tr className="dark:text-white !overflow-visible text-black hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
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

      {showActions && !isSubPageOpen && (
        <td
          className={`px-4 gap-1 !overflow-visible py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white`}
          style={{ width: "180px", minWidth: "180px" }}
        >
          {type != "users" && selectedFilter != "list_deactive" && (
            <>
              {type != "crossroad" && (
                <IconButton
                  className="mr-1"
                  color="amber"
                  size="sm"
                  onClick={() => historyHandler(item)}
                >
                  <MdHistory className="text-white" />
                </IconButton>
              )}
              <IconButton
                className="mr-1"
                color="green"
                size="sm"
                onClick={() => locationHandler(item.lat, item.lng)}
              >
                <LiaSearchLocationSolid className="text-white" />
              </IconButton>
            </>
          )}

          {encryptedRole === "admin" && selectedFilter != 1 && (
            <>
              {!isEditing ? (
                <IconButton
                  className="mr-1"
                  color="blue"
                  size="sm"
                  onClick={() => editButtonCallback(item)} // Enter edit mode
                >
                  <MdEdit className="text-white" />
                </IconButton>
              ) : (
                <>
                  <IconButton
                    className="mr-1"
                    color="green"
                    size="sm"
                    onClick={handleSave} // Save changes
                  >
                    <MdSave className="text-white" />
                  </IconButton>
                  <IconButton
                    className="mr-1"
                    color="red"
                    size="sm"
                    onClick={
                      () => {
                        setIsEditing(false);
                        setEditedData({ ...item, password: "" });
                      } // Cancel editing
                    }
                  >
                    <MdCancel className="text-white" />
                  </IconButton>
                </>
              )}
              <IconButton
                className="mr-1"
                color="red"
                size="sm"
                onClick={() => deleteButtonCallback(item)}
              >
                <MdDelete className="text-white" />
              </IconButton>
            </>
          )}
          {activateButtonCallback && selectedFilter == 1 && (
            <IconButton
              color="green"
              size="sm"
              onClick={() => activateButtonCallback(item)}
            >
              <MdPowerSettingsNew className="text-white" />
            </IconButton>
          )}
        </td>
      )}
    </tr>
  );
};

export default TableRow;
