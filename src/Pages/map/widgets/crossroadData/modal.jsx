import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";

const CrossroadDataModal = ({ open, handler, section }) => {
  if (!section) return null;

  return (
    <Dialog
      size="md"
      open={open}
      handler={handler}
      className="dark:bg-blue-gray-800"
    >
      <DialogHeader className="justify-between dark:bg-blue-gray-900">
        <Typography variant="h5" className="dark:text-white">
          {section.title} Details
        </Typography>
        <IconButton
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handler}
        >
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="dark:bg-blue-gray-900">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-gray-50 dark:bg-blue-gray-800 p-4 rounded-lg">
              <Typography className="font-bold dark:text-white">
                Total Devices
              </Typography>
              <Typography className="text-2xl dark:text-white">
                {parseInt(section.value) + parseInt(section.offline)}
              </Typography>
            </div>
            <div className="bg-blue-gray-50 dark:bg-blue-gray-800 p-4 rounded-lg">
              <Typography className="font-bold dark:text-white">
                Online Status
              </Typography>
              <Typography className="text-2xl text-green-500">
                {section.onlinePercentage}
              </Typography>
            </div>
          </div>

          <div className="bg-blue-gray-50 dark:bg-blue-gray-800 p-4 rounded-lg">
            <Typography className="font-bold mb-2 dark:text-white">
              Status Breakdown
            </Typography>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Typography className="dark:text-white">Online</Typography>
                <Typography className="text-green-500">
                  {section.value}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography className="dark:text-white">Offline</Typography>
                <Typography className="text-red-500">
                  {section.offline}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default CrossroadDataModal;
