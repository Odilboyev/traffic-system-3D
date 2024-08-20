import Control from "react-leaflet-custom-control";
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
  const [deviceType, setdeviceType] = useState("corssroad"); // default type
  const [isAlarmdeviceOpen, setIsAlarmdeviceOpen] = useState(false);
  const [deviceData, setdeviceData] = useState([]);
  const [deviceLoading, setdeviceLoading] = useState(false);
  const [deviceTotalPages, setdeviceTotalPages] = useState(null);

  const fetchDeviceData = useCallback(
    async (current) => {
      setdeviceLoading(true);
      try {
        const all = await getDevices(deviceType, current);
        setdeviceData(all.data);
        setdeviceTotalPages(all.total_pages ? all.total_pages : 1);
      } catch (err) {
        console.log("Error fetching error device. Please try again.");
      } finally {
        setdeviceLoading(false);
      }
    },
    [deviceType]
  );

  // Handler for changing the device type
  const handleTypeChange = (type) => {
    setIsDroprightOpen(false); // Close the dropdown
    setdeviceType(type);
    setIsAlarmdeviceOpen(true);
    fetchDeviceData(1); // Fetch data for the selected type
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
            <Typography>{t("management")}</Typography>
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
                onClick={() => handleTypeChange("trafficlight")}
              >
                {t("svetofor")}
              </ListItem>
            </List>
          </div>
        }
      />
      <ModalTable
        open={isAlarmdeviceOpen}
        handleOpen={() => setIsAlarmdeviceOpen(!isAlarmdeviceOpen)}
        data={deviceData}
        isLoading={deviceLoading}
        itemsPerPage={20}
        totalPages={deviceTotalPages}
        fetchHandler={fetchDeviceData}
      />
    </>
  );
};
export default memo(DeviceManagement);
