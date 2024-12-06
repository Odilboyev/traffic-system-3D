import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Spinner,
} from "@material-tailwind/react";

import CrossroadDashboard from "../../../components/crossroad/subPages/crossroadDash";
import SensorPartWrapper from "../../../components/deviceModal/components/sensorSection/wrapper";
import TrafficLightDashboard from "../../../components/trafficLightsModal/components/trafficLightDashboard";
import Videos from "../../../components/crossroad/subPages/videos";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

const CrossroadDataModal = ({
  t,
  section,
  open,
  data,
  device,
  marker,
  handler,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isCamera =
    section === "camera_pdd" ||
    section === "camera_view" ||
    section === "camera_traffic";

  const renderContent = () => {
    if (!data || !section) return null;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Spinner className="h-8 w-8" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 p-4">
          {t("error_loading_data")}
        </div>
      );
    }

    switch (section) {
      case "camera_pdd":
      case "camera_view":
      case "camera_traffic":
        return <Videos t={t} videos={data[section]?.data} />;
      case "box_device":
        return <SensorPartWrapper t={t} device={device} />;
      case "svetofor":
        return (
          <div className="h-[80vh] relative">
            <TrafficLightDashboard
              t={t}
              id={data?.svetofor.svetofor_id}
              infoData={{
                vendor_id: data?.svetofor?.vendor_id,
                crossroad_name: marker?.cname,
              }}
              isInModal
            />
          </div>
        );
      case "statistics":
        return <CrossroadDashboard t={t} marker={marker} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      size="xl"
      open={open}
      handler={handler}
      className="dark:bg-gray-900 dark:text-white text-gray-900"
    >
      <DialogHeader className="flex justify-between items-center border-b dark:border-gray-700 pb-4">
        <h5 className="text-xl font-semibold dark:text-white">
          {marker?.name || t(section)}
        </h5>
        <IconButton
          size="sm"
          onClick={handler}
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </IconButton>
      </DialogHeader>

      <DialogBody className="max-h-[80vh] overflow-y-auto custom-scrollbar">
        <div className="p-4">{renderContent()}</div>
      </DialogBody>
      <DialogFooter>{""}</DialogFooter>
    </Dialog>
  );
};

export default CrossroadDataModal;
