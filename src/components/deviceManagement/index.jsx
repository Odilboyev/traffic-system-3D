import {
  IconButton,
  List,
  ListItem,
  Typography,
} from "@material-tailwind/react";
import { CogIcon } from "@heroicons/react/16/solid";
import { useState, useCallback, memo } from "react";
import { t } from "i18next";
import Dropright from "../dropright";
import ModalTable from "../mapReact/components/modalTable";
import { getDevices, getErrorHistory } from "../../api/api.handlers";

const DeviceManagement = () => {
  const [isDroprightOpen, setIsDroprightOpen] = useState(false);
  const [deviceType, setDeviceType] = useState(""); // Default type
  const [userFilter, setUserFilter] = useState("list_active");
  const [isAlarmDeviceOpen, setIsAlarmDeviceOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [deviceData, setDeviceData] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceTotalPages, setDeviceTotalPages] = useState(null);

  const fetchDeviceData = useCallback(async (type, current = 1) => {
    setDeviceLoading(true);
    setDeviceData([]); // Clear existing data before fetching new data
    console.log(type, current, "Device");
    try {
      const all = await getDevices(type, current);
      setDeviceData(all.data);
      console.log(all.data, "device");
      setDeviceTotalPages(all.total_pages ? all.total_pages : 1);
      setTotalItems(all.total_items);
    } catch (err) {
      console.log("Error fetching device data. Please try again.");
    } finally {
      setDeviceLoading(false);
    }
  }, []);
  // const handleUserFilterChange = (filterValue) => {
  //   setUserFilter(filterValue);
  //   fetchDeviceData(filterValue); // Fetch users based on the selected filter
  // };
  const createNewUser = (user) => {
    console.log(user);
  };

  // fetchErrorHistory
  const fetchErrorHistory = async (current, type, id) => {
    console.log(current, type, id, "Fetching error history");
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
        itemCallback={deviceType !== "users" && fetchErrorHistory}
        title={deviceType}
        data={deviceData}
        pickedFilter={deviceType == "users" ? userFilter : null}
        changePickFilter={setUserFilter}
        backButtonProps={
          deviceType === "users"
            ? {
                label: "create_new_user",
                onClick: () => console.log("Create new user"),
              }
            : undefined
        }
        typeOptions={
          deviceType === "users" && [
            { type: "list_active", type_name: t("active_users") },
            { type: "list_deactive", type_name: t("inactive_users") },
          ]
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
      />
    </>
  );
};

export default memo(DeviceManagement);
