import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";

import PropTypes from "prop-types";
import TrafficLightDashboard from "./components/trafficLightDashboard";

const TrafficLightsModal = ({ light, isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <>
      <Dialog
        size="xxl"
        className="no-scrollbar"
        open={isOpen}
        onClose={handleClose}
      >
        <DialogHeader className="justify-between  dark:bg-blue-gray-900 dark:text-white">
          <div>
            <Typography variant="h5">{light?.cname || ""}</Typography>
          </div>
          <IconButton size="sm" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>

        <DialogBody className="max-h-[94vh] h-full no-scrollbar overflow-y-scroll dark:bg-blue-gray-900 dark:text-white">
          <TrafficLightDashboard id={light?.cid} vendor={light?.vendor_id} />
        </DialogBody>
      </Dialog>
    </>
  );
};

TrafficLightsModal.propTypes = {
  light: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TrafficLightsModal;
