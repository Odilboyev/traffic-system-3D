import { ArrowsPointingOutIcon, XMarkIcon } from "@heroicons/react/16/solid";
import {
  Card,
  CardBody,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { getBoxData, getCrossRoadData } from "../../../../api/api.handlers";
import { useEffect, useState } from "react";

import CrossroadDataModal from "./components/modal";

const CrossroadWidget = ({ t, isOpen, onClose, marker, isVisible }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [device, setDevice] = useState(null);

  const fetchData = async (id) => {
    setIsLoading(true);
    try {
      const crossroadData = await getCrossRoadData(id);
      setData(crossroadData?.data.camera);
    } catch (error) {
      console.error("Failed to fetch crossroad data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSensorData = async (id) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const sensorData = await getBoxData(id);
      setDevice({
        device_data: sensorData?.device_data,
        sensor_data: sensorData?.sensor_data,
      });
    } catch (error) {
      console.error("Failed to fetch sensor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && marker?.cid) {
      setData(null);
      fetchData(marker.cid);
    }
  }, [isOpen, marker]);

  useEffect(() => {
    if (data?.box_device?.id) {
      fetchSensorData(data.box_device.id);
    }
  }, [data]);

  const handleClose = () => {
    setData(null);
    onClose();
  };

  const handleOpenModal = (section) => {
    setSelectedSection(section);
    setOpenModal(true);
  };
  console.log(marker, "handleOpenModal");
  return (
    <>
      <Card
        className={`w-[15vw] z-[9999]   ${
          isVisible ? "fixed" : "none"
        } top-0 right-0 h-full rounded-none overflow-y-scroll no-scrollbar duration-200 ease-in-out bg-gray-900/80  dark:bg-gray-900/50 backdrop-blur-md text-white shadow-lg flex flex-col  transition-all  select-none`}
      >
        <div className="relative w-full h-full">
          <CardBody className="p-4">
            <Typography className="my-2">{marker?.cname}</Typography>
            <IconButton
              onClick={handleClose}
              size="sm"
              variant="text"
              className="absolute top-2 right-2"
            >
              <XMarkIcon className="w-4 h-4" />
            </IconButton>
            <div className="flex flex-col gap-3">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white/10 rounded-lg p-3"
                >
                  <div className="flex-1">
                    <Typography variant="small" className="text-gray-300">
                      {t(section.title)}
                    </Typography>
                  </div>
                  <IconButton
                    variant="text"
                    className="text-white"
                    onClick={() => handleOpenModal(section.title)}
                  >
                    <ArrowsPointingOutIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              ))}
            </div>
          </CardBody>
        </div>
      </Card>
      {selectedSection && (
        <CrossroadDataModal
          t={t}
          open={openModal}
          data={data}
          device={device}
          marker={marker}
          handler={() => setOpenModal(false)}
          section={selectedSection}
        />
      )}
    </>
  );
};

export default CrossroadWidget;
const sections = [
  {
    title: "camera",
    value: "76",
    status: "Online",
    offline: "13",
    onlinePercentage: "85.4%",
  },
  {
    title: "sensor",
    value: "30",
    status: "Online",
    offline: "0",
    onlinePercentage: "100%",
  },
  {
    title: "trafficlights",
    value: "63",
    status: "Online",
    offline: "0",
    onlinePercentage: "100%",
  },
  {
    title: "statistics",
    value: "49",
    status: "Online",
    offline: "10",
    onlinePercentage: "83.1%",
  },
];
