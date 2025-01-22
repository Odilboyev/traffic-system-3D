import NeonIcon from "../../../../components/neonIcon";
import { Typography } from "@material-tailwind/react";
import { fixIncompleteJSON } from "./utils";
import { getNearbyTrafficLights } from "../../../../api/api.handlers";
import iconSelector from "./icons/iconSelector";
import maplibregl from "maplibre-gl";
import { renderToString } from "react-dom/server";
import { useEffect } from "react";
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";
import { useSelector } from "react-redux";

const TrafficlightMarkers = ({
  trafficLights,
  isPaused,
  setTrafficLights,
  setCurrentSvetoforId,
  setVendor,
  setTrafficSocket,
  currentSvetoforId,
  clearTrafficLights,
  updateTrafficLights,
  handleMarkerDragEnd,
  trafficSocket,
  setIsPaused,
  map,
  theme,
}) => {
  const isDraggable = useSelector((state) => state.map.isDraggable);

  // Effect to manage markers
  useEffect(() => {
    if (!map || !trafficLights) return;

    console.log("Creating traffic light markers:", { trafficLights, map });

    // Remove existing markers
    const existingMarkers = document.getElementsByClassName(
      "traffic-light-marker"
    );
    Array.from(existingMarkers).forEach((marker) => marker.remove());

    // Add new markers
    trafficLights.forEach((v) => {
      // Create marker element
      const el = document.createElement("div");
      el.className =
        "traffic-light-marker rounded-full flex items-center justify-center";
      el.style.width = "30px";
      el.style.height = "30px";

      // Create icon element
      const icon = renderToString(
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
      );
      el.innerHTML = icon;

      // Create and add marker
      const marker = new maplibregl.Marker({
        element: el,
        draggable: isDraggable,
        anchor: "center",
        pitchAlignment: v.type !== 100 ? "map" : "viewpoint",
        rotationAlignment: v.type !== 100 ? "map" : "viewpoint",
      })
        .setLngLat([v.lng, v.lat])
        .addTo(map);

      // Add click event
      el.addEventListener("click", () => {
        setIsPaused(true);
        setCurrentSvetoforId(v.svetofor_id);
        setVendor(v.vendor || 1);
      });

      // Add drag events if draggable
      if (isDraggable) {
        marker.on("dragstart", () => {
          setIsPaused(true);
        });

        marker.on("dragend", async () => {
          const lngLat = marker.getLngLat();
          setIsPaused(false);

          setTrafficLights((prevLights) =>
            prevLights.map((light) =>
              light.id === v.id
                ? { ...light, lat: lngLat.lat, lng: lngLat.lng }
                : light
            )
          );

          try {
            await handleMarkerDragEnd(
              v.id,
              7,
              { target: { getLatLng: () => lngLat } },
              +v.svetofor_id
            );
          } catch (error) {
            console.error("Error during dragend:", error);
            // Refetch traffic lights on error
            await fetchTrafficLights({
              lat: lngLat.lat.toString(),
              lng: lngLat.lng.toString(),
              zoom: 20,
            });
          }
        });
      }
    });
  }, [trafficLights, map, isDraggable, theme]);

  // Effect for socket connection and updates
  useEffect(() => {
    if (!trafficSocket || !trafficLights || isPaused) return;

    const handleSocketUpdate = (event) => {
      let message = event.data;
      message = fixIncompleteJSON(message);
      try {
        const data = JSON.parse(message);
        if (data && data.channel) {
          const updatedLights = trafficLights.map((light) => {
            const update = data.channel.find((v) => v.id === light.link_id);
            if (update) {
              return {
                ...light,
                status: update.type === 100 ? light.status : update.status,
                countdown: update.countdown,
              };
            }
            return light;
          });
          setTrafficLights(updatedLights);
        }
      } catch (error) {
        console.error("Socket message parsing error:", error);
      }
    };

    trafficSocket.addEventListener("message", handleSocketUpdate);

    return () => {
      trafficSocket.removeEventListener("message", handleSocketUpdate);
    };
  }, [trafficSocket, trafficLights, isPaused]);

  // Fetching function passed to custom hook
  const fetchTrafficLights = async (body) => {
    try {
      const response = await getNearbyTrafficLights(body);
      console.log("Fetch response:", response);
      console.log("Traffic lights data structure:", response.data?.[0]);

      setVendor(Number(response.vendor_id) || response.vendor_id);
      if (response.status === "error") {
        console.error(response.message);
        clearTrafficLights();
        return;
      }

      setTrafficLights(response.data);

      if (currentSvetoforId !== response.svetofor_id) {
        console.log("Setting new svetofor_id:", response.svetofor_id);
        setCurrentSvetoforId(response.svetofor_id);
      }

      return { ...response, data: response.data };
    } catch (error) {
      console.error("Error fetching traffic lights:", error);
      clearTrafficLights();
    }
  };

  // Use the custom hook with adjusted settings
  useMapDataFetcher({
    use: true,
    fetchData: fetchTrafficLights,
    onClearData: () => {
      // Only clear traffic lights if zoom is too low
      const zoom = map?.getZoom();
      if (zoom < 13) {
        clearTrafficLights();
      }
    },
    onNewData: (data) => {
      if (data?.data) {
        // Update traffic lights without affecting socket connection
        setTrafficLights((prevLights) => {
          const newLights = data.data;
          // Preserve existing lights that are still in view
          const existingLights = prevLights.filter((light) =>
            newLights.some((newLight) => newLight.id === light.id)
          );
          // Add new lights that weren't there before
          const brandNewLights = newLights.filter(
            (newLight) => !prevLights.some((light) => light.id === newLight.id)
          );
          return [...existingLights, ...brandNewLights];
        });
      }
    },
    minZoom: 13,
    fetchDistanceThreshold: 500, // Set to exactly 500 meters
  });

  return null;
};

export default TrafficlightMarkers;
