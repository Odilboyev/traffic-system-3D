import { useEffect, useState } from "react";
import { getNearByTrafficLights } from "../../../../api/api.handlers";
import { Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MdStraight } from "react-icons/md";
import { IoIosWalk, IoMdMan } from "react-icons/io";
import { renderToString } from "react-dom/server";
import NeonIcon from "../../../neonIcon";
import {
  TbArrowRampLeft,
  TbArrowRampRight,
  TbCornerUpLeft,
  TbCornerUpRight,
} from "react-icons/tb";
import { PiArrowULeftDownBold } from "react-icons/pi";

import ThreeArrowsIcon from "./threeArrowIcon";
import PhasesDisplay from "../crossroad/components/phases";
function fixIncompleteJSON(message) {
  // Check if message starts with "{" and doesn't end with "}"
  if (message.startsWith("{") && !message.endsWith("}")) {
    // Count opening and closing braces
    const openBracesCount = (message.match(/{/g) || []).length;
    const closeBracesCount = (message.match(/}/g) || []).length;

    // If there are more opening braces than closing braces, add the missing closing braces
    if (openBracesCount > closeBracesCount) {
      const missingBraces = openBracesCount - closeBracesCount;
      message += "}".repeat(missingBraces);
    }
  }

  return message;
}
const Svetoforlar = ({
  trafficLights,
  setTrafficLights,
  setWssLink,
  setCurrentSvetoforId,
  setTrafficSocket,
  currentSvetoforId,
  wssLink,
  phase,
  lastSuccessfulLocation,
  setLastSuccessfulLocation,
  trafficSocket,
  clearTrafficLights,
  updateTrafficLights,
  isInModal,
}) => {
  const map = useMap();

  const handleMapEvents = () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    console.log(zoom);
    if (zoom >= 19) {
      if (trafficLights.length === 0) {
        fetchTrafficLights({
          lat: center?.lat,
          lng: center?.lng,
          zoom: map.getZoom(),
        });
      }
    } else {
      clearTrafficLights();
    }

    const currentLocation = L.latLng(center.lat, center.lng);

    if (lastSuccessfulLocation) {
      const distanceFromLast = currentLocation.distanceTo(
        lastSuccessfulLocation
      );
      console.log(distanceFromLast);
      if (distanceFromLast > 100 && trafficSocket) {
        // Close WebSocket if more than 100 meters away from the last successful location
        clearTrafficLights();
        return;
      }
    }
  };

  useEffect(() => {
    handleMapEvents();
  }, []);

  useMapEvents({
    dragend: handleMapEvents,
    zoomend: handleMapEvents,
  });
  useEffect(() => {
    if (wssLink) {
      const socket = new WebSocket(wssLink);

      socket.onmessage = (event) => {
        let message = event.data;

        // Fix incomplete JSON message
        message = fixIncompleteJSON(message);
        try {
          const data = JSON.parse(message);
          if (data) updateTrafficLights(data);
        } catch (error) {
          console.log("Raw data error:", event.data); // Log raw data
          console.error("Error parsing WebSocket data:", error);
        }
      };

      setTrafficSocket(socket);
      socket.onclose = (e) => {
        console.log(e, "WebSocket closed");
      };
      return () => {
        if (socket) {
          socket.close();
        }
      };
    }
  }, [wssLink]);

  const fetchTrafficLights = async (body) => {
    try {
      const response = await getNearByTrafficLights(body);

      if (response.status === "error") {
        console.error(response.message);
        clearTrafficLights(); // Clear state and close WebSocket on error
        return;
      }

      setTrafficLights(response.data);

      // Update the last successful location
      setLastSuccessfulLocation(L.latLng(body.lat, body.lng));

      // Only open a new WebSocket if the svetofor_id has changed
      if (currentSvetoforId !== response.svetofor_id) {
        setCurrentSvetoforId(response.svetofor_id);
        setWssLink(response.wss_link);
      }
    } catch (error) {
      console.error("Error fetching traffic lights:", error);
      clearTrafficLights();
    }
  };

  // const clearTrafficLights = () => {
  //   setTrafficLights([]);
  //   if (trafficSocket) {
  //     trafficSocket.close();
  //     setTrafficSocket(null);
  //   }
  //   setCurrentSvetoforId(null);
  //   setWssLink(null);
  //   setLastSuccessfulLocation(null);
  // };

  // const updateTrafficLights = (data) => {
  //   if (data) {
  //     const updatedLights = trafficLights.map((light) => {
  //       const update = data.channel.find((v) => v.id === light.link_id);
  //       return update
  //         ? {
  //             ...light,
  //             status: update.type === 100 ? light.status : update.status,
  //             countdown: update.countdown,
  //           }
  //         : light;
  //     });
  //     setPhase(data.phase);
  //     setTrafficLights(updatedLights);
  //   }
  // };

  return (
    <>
      {trafficLights.map((v, i) => (
        <Marker
          key={i}
          position={[v.lat, v.lng]}
          icon={L.divIcon({
            className: "rounded-full flex items-center justify-center ",
            html: renderToString(
              <NeonIcon
                isRounded={false}
                icon={
                  v.type !== 100 &&
                  iconSelector({
                    type: v.type,
                    status: v.status,
                    style: { transform: `rotate(${v.rotate}deg)` },
                  })
                }
                status={v.status === 1 ? 0 : v.status === 2 ? 2 : 1}
                text={v.type === 100 && (v.countdown || "0")}
              />
            ),
          })}
        />
      ))}
    </>
  );
};

const iconSelector = ({ type = 1, status = 0, style }) => {
  const IconComponent = (() => {
    switch (type) {
      case 1:
        return MdStraight;
      case 2:
        return status === 1 ? IoIosWalk : IoMdMan;
      case 3:
        return TbCornerUpRight;
      case 4:
        return TbCornerUpLeft;
      case 5:
        return TbArrowRampRight;
      case 6:
        return TbArrowRampLeft;
      case 7:
        return ThreeArrowsIcon;
      case 8:
        return PiArrowULeftDownBold;
      default:
        return MdStraight;
    }
  })();

  return (
    <div className="flex items-center justify-center" style={style}>
      <IconComponent className=" sm:h-8 sm:w-8 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-8 xl:w-8" />
    </div>
  );
};

export default Svetoforlar;
