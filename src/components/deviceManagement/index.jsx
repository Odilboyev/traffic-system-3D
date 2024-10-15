import {
  IconButton,
  List,
  ListItem,
  Typography,
} from "@material-tailwind/react";
import { CogIcon, PlusCircleIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useState, useCallback, memo, useEffect } from "react";
import { t } from "i18next";
import Dropright from "../dropright";
import ModalTable from "../mapReact/components/modalTable";
import {
  addUser,
  deleteUser,
  getDevices,
  getErrorHistory,
  getUserRoles,
  recoverUser,
  updateUser,
} from "../../api/api.handlers";
import { toast, ToastContainer } from "react-toastify";

const DeviceManagement = () => {
  const [isDroprightOpen, setIsDroprightOpen] = useState(false);
  const [deviceType, setDeviceType] = useState(""); // Default type
  const [isAlarmDeviceOpen, setIsAlarmDeviceOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [deviceData, setDeviceData] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceTotalPages, setDeviceTotalPages] = useState(null);
  // users
  const [userFilter, setUserFilter] = useState("list_active");
  const [userRoles, setUserRoles] = useState([]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  const fetchDeviceData = useCallback(async (type, current = 1) => {
    setDeviceLoading(true);
    setDeviceData([]); // Clear existing data before fetching new data
    try {
      const all = await getDevices(type, current);
      setDeviceData(all.data);
      setDeviceTotalPages(all.total_pages ? all.total_pages : 1);
      setTotalItems(all.total_items);
    } catch (err) {
      throw new Error(err);
    } finally {
      setDeviceLoading(false);
    }
  }, []);

  const fetchUserRoles = async () => {
    try {
      const roles = await getUserRoles();
      setUserRoles(roles.data);
      console.log(roles.data);
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    fetchUserRoles();
  }, []);
  const createNewUser = (bool) => {
    setShowNewUserModal(bool); // Show the form modal when the button is clicked
  };

  const handleAddUserSubmit = async (newUserData) => {
    console.log(newUserData);
    try {
      await addUser(newUserData); // You will need an API call to add a new user
      toast.success(`User ${newUserData.name} created successfully!`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      setShowNewUserModal(false); // Close the modal after successful creation
      fetchDeviceData("user/list_active"); // Refresh the user list
    } catch (error) {
      toast.error("Failed to create user. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleUserUpdate = async (updatedUserData) => {
    try {
      await updateUser(updatedUserData);
      toast.success(`User ${updatedUserData.name} updated successfully!`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      // Fetch the updated data to reflect changes in the table
      await fetchDeviceData("user/list_active");
    } catch (error) {
      toast.error("Failed to update user. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      throw new Error(error);
    }
  };

  const handleUserStatus = async (user, actionType) => {
    const confirmationMessage =
      actionType === "deactivate"
        ? `Are you sure you want to deactivate ${user.name}?`
        : `Are you sure you want to activate ${user.name}?`;

    if (!window.confirm(confirmationMessage)) {
      return; // Exit the function if the user cancels
    }
    try {
      if (actionType === "deactivate") {
        await deleteUser(user.id);
        toast.success(`User ${": " + user.name} successfully deactivated!`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else if (actionType === "activate") {
        console.log(user.id, "deactivated");
        await recoverUser(user.id); // Assuming you have an activateUser function
        toast.success(`User ${": " + user.name} successfully activated!`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      // Show error toast in case of failure
      toast.error(`Failed to ${actionType} user. Please try again.`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      throw new Error(error);
    } finally {
      console.log(userFilter);
      await fetchDeviceData("user/" + userFilter); // Fetch active users by default after the operation
    }
  };

  // fetchErrorHistory
  const fetchErrorHistory = async (current, type, id = null) => {
    const dtype = type === "camera" ? 1 : type == "boxcontroller" ? 3 : 4;
    setDeviceLoading(true);
    try {
      const all = await getErrorHistory(current, {
        type: dtype,
        device_id: id,
      });

      setDeviceData(all.data);
      setDeviceTotalPages(all.total_pages ? all.total_pages : 1);
      setTotalItems(all.total_items);
    } catch (err) {
      console.err("Error fetching error history. Please try again.", err);
    } finally {
      setDeviceLoading(false);
    }
  };

  // Handler for changing the device type
  const handleTypeChange = (type) => {
    setDeviceType(type); // Update device type
    setIsDroprightOpen(false); // Close the dropdown
    setIsAlarmDeviceOpen(true); // Open the device modal

    if (type === "users") {
      fetchDeviceData("user/list_active"); // Fetch active users by default
    } else {
      fetchDeviceData(type); // Fetch data for the selected type
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setIsDroprightOpen(!isDroprightOpen)}
        size="lg"
      >
        <CogIcon className="w-6 h-6 " />
      </IconButton>

      <Dropright
        wrapperClass="relative inline-block text-left"
        sndWrapperClass="ml-3 -top-8 absolute rounded-md bg-gray-900/70 !text-white backdrop-blur-md"
        isOpen={isDroprightOpen}
        setIsOpen={setIsDroprightOpen}
        content={
          <div className="p-4 rounded-lg flex flex-col justify-center items-center">
            <Typography>{t("management_device")}</Typography>
            <List className="text-white">
              <ListItem
                className="shadow-sm"
                onClick={() => handleTypeChange("crossroad")}
              >
                {t("crossroad")}
              </ListItem>
              <ListItem
                className="shadow-sm"
                onClick={() => handleTypeChange("camera")}
              >
                {t("camera")}
              </ListItem>
              <ListItem
                className="shadow-sm"
                onClick={() => handleTypeChange("boxcontroller")}
              >
                {t("boxcontroller")}
              </ListItem>
              <ListItem
                className="shadow-sm"
                onClick={() => handleTypeChange("svetofor")}
              >
                {t("svetofor")}
              </ListItem>
              <ListItem
                className="shadow-sm"
                onClick={() => handleTypeChange("users")}
              >
                {t("users")}
              </ListItem>
            </List>
          </div>
        }
      />
      <ModalTable
        open={isAlarmDeviceOpen}
        handleOpen={() => {
          setDeviceTotalPages(null);
          setDeviceData([]);
          setIsAlarmDeviceOpen(false); // Correctly close the device modal
        }}
        totalItems={totalItems}
        itemCallback={deviceType !== "users" ? fetchErrorHistory : null}
        title={deviceType}
        data={deviceData}
        pickedFilter={deviceType == "users" ? userFilter : null}
        changePickFilter={setUserFilter}
        backButtonProps={
          deviceType === "users"
            ? {
                label: "create_new_user",
                onClick: (val) => createNewUser(val),
                icon: <PlusIcon className="w-5 h-5 m-0" />,
              }
            : undefined
        }
        typeOptions={
          deviceType === "users"
            ? [
                { type: "list_active", type_name: t("active_users") },
                { type: "list_deactive", type_name: t("inactive_users") },
              ]
            : undefined
        }
        showActions={true}
        isLoading={deviceLoading}
        selectedFilter={userFilter}
        fetchHandler={(type, page) =>
          fetchDeviceData(
            type,
            page,
            userFilter === "user/list_active"
              ? "/list_active"
              : "/list_deactive"
          )
        }
        deleteButtonCallback={(user) => handleUserStatus(user, "deactivate")}
        activateButtonCallback={(user) => handleUserStatus(user, "activate")}
        tableSelectOptions={userRoles}
        editButtonCallback={handleUserUpdate}
        isFormOpen={showNewUserModal}
        submitNewData={handleAddUserSubmit}
      />
    </>
  );
};

export default memo(DeviceManagement);
