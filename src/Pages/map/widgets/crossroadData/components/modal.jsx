import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";

import CrossroadDashboard from "../../../components/crossroad/subPages/crossroadDash";
import SensorPartWrapper from "../../../components/deviceModal/components/sensorSection/wrapper";
import TrafficLightDashboard from "../../../components/trafficLightsModal/components/trafficLightDashboard";
import Videos from "../../../components/crossroad/subPages/videos";
import { XMarkIcon } from "@heroicons/react/16/solid";

const CrossroadDataModal = ({
  t,
  open,
  data,
  device,
  marker,
  handler,
  section,
}) => {
  return (
    <Dialog
      size={"lg"}
      open={open}
      handler={handler}
      className="dark:bg-gray-900 dark:!text-white text-gray-900 "
    >
      <DialogHeader className="justify-between">
        <div>
          <h5 className="dark:text-white">{t(section)}</h5>
        </div>
        <IconButton size="sm" onClick={handler} className="dark:text-white">
          <XMarkIcon className="w-5 h-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody className={`max-h-[90vh] overflow-y-scroll  no-scrollbar`}>
        {section === "camera" && <Videos t={t} videos={data} />}
        {section === "sensors" && <SensorPartWrapper t={t} device={device} />}
        {section === "trafficlights" && (
          <div className="h-[80vh] relative">
            <TrafficLightDashboard t={t} id={marker?.cid} isInModal />{" "}
          </div>
        )}
        {section === "statistics" && (
          <CrossroadDashboard t={t} marker={marker} />
        )}
      </DialogBody>
      <DialogFooter />
    </Dialog>
  );
};

export default CrossroadDataModal;