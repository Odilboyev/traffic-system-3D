import { Dialog, DialogBody } from "@material-tailwind/react";

import PropTypes from "prop-types";
import TrafficLightDashboard from "./components/trafficLightDashboard";

const TrafficLightsModal = ({ light, isOpen, onClose, t }) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <>
      {light?.statuserror !== 2 && (
        <Dialog
          size="xxl"
          className="no-scrollbar"
          open={isOpen}
          onClose={handleClose}
        >
          <DialogBody className="max-h-screen p-0 h-full no-scrollbar overflow-y-scroll dark:bg-blue-gray-900 dark:text-white">
            {/* <TrafficLightDashboard
              id={light?.cid}
              vendor={light?.vendor_id}
              infoData={light}
              onClose={onClose}
              t={t}
            /> */}
          </DialogBody>
        </Dialog>
      )}
    </>
  );
};

TrafficLightsModal.propTypes = {
  light: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default TrafficLightsModal;
