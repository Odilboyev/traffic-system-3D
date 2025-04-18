import { Button, Card, Typography } from "@material-tailwind/react";
import { getBoxData, getCrossRoadInfo } from "../../../../api/api.handlers";
import { useEffect, useState } from "react";

import CrossroadDataModal from "./components/modal";
import Loader from "../../../../components/loader";
import { XMarkIcon } from "@heroicons/react/16/solid";

const CrossroadWidget = ({ t, isOpen, onClose, marker, isVisible }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [device, setDevice] = useState(null);
  console.log(isOpen, marker, "marker");
  const fetchData = async (id) => {
    setIsLoading(true);
    try {
      const crossroadData = await getCrossRoadInfo(id);
      console.log(crossroadData?.data);
      setData(crossroadData?.data);
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
    setSelectedSection(null);
    setDevice(null);
    onClose();
  };

  const handleOpenModal = (section) => {
    if (data?.length === 0) {
      return;
    }
    setSelectedSection(section);
    setOpenModal(true);
  };
  return (
    <>
      <Card
        className={`w-full md:w-[15vw] z-[9999] ${
          isVisible ? "fixed" : "hidden"
        } top-0 right-0 h-full rounded-none bg-gray-900/80 dark:bg-gray-900/50 backdrop-blur-md text-white shadow-lg flex flex-col transition-all select-none`}
      >
        <div className="relative w-full h-full flex flex-col p-4">
          <div className="flex justify-between items-center">
            <Typography className="text-xl font-semibold">
              {marker?.cname}
            </Typography>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col mt-4 gap-3">
            {!isLoading && data ? (
              [
                "camera_traffic",
                "camera_pdd",
                "camera_view",
                "svetofor",
                "box_device",
                "statistics",
              ].map((section, index) =>
                data[section]?.data?.length > 0 ||
                !section.toLowerCase().includes("camera") ? (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-all"
                  >
                    <div className="flex flex-col justify-center text-left gap-2">
                      {/* Add icon for better section visualization */}
                      <span className="text-gray-300 text-lg">
                        {t(section)}
                      </span>
                      {data[section]?.data?.length && (
                        <span className="text-sm text-gray-400">
                          {t("amount")}: {data[section]?.data?.length}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outlined"
                      color="blue"
                      onClick={() => handleOpenModal(section)}
                    >
                      {t("open")}
                    </Button>
                  </div>
                ) : (
                  ""
                )
              )
            ) : (
              <div>
                <Loader />
              </div>
            )}
          </div>
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
