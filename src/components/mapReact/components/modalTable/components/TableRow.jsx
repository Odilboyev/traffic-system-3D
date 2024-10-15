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

const TableRow = ({
  title,
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
  const [options, setOptions] = useState(tableSelectOptions);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [editedData, setEditedData] = useState({ ...item, password: "" }); // Track current input changes
  useEffect(() => {
    setOptions(
      tableSelectOptions.map((item) => ({ name: item.name, value: item.name }))
    );
    console.log(
      tableSelectOptions.map((item) => ({ name: item.name, value: item.name }))
    );
    console.log("tableSelectOptions:", tableSelectOptions);
    console.log("options:", options);
    console.log("editedData.role:", editedData.role);
  }, [tableSelectOptions]);

  // Function to handle input change
  const handleInputChange = (key, value) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value,
      id: item.id, // Ensure the id remains intact during updates
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    editButtonCallback(editedData); // Callback with updated data when save is clicked
  };

  return (
    <tr className="dark:text-white text-black hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
      {columns.map((key, index) => (
        <td
          key={`${item.id}-${index}`} // Use a unique key for each row and column
          className="px-4 py-1 text-start overflow-x-scroll no-scrollbar border-separate border border-blue-gray-900 dark:border-white"
        >
          {key === "statuserror" ? (
            <StatusBadge
              style={{ margin: "0.25rem 0 " }}
              status={item[key]}
              statusName={item.statuserror_name && item.statuserror_name}
            />
          ) : key === "role" ? (
            isEditing && options.length > 0 ? (
              <Select
                contentEditable={false}
                options={options} // Pass the options array
                value={tableSelectOptions.find(
                  (option) => option.name === editedData.role
                )} // Bind the current value to the selected role
                onChange={(selectedOption) =>
                  handleInputChange("role", selectedOption.value)
                } // Handle the change event, use name as the value
                getOptionLabel={(option) => option.name} // Display the name as the label
                getOptionValue={(option) => option.value} // Use name as the value
                placeholder="Select Role" // Add placeholder text
              />
            ) : (
              <Typography>{item[key]}</Typography>
            )
          ) : key === "date_create" ? (
            isEditing ? (
              // If in editing mode, change 'date_create' to a password field
              <Input
                type="password"
                placeholder="Enter new password"
                value={editedData["password"] || ""}
                onChange={(e) => handleInputChange("password", e.target.value)} // Use password field
                className="w-full dark:!text-white"
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
          className="p-2 flex gap-2 justify-start"
          style={{ width: "160px", minWidth: "160px" }}
        >
          {title != "users" && selectedFilter != "list_deactive" && (
            <>
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

          {encryptedRole === "admin" && selectedFilter != "list_deactive" && (
            <>
              {!isEditing ? (
                <IconButton
                  color="blue"
                  size="sm"
                  onClick={() => setIsEditing(true)} // Enter edit mode
                >
                  <MdEdit className="text-white" />
                </IconButton>
              ) : (
                <>
                  <IconButton
                    color="green"
                    size="sm"
                    onClick={handleSave} // Save changes
                  >
                    <MdSave className="text-white" />
                  </IconButton>
                  <IconButton
                    color="red"
                    size="sm"
                    onClick={() => setIsEditing(false)} // Cancel editing
                  >
                    <MdCancel className="text-white" />
                  </IconButton>
                </>
              )}
              <IconButton
                color="red"
                size="sm"
                onClick={() => deleteButtonCallback(item)}
              >
                <MdDelete className="text-white" />
              </IconButton>
            </>
          )}
          {activateButtonCallback && selectedFilter == "list_deactive" && (
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
