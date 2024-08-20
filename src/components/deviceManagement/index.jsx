import {
  IconButton,
  List,
  ListItem,
  Typography,
} from "@material-tailwind/react";
import { CogIcon } from "@heroicons/react/16/solid";
import { useState, useCallback, memo } from "react";
import { t } from "i18next";
import Dropright from "../Dropright";
import ModalTable from "../mapReact/components/modalTable";
import { getDevices } from "../../api/api.handlers";

const DeviceManagement = () => {
  const [isDroprightOpen, setIsDroprightOpen] = useState(false);
  const [deviceType, setdeviceType] = useState(""); // default type
  const [isAlarmdeviceOpen, setIsAlarmdeviceOpen] = useState(false);
  const [deviceData, setdeviceData] = useState([]);
  const [deviceLoading, setdeviceLoading] = useState(false);
  const [deviceTotalPages, setdeviceTotalPages] = useState(null);

  const fetchDeviceData = useCallback(async (type, current = 1) => {
    setdeviceLoading(true);
    setdeviceData([]); // Clear existing data before fetching new data
    try {
      const all = await getDevices(type, current);
      setdeviceData(all.data);
      setdeviceTotalPages(all.total_pages ? all.total_pages : 1);
    } catch (err) {
      console.log("Error fetching error device. Please try again.");
    } finally {
      setdeviceLoading(false);
    }
  }, []);

  // Handler for changing the device type
  const handleTypeChange = (type) => {
    setdeviceType(type); // Update device type
    fetchDeviceData(type); // Fetch data for the selected type
    setIsDroprightOpen(false); // Close the dropdown
    setIsAlarmdeviceOpen(true); // Open the modal
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
        open={isAlarmdeviceOpen}
        handleOpen={() => {
          setdeviceData([]);
          setIsAlarmdeviceOpen(!isAlarmdeviceOpen);
        }}
        title={t(deviceType)}
        data={deviceData}
        isLoading={deviceLoading}
        itemsPerPage={20}
        totalPages={deviceTotalPages}
        fetchHandler={(current) => fetchDeviceData(deviceType, current)}
      />
    </>
  );
};
export default memo(DeviceManagement);
