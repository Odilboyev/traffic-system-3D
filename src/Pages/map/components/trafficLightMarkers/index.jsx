import { Marker, Tooltip } from "react-leaflet";

import L from "leaflet";
import NeonIcon from "../../../../components/neonIcon";
import { Typography } from "@material-tailwind/react";
import { getNearbyTrafficLights } from "../../../../api/api.handlers";
import iconSelector from "./icons/iconSelector";
import { renderToString } from "react-dom/server";
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";
import { useSelector } from "react-redux";

const TrafficlightMarkers = ({
  trafficLights,
  setTrafficLights,
  setCurrentSvetoforId,
  setTrafficSocket,
  currentSvetoforId,
  clearTrafficLights,
  updateTrafficLights,
  handleMarkerDragEnd,
  trafficSocket,
  setIsPaused,
}) => {
  const isDraggable = useSelector((state) => state.map.isDraggable);
  console.log(isDraggable);
  // Fetching function passed to custom hook
  const fetchTrafficLights = async (body) => {
    try {
      const response = await getNearbyTrafficLights(body);
      console.log("Fetch response:", response);

      if (response.status === "error") {
        console.error(response.message);
        clearTrafficLights(); // Clear state and close WebSocket on error
        return;
      }
      setTrafficLights(response.data);

      // Only open a new WebSocket if the svetofor_id has changed
      if (currentSvetoforId !== response.svetofor_id) {
        console.log("Setting new svetofor_id:", response.svetofor_id);
        setCurrentSvetoforId(response.svetofor_id);
      } else {
        console.log("Svetofor_id unchanged:", currentSvetoforId);
      }
      return response;
    } catch (error) {
      console.error("Error fetching traffic lights:", error);
      clearTrafficLights();
    }
  };

  // Use the custom hook
  useMapDataFetcher({
    use: true,
    fetchData: fetchTrafficLights,
    onClearData: clearTrafficLights,
    onNewData: updateTrafficLights,
    minZoom: 20,
    fetchDistanceThreshold: 100,
  });

  return (
    <div key={trafficLights}>
      {trafficLights?.map((v, i) => (
        <Marker
          key={i}
          position={[v.lat, v.lng]}
          draggable={isDraggable}
          eventHandlers={{
            click: () => {
              // Pause WebSocket updates when starting to drag
              setIsPaused(true);
            },

            dragend: async (e) => {
              // Resume WebSocket updates after successful drag
              setIsPaused(false);
              const { lat, lng } = e.target.getLatLng();
              setTrafficLights((prevLights) =>
                prevLights.map((light) =>
                  light.id === v.id ? { ...light, lat, lng } : light
                )
              );
              try {
                await handleMarkerDragEnd(v.id, 7, e, +v.svetofor_id);

                setTrafficLights((prevLights) =>
                  prevLights.map((light) =>
                    light.id === v.id ? { ...light, lat, lng } : light
                  )
                );
              } catch (error) {
                const response = await fetchTrafficLights({
                  lat: lat.toString(),
                  lng: lng.toString(),
                  zoom: 20,
                });
                console.error("Error during dragend:", error);
              }

              // const { lat, lng } = e.target.getLatLng();
              // try {
              //   await handleMarkerDragEnd(v.id, 7, e, +v.svetofor_id);
              //   // Update local state immediately
              //   setTrafficLights((prevLights) =>
              //     prevLights.map((light) =>
              //       light.id === v.id ? { ...light, lat, lng } : light
              //     )
              //   );
              //   // Refetch traffic lights

              //   // Resume WebSocket updates after successful drag
              //   setIsPaused(false);
              // } catch (error) {
              //   console.error("Error updating marker position:", error);
              //   // Resume WebSocket updates even if there was an error
              //   setIsPaused(false);
              // }
            },
          }}
          icon={L.divIcon({
            className: "rounded-full flex items-center justify-center",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
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
              >
                <Tooltip direction="top" className="rounded-md">
                  <Typography className="my-0">{v.id}</Typography>
                </Tooltip>
              </NeonIcon>
            ),
          })}
        />
      ))}
    </div>
  );
};

export default TrafficlightMarkers;
