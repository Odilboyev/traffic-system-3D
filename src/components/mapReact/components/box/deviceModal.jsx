import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { IoMdClose } from "react-icons/io";
import Loader from "../../../loader";
import SensorPartWrapper from "../sensorSection/wrapper";
import useSensorErrorHistory from "../../../../customHooks/useSensorHistory";

const DeviceModal = ({ isDialogOpen, handler, isLoading, device }) => {
  const { filteredData } = useSensorErrorHistory();
  return (
    <Dialog
      size="xxl"
      open={isDialogOpen}
      handler={handler}
      className="dark:bg-blue-gray-900 dark:text-white"
    >
      <DialogHeader className="justify-end">
        <IconButton size="sm" onClick={handler}>
          <IoMdClose className="w-5 h-5 p-1" />
        </IconButton>
      </DialogHeader>

      <DialogBody className="overflow-y-scroll flex gap-2 max-h-[90vh] no-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Loader />
          </div>
        ) : filteredData ? (
          <>
            <SensorPartWrapper device={device} />
          </>
        ) : (
          <Typography>No device data</Typography>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default DeviceModal;
