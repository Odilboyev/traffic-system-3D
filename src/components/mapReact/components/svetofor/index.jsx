import React, { useEffect, useState } from "react";
import { getNearByTrafficLights } from "../../../../api/apiHandlers";
import { Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MdStraight } from "react-icons/md";
import { IoIosWalk, IoMdMan } from "react-icons/io";
import { renderToString } from "react-dom/server";
import NeonIcon from "../../../neonIcon";

const Svetoforlar = () => {
  const map = useMap();
  const [trafficLights, setTrafficLights] = useState([]);
  const [trafficSocket, setTrafficSocket] = useState(null);
  const [currentSvetoforId, setCurrentSvetoforId] = useState(null);
  const [wssLink, setWssLink] = useState(null);
  const [lastSuccessfulLocation, setLastSuccessfulLocation] = useState(null);

  const handleMapEvents = () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    console.log(zoom);
    if (zoom >= 21) {
      if (trafficLights.length === 0) {
        fetchTrafficLights({
          lat: center.lat,
          lng: center.lng,
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

  useMapEvents({
    dragend: handleMapEvents,
    zoomend: handleMapEvents,
  });

  useEffect(() => {
    if (wssLink) {
      const socket = new WebSocket(wssLink);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data) updateTrafficLights(data);
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };

      setTrafficSocket(socket);

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

  const clearTrafficLights = () => {
    setTrafficLights([]);
    if (trafficSocket) {
      trafficSocket.close();
      setTrafficSocket(null);
    }
    setCurrentSvetoforId(null);
    setWssLink(null);
    setLastSuccessfulLocation(null);
  };

  const updateTrafficLights = (data) => {
    if (data) {
      const prevLights = [...trafficLights];

      const updatedLights = data.channel.map((v) => {
        const existingLight = prevLights.find(
          (light) => v.id === light.link_id
        );

        return {
          ...v,
          lat: existingLight?.lat ?? 0,
          lng: existingLight?.lng ?? 0,
          rotate: existingLight?.rotate ?? 0,
          // type: existingLight?.type ?? 0,
        };
      });

      setTrafficLights(updatedLights);
    }
  };

  return (
    <>
      {trafficLights.map((v, i) => (
        <Marker
          key={i}
          position={[v.lat, v.lng]}
          icon={L.divIcon({
            className: "  rounded-full flex items-center justify-center ",
            html: renderToString(
              <NeonIcon
                icon={iconSelector({
                  type: v.type,
                  status: v.status,
                  style: { transform: `rotate(${v.rotate}deg)` },
                })}
                status={v.status === 1 ? 0 : v.status === 2 ? 2 : 1}
                text={v.countdown || "0"}
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
