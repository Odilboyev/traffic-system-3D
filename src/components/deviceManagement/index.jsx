import {
  IconButton,
  List,
  ListItem,
  Typography,
} from "@material-tailwind/react";
import { CogIcon } from "@heroicons/react/16/solid";
import { useState, useCallback, memo, useEffect } from "react";
import { t } from "i18next";
import Dropright from "../dropright";
import ModalTable from "../mapReact/components/modalTable";
import { getDevices, getErrorHistory } from "../../api/api.handlers";

const DeviceManagement = () => {
  const [isDroprightOpen, setIsDroprightOpen] = useState(false);
  const [deviceType, setDeviceType] = useState(""); // Default type
  const [isAlarmDeviceOpen, setIsAlarmDeviceOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [deviceData, setDeviceData] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceTotalPages, setDeviceTotalPages] = useState(null);

  const fetchDeviceData = useCallback(async (type, current = 1) => {
    setDeviceLoading(true);
    setDeviceData([]); // Clear existing data before fetching new data
    try {
      const all = await getDevices(type, current);
      setDeviceData(all.data);
      setDeviceTotalPages(all.total_pages ? all.total_pages : 1);
      setTotalItems(all.total_items);
    } catch (err) {
      console.log("Error fetching device data. Please try again.");
    } finally {
      setDeviceLoading(false);
    }
  }, []);

  // Handler for changing the device type
  const handleTypeChange = (type) => {
    setDeviceType(type); // Update device type
    console.log(type);
    fetchDeviceData(type); // Fetch data for the selected type
    setIsDroprightOpen(false); // Close the dropdown
    setIsAlarmDeviceOpen(true); // Open the device modal
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
      console.log("Error fetching error history. Please try again.");
    } finally {
      setDeviceLoading(false);
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
        itemCallback={fetchErrorHistory}
        title={deviceType}
        data={deviceData}
        showActions={true}
        isLoading={deviceLoading}
        itemsPerPage={20}
        totalPages={deviceTotalPages}
        fetchHandler={fetchDeviceData}
      />
    </>
  );
};

export default memo(DeviceManagement);
