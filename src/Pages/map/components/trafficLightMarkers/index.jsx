import NeonIcon from "../../../../components/neonIcon";
import { Typography } from "@material-tailwind/react";
import { getNearbyTrafficLights } from "../../../../api/api.handlers";
import iconSelector from "./icons/iconSelector";
import maplibregl from "maplibre-gl";
import { renderToString } from "react-dom/server";
import { useEffect } from "react";
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";
import { useSelector } from "react-redux";

const TrafficlightMarkers = ({
  trafficLights,
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
}) => {
  const isDraggable = useSelector((state) => state.map.isDraggable);

  useEffect(() => {
    if (!map || !trafficLights) return;

    console.log("Creating traffic light markers:", { trafficLights, map });

    // Remove existing markers
    const existingMarkers = document.getElementsByClassName(
      "traffic-light-marker"
    );
    Array.from(existingMarkers).forEach((marker) => marker.remove());

    // Calculate marker size based on zoom level
    const zoom = map.getZoom();
    const baseSize = 30; // Base size in pixels
    const sizeMultiplier = Math.max(0.5, Math.min(1.5, zoom / 15)); // Scale between 0.5x and 1.5x based on zoom
    const markerSize = Math.round(baseSize * sizeMultiplier);

    // Add new markers
    trafficLights.forEach((light) => {
      console.log("Creating marker for light:", light);

      // Create marker element
      const el = document.createElement("div");
      el.className = "traffic-light-marker";
      el.style.width = `${markerSize}px`;
      el.style.height = `${markerSize}px`;

      // Create icon element
      const icon = renderToString(
        <div className="rounded-full flex items-center justify-center">
          <NeonIcon
            icon={iconSelector({
              type: light.type,
              status: light.status,
              style: { transform: `rotate(${light.rotate}deg)` },
            })}
            status={light.status === 1 ? 0 : light.status === 2 ? 2 : 1}
            text={light.type === 100 && (light.countdown || "0")}
            // className={`w-full h-full ${
            //   currentSvetoforId === light.svetofor_id
            //     ? "text-green-500"
            //     : "text-gray-500"
            // }`}
          />
        </div>
      );
      el.innerHTML = icon;

      // Get coordinates
      const coordinates = [
        parseFloat(light.longitude || light.lng),
        parseFloat(light.latitude || light.lat),
      ];

      console.log("Marker coordinates:", coordinates);

      // Create and add marker
      const marker = new maplibregl.Marker({
        element: el,
        draggable: isDraggable,
        anchor: "center",
        rotation: light.rotate || 0,
      })
        .setLngLat(coordinates)
        .addTo(map);

      // Add drag events if draggable
      if (isDraggable) {
        marker.on("dragend", () => {
          const lngLat = marker.getLngLat();
          handleMarkerDragEnd(light.svetofor_id, lngLat.lng, lngLat.lat);
        });
      }

      // Add click event
      el.addEventListener("click", () => {
        setCurrentSvetoforId(light.svetofor_id);
        setIsPaused(false);
      });
    });
  }, [trafficLights, map, currentSvetoforId, isDraggable]);

  // Fetching function passed to custom hook
  const fetchTrafficLights = async (body) => {
    try {
      const response = await getNearbyTrafficLights(body);
      console.log("Fetch response:", response);

      setVendor(Number(response.vendor_id) || response.vendor_id);
      if (response.status === "error") {
        console.error(response.message);
        clearTrafficLights(); // This will handle socket cleanup
        return;
      }

      // Set new traffic lights data
      setTrafficLights(response.data);

      // Only update svetofor_id if it's different
      if (currentSvetoforId !== response.svetofor_id) {
        console.log("Setting new svetofor_id:", response.svetofor_id);
        setCurrentSvetoforId(response.svetofor_id);
      }
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

  return null;
};

export default TrafficlightMarkers;
