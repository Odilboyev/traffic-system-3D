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
  fetchDataForManagement,
  getDevices,
  getErrorHistory,
  getUserRoles,
  recoverUser,
  updateUser,
} from "../../api/api.handlers";
import { toast, ToastContainer } from "react-toastify";

const DeviceManagement = ({ refreshHandler }) => {
  const [isDroprightOpen, setIsDroprightOpen] = useState(false);
  const [deviceType, setDeviceType] = useState(""); // Default type
  const [isAlarmDeviceOpen, setIsAlarmDeviceOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(1);
  const [deviceData, setDeviceData] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceTotalPages, setDeviceTotalPages] = useState(null);

  // edit
  const [isEditing, setIsEditing] = useState(null);

  const [filterOptions] = useState([
    { type: 1, type_name: t(`active_${deviceType}`) },
    {
      type: 0,
      type_name: t(`inactive_${deviceType}`),
    },
  ]);
  const [filter, setFilter] = useState(filterOptions[0].type);
  //users
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

  const fetchData = useCallback(
    async (type = deviceType, page = 1, isactive) => {
      console.log("GET Request:", { type, page, isactive });
      setDeviceLoading(true);

      try {
        const res = await fetchDataForManagement("GET", type, {
          params: { page, isactive },
        });
        setDeviceData(res.data);
        setTotalItems(res.total_items);
      } catch (error) {
        console.error(error);
        toast.error(
          error.status_text
            ? error.status_text
            : `Failed to fetch ${type} data.`
        );
      } finally {
        setDeviceLoading(false);
      }
    },
    [deviceType]
  );
  const modifyData = useCallback(
    async (method, type, body, isactive = undefined) => {
      console.log(`${method} Request:`, { type, body, isactive });
      // activation
      if (["delete", "patch"].includes(method)) {
        const confirmationMessage =
          method === "delete"
            ? `Are you sure you want to deactivate ${body.name}?`
            : `Are you sure you want to activate ${body.name}?`;

        if (!window.confirm(confirmationMessage)) {
          return; // Exit if the user cancels
        }
      }

      setDeviceLoading(true);
      try {
        const res = await fetchDataForManagement(method, type, {
          data: body,
          params: { isactive },
          id: body.id,
        });
        console.log(res, `${method} Response`);
        res.status_text
          ? toast.success(res.status_text)
          : toast.success(`${method} operation on ${type} succeeded.`);
        // Optionally re-fetch data to update the UI
        await fetchData(type);
      } catch (error) {
        console.error(error);
        toast.error(
          error.status_text ? error.status_text : `Failed to ${method} ${type}.`
        );
      } finally {
        fetchData();
        refreshHandler();
      }
    },
    [fetchData]
  );
  useEffect(() => {
    console.log(filter, "filter changed");
  }, [filter]);

  // oldcode

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
    fetchData("crossroad");
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
      console.log(filter);
      await fetchDeviceData("user/" + filter); // Fetch active users by default after the operation
    }
  };

  // fetchErrorHistory
  const fetchErrorHistory = async (current, type, id = null) => {
    const dtype =
      type === "cameratraffic" ? 1 : type == "boxcontroller" ? 3 : 4;
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
    } else if (
      type === "crossroad" ||
      type === "cameratraffic" ||
      type === "boxmonitor"
    ) {
      //  HOZIRCHAGA crossroad uchun qo'yilgan. Backend o'zgarganda hammasi uchun fetchDataForManagement qo'yamiz.
      fetchData(type, 1, filter);
    } else {
      fetchDeviceData(type); // Fetch data for the selected type
    }
  };
  const handleFilterChange = (filter) => {
    setFilter(filter);
    fetchData(deviceType, 1, filter);
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
            <List>
              {[
                "crossroad",
                "cameratraffic",
                "camera",
                "boxmonitor",
                "svetofor",
                "users",
              ].map((type) => (
                <ListItem
                  key={type}
                  className="shadow-sm text-white"
                  onClick={() => {
                    handleTypeChange(type);
                  }}
                >
                  {t(type)}
                </ListItem>
              ))}
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
        historyButtonCallback={
          deviceType !== "users" ? fetchErrorHistory : null
        }
        type={deviceType}
        data={deviceData}
        pickedFilter={deviceType == "users" ? filter : null}
        filterHandler={handleFilterChange}
        backButtonProps={{
          label: `create_new_${deviceType}`,
          onClick: (val) => createNewUser(val),
          icon: <PlusIcon className="w-5 h-5 m-0" />,
        }}
        filterOptions={filterOptions}
        showActions={true}
        isLoading={deviceLoading}
        selectedFilter={filter}
        // fetchHandler={(type, page) => {
        //   deviceType == "crossroad" || deviceType === "cameratraffic"
        //     ? fetchData(type, page, filter)
        //     : fetchDeviceData(
        //         type,
        //         page,
        //         filter === "0" ? "/list_active" : "/list_deactive"
        //       );
        // }}
        fetchHandler={(type, page) => {
          fetchData(type, page, filter);
        }}
        deleteButtonCallback={
          deviceType === "crossroad" ||
          deviceType === "cameratraffic" ||
          deviceType === "boxmonitor"
            ? (data) => modifyData("delete", deviceType, data)
            : (user) => handleUserStatus(user, "deactivate")
        }
        activateButtonCallback={
          deviceType === "crossroad" ||
          deviceType === "cameratraffic" ||
          deviceType === "boxmonitor"
            ? (data) => modifyData("patch", deviceType, data)
            : (user) => handleUserStatus(user, "activate")
        }
        tableSelectOptions={userRoles}
        editButtonCallback={setIsEditing}
        isFormOpen={showNewUserModal}
        submitNewData={(data) =>
          modifyData(isEditing ? "PUT" : "POST", deviceType, data)
        }
      />
    </>
  );
};

export default memo(DeviceManagement);
