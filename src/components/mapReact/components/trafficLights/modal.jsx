import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import TrafficLights from ".";
import PropTypes from "prop-types";

const TrafficLightsModal = ({ light, isDialogOpen, handler }) => {
  const handleClose = () => {
    handler();
  };
  return (
    <>
      <Dialog size="xxl" open={isDialogOpen} handler={handleClose}>
        <DialogHeader className="justify-between dark:bg-blue-gray-900 dark:text-white">
          <div>
            <Typography variant="h5">{light?.cname || ""}</Typography>
          </div>
          <IconButton size="sm" onClick={handler}>
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

        <DialogBody className="min-h-[90vh] max-h-[94vh] overflow-y-scroll dark:bg-blue-gray-900 dark:text-white">
          <TrafficLights id={light?.cid} />
        </DialogBody>
      </Dialog>
    </>
  );
};

TrafficLightsModal.propTypes = {
  light: PropTypes.shape({
    cname: PropTypes.string,
    cid: PropTypes.string,
  }),
  isDialogOpen: PropTypes.bool.isRequired,
  handler: PropTypes.func.isRequired,
};

export default TrafficLightsModal;
