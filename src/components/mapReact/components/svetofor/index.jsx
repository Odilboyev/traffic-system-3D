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
  const [wssLink, setWssLink] = useState(null); // Store the WebSocket link

  const center = map.getCenter();
  const zoom = map.getZoom();

  const handleMapEvents = () => {
    if (zoom >= 21) {
      if (trafficLights.length === 0)
        fetchTrafficLights({
          lat: center.lat,
          lng: center.lng,
          zoom: map.getZoom(),
        });
    } else {
      clearTrafficLights();
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

      // Only open a new WebSocket if the svetofor_id has changed
      if (currentSvetoforId !== response.svetofor_id) {
        setCurrentSvetoforId(response.svetofor_id);
        setWssLink(response.wss_link); // Update WebSocket link
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
    setWssLink(null); // Clear WebSocket link
  };

  const updateTrafficLights = (data) => {
    console.log("Updating traffic lights with data:", data);
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
          type: existingLight?.type ?? 0,
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
            className:
              "w-8 h-8  rounded-full flex items-center justify-center ",
            html: renderToString(
              <NeonIcon
                icon={iconSelector({ type: v.type, status: v.status })}
                status={v.status === 1 ? 0 : v.status === 2 ? 2 : 1}
                text={v.countdown || "0"}
              />
            ),
            // html: `
            //   <div class="flex items-center justify-center w-[50px] p-1 max-h-20 rounded-lg ${
            //     v.status === 1
            //       ? "bg-green-400"
            //       : v.status === 2
            //       ? "bg-red-400"
            //       : "bg-yellow-400"
            //   }">
            //     <div class="text-xl rounded-lg text-white font-bolder">
            //       ${renderToString(
            //         <div style={{ transform: `rotate(${v.rotate}deg)` }}>
            //           {iconSelector(v.type, v.status)}
            //         </div>
            //       )}
            //     </div>
            //     <span class="font-bold mx-1 text-white">${
            //       v.countdown || 0
            //     }</span>
            //   </div>
            // `,
          })}
        />
      ))}
    </>
  );
};

const iconSelector = ({ type = 1, status = 0 }) => {
  switch (type) {
    case 1:
      return MdStraight;
    case 2:
      return status === 1 ? IoIosWalk : IoMdMan;
    default:
      return null;
  }
};

export default Svetoforlar;
