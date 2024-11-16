import {
  addUser,
  deleteUser,
  fetchDataForManagement,
  getDevices,
  getErrorHistory,
  recoverUser,
  updateUser,
} from "../../../../api/api.handlers";
import { memo, useCallback, useState } from "react";

import ModalTable from "../../components/modalTable";
import { PlusIcon } from "@heroicons/react/16/solid";
import { modalToastConfig } from "../../../../tools/toastconfig";
import { t } from "i18next";
import { toast } from "react-toastify";

const DeviceManagement = ({
  activeSidePanel,
  setActiveSidePanel,
  setIsSidebarVisible,
}) => {
  // const { getDataHandler: refreshHandler } = useMapMarkers();
  const [deviceType, setDeviceType] = useState(""); // Default type
  const [isDeviceOpen, setIsDeviceOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(1);
  const [deviceData, setDeviceData] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceTotalPages, setDeviceTotalPages] = useState(null);

  // create a function to fetch the data from the devices endpoint

  // edit
  const [isEditing, setIsEditing] = useState(null);

  const [filterOptions] = useState([
    { type: 1, type_name: `active` },
    {
      type: 0,
      type_name: `inactive`,
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
    async (type = deviceType, page = 1, isactive = filter) => {
      // setDeviceLoading(true);

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
        // setDeviceLoading(false);
      }
    },
    [deviceType]
  );
  const modifyData = useCallback(
    async (method, type, body, isactive = filter) => {
      if (["delete", "patch"].includes(method)) {
        const confirmationMessage =
          method === "delete"
            ? `Are you sure you want to deactivate ${body.name}?`
            : `Are you sure you want to activate ${body.name}?`;

        if (!window.confirm(confirmationMessage)) {
          return;
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
      } catch (error) {
        console.error(error);
        toast.error(
          error.status_text
            ? error.status_text
            : `Failed to ${method} ${type}.`,
          modalToastConfig
        );
      } finally {
        const newFilter =
          method === "delete" ? 1 : method === "patch" ? 0 : filter;
        fetchData(type, 1, newFilter);
        // refreshHandler();
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
    setIsDeviceOpen(true); // Open the device modal
    setIsSidebarVisible(false);
    setDeviceType(type); // Update device type
    setActiveSidePanel(null); // Close the dropdown

    console.log("open device modal");
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
    "cameraview",
    "camerapdd",
    "boxmonitor",
    "svetofor",
  ].includes(deviceType);

  return (
    <>
      <div className="">
        {[
          "crossroad",
          "cameratraffic",
          "cameraview",
          "camerapdd",
          "boxmonitor",
          "svetofor",
          "users",
        ].map((type) => (
          <div key={type} className={`group border-l my-2`}>
            <button
              className="text-left px-3 py-2 w-full hover:bg-gray-800/50 !rounded-none transition-colors font-medium"
              onClick={() => {
                handleTypeChange(type);
              }}
            >
              {" "}
              {t(type) || ""}
            </button>
          </div>
        ))}
      </div>
      {isDeviceOpen && (
        <ModalTable
          open={isDeviceOpen}
          handleOpen={() => {
            setIsSidebarVisible(true);
            setDeviceTotalPages(null);
            setDeviceData([]);
            setIsDeviceOpen(false);
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
      )}
    </>
  );
};

DeviceManagement.propTypes = {
  // refreshHandler: PropTypes.func,
};

export default memo(DeviceManagement);
