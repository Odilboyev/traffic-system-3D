import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import TrafficLights from ".";
import { getTrafficLightsData } from "../../../../apiHandlers";

const TrafficLightsModal = ({ light, isDialogOpen, handler }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [trafficLights, setTrafficLights] = useState(null);
  const [trafficSocketData, setTrafficSocketData] = useState(null);

  const getTrafficLights = async (id) => {
    console.log(id, "gettrafficlights");
    setIsLoading(true);
    try {
      const res = await getTrafficLightsData(id);
      setIsLoading(false);
      console.log(res, "traffic");
      setTrafficLights(res);
    } catch (error) {
      setIsLoading(false);

      throw new Error(error);
    }
  };

  const onTrafficLightsDataReceived = (data) => {
    // console.log(data, "traffic with socket");
    // console.log(trafficSocketData, "old traffic data");
    setTrafficSocketData((light) => {
      return data?.channel.map((v) => {
        return {
          ...v,
          lat: trafficLights.find((light) => v.id === light.link_id).lat,
          lng: trafficLights.find((light) => v.id === light.link_id).lng,
          rotate: trafficLights.find((light) => v.id === light.link_id).rotate,
          type: trafficLights.find((light) => v.id === light.link_id).type,
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
        const data = JSON.parse(event.data);
        console.log(data, "raw data");
        onTrafficLightsDataReceived(data);
      };
      setTimeout(() => {
        trafficSocket.close();
      }, 5000);
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
      console.log(light, "trafficLights id ");
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
        <DialogHeader className="justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              {light?.cname}
            </Typography>
          </div>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handler}
          >
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

        <DialogBody className="min-h-[90vh] max-h-[90vh]">
          <TrafficLights
            center={[light?.lat, light?.lng]}
            lights={trafficLights}
            lightsSocketData={trafficSocketData}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};

export default TrafficLightsModal;
