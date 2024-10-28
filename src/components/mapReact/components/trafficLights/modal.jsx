import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import TrafficLights from ".";
import { getTrafficLightsData } from "../../../../api/api.handlers";
import { fixIncompleteJSON } from "../svetofor/utils";

const TrafficLightsModal = ({ light, isDialogOpen, handler }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [trafficLights, setTrafficLights] = useState(null);
  const [trafficSocketData, setTrafficSocketData] = useState(null);

  const getTrafficLights = async (id) => {
    setIsLoading(true);
    try {
      const res = await getTrafficLightsData(id);
      setIsLoading(false);

      setTrafficLights(res);
    } catch (error) {
      setIsLoading(false);

      throw new Error(error);
    }
  };

  const onTrafficLightsDataReceived = (data) => {
    // console.log(data, "traffic with socket");
    // console.log(trafficSocketData, "old traffic data");
    if (light)
      setTrafficSocketData((light) => {
        return data?.channel.map((v) => {
          return {
            ...v,
            lat: trafficLights.find((light) => v.id === light.link_id)?.lat,
            lng: trafficLights.find((light) => v.id === light.link_id)?.lng,
            rotate: trafficLights.find((light) => v.id === light.link_id)
              ?.rotate,
            type: trafficLights.find((light) => v.id === light.link_id)?.type,
          };
        });
      });
  };
  useEffect(() => {
    let trafficSocket;
    if (isDialogOpen && trafficLights) {
      trafficSocket = new WebSocket(
        import.meta.env.VITE_TRAFFIC_SOCKET + light?.cid
      );
      trafficSocket.onmessage = (event) => {
        let message = event.data;
        // Fix incomplete JSON message
        message = fixIncompleteJSON(message);
        try {
          const data = JSON.parse(message);
          onTrafficLightsDataReceived(data);
        } catch (error) {
          throw new Error(error);
        }
      };
      // setTimeout(() => {
      //   trafficSocket.close();
      // }, 5000);
    }

    return () => {
      // Clean up the socket connection when the dialog is closed
      if (trafficSocket) {
        trafficSocket.close();
      }
    };
  }, [isDialogOpen, trafficLights]);

  useEffect(() => {
    if (isDialogOpen && trafficLights === null) {
      getTrafficLights(light.cid);
    }
    return () => {};
  }, [isDialogOpen, trafficLights]);

  const handleClose = () => {
    setTrafficLights(null);
    handler();
  };
  return (
    <>
      <Dialog size="xxl" open={isDialogOpen} handler={handleClose}>
        <DialogHeader className="justify-between dark:bg-blue-gray-900 dark:text-white">
          <div>
            <Typography variant="h5">{light?.cname || ""}</Typography>
          </div>
          <IconButton size="sm" variant="text" onClick={handler}>
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
          <TrafficLights
            id={light?.cid}
            // center={[light?.lat, light?.lng]}
            // lights={trafficLights}
            // lightsSocketData={trafficSocketData}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};

export default TrafficLightsModal;
