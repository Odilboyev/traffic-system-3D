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
  recoverUser,
  updateUser,
} from "../../api/api.handlers";
import { toast } from "react-toastify";
import { modalToastConfig } from "../../tools/toastconfig";

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
    { type: 1, type_name: t(`active`) },
    {
      type: 0,
      type_name: t(`inactive`),
    },
  ]);
  const [filter, setFilter] = useState(filterOptions[0].type);
  const [showFormModal, setShowFormModal] = useState(false);

  const fetchDeviceData = useCallback(async (type, current = 1) => {
    setDeviceLoading(true);
    setDeviceData([]); // Clear existing data before fetching new data
    try {
      const all = await getDevices(type, current);
      setDeviceData(all.data);
      setDeviceTotalPages(all.total_pages ?? 1);
      setTotalItems(all.total_items);
    } catch (err) {
      throw new Error(err);
    } finally {
      setDeviceLoading(false);
    }
  }, []);

  const fetchData = useCallback(
    async (type = deviceType, page = 1, isactive) => {
      setDeviceLoading(true);

      try {
        const res = await fetchDataForManagement("GET", type, {
          params: { page, isactive },
        });
        setDeviceData(res.data);
        setDeviceTotalPages(res.total_pages ?? 1);
        setTotalItems(res.total_items);
      } catch (error) {
        console.error(error);
        toast.error(
          error.status_text
            ? error.status_text
            : `Failed to fetch ${type} data.`,
          modalToastConfig
        );
      } finally {
        setDeviceLoading(false);
      }
    },
    [deviceType]
  );
  const modifyData = useCallback(
    async (method, type, body, isactive = undefined) => {
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

        res.status_text
          ? toast.success(res.status_text, modalToastConfig)
          : toast.success(
              `${method} operation on ${type} succeeded.`,
              modalToastConfig
            );
        // Optionally re-fetch data to update the UI
        await fetchData(type);
      } catch (error) {
        console.error(error);
        toast.error(
          error.status_text
            ? error.status_text
            : `Failed to ${method} ${type}.`,
          modalToastConfig
        );
      } finally {
        fetchData();
        refreshHandler();
      }
    },
    [fetchData]
  );

  const createNewItem = (bool) => {
    setShowFormModal(bool); // Show the form modal when the button is clicked
  };

  const handleUserAction = async (userData, isUpdate = false) => {
    const actionType = isUpdate ? "update" : "create";
    try {
      if (isUpdate) {
        await updateUser(userData);
      } else {
        await addUser(userData);
      }
      toast.success(
        `User ${userData.name} ${actionType}d successfully!`,
        modalToastConfig
      );
      await fetchDeviceData("user/list_active"); // Refresh the user list
    } catch (error) {
      toast.error(
        `Failed to ${actionType} user. Please try again.`,
        modalToastConfig
      );
      console.error(`Error ${actionType}ing user:`, error);
    } finally {
      setShowFormModal(false); // Close the modal after the action
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
        toast.success(
          `User ${": " + user.name} successfully deactivated!`,
          modalToastConfig
        );
      } else if (actionType === "activate") {
        await recoverUser(user.id); // Assuming you have an activateUser function
        toast.success(
          `User ${": " + user.name} successfully activated!`,
          modalToastConfig
        );
      }
    } catch (error) {
      // Show error toast in case of failure
      toast.error(
        `Failed to ${actionType} user. Please try again.`,
        modalToastConfig
      );
      throw new Error(error);
    } finally {
      fetchDeviceData(filter === 1 ? "user/list_active" : "user/list_deactive");
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
    } else {
      fetchData(type, 1, filter);
    }
  };
  const handleFilterChange = (filter) => {
    setFilter(filter);
    deviceType === "users"
      ? fetchDeviceData(
          filter === 1 ? "user/list_active" : "user/list_deactive"
        ) // fetch users
      : fetchData(deviceType, 1, filter);
  };

  const isDeviceType = [
    "crossroad",
    "cameratraffic",
    "boxmonitor",
    "svetofor",
  ].includes(deviceType);

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
          setIsAlarmDeviceOpen(false);
        }}
        totalItems={totalItems}
        historyButtonCallback={
          deviceType !== "users" ? fetchErrorHistory : null
        }
        type={deviceType}
        totalPages={deviceTotalPages}
        data={deviceData}
        filterHandler={handleFilterChange}
        backButtonProps={{
          label: `create_new_${deviceType}`,
          onClick: (val) => createNewItem(val),
          icon: <PlusIcon className="w-5 h-5 m-0" />,
        }}
        filterOptions={filterOptions}
        showActions={true}
        isLoading={deviceLoading}
        selectedFilter={filter}
        fetchHandler={(type, page) => {
          deviceType === "users"
            ? fetchDeviceData(
                type === 1 ? "user/list_active" : "user/list_deactive",
                page
              )
            : fetchData(type, page, filter);
        }}
        deleteButtonCallback={
          isDeviceType
            ? (data) => modifyData("delete", deviceType, data)
            : (user) => handleUserStatus(user, "deactivate")
        }
        activateButtonCallback={
          isDeviceType
            ? (data) => modifyData("patch", deviceType, data)
            : (user) => handleUserStatus(user, "activate")
        }
        editButtonCallback={setIsEditing}
        isFormOpen={showFormModal}
        submitNewData={(data) => {
          deviceType === "users"
            ? handleUserAction(data, isEditing)
            : modifyData(isEditing ? "PUT" : "POST", deviceType, data);
        }}
      />
    </>
  );
};

export default memo(DeviceManagement);
