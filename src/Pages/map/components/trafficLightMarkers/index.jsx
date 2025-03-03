import { useEffect, useRef } from "react";

import NeonIcon from "../../../../components/neonIcon";
import { fixIncompleteJSON } from "./utils";
import { getNearbyTrafficLights } from "../../../../api/api.handlers";
import iconSelector from "./icons/iconSelector";
import maplibregl from "maplibre-gl";
import { renderToString } from "react-dom/server";
import { useSelector } from "react-redux";
import useTrafficLightsFetcher from "../../../../hooks/useTrafficLightsFetcher";

const TrafficlightMarkers = ({
  trafficLights,
  isPaused,
  setTrafficLights,
  setCurrentSvetoforId,
  setVendor,
  trafficSocket,
  setIsPaused,
  map,
  theme,
  handleMarkerDragEnd,
}) => {
  const isDraggable = useSelector((state) => state.map.isDraggable);
  const markersRef = useRef(null);
  const { fetchTrafficLights } = useTrafficLightsFetcher(
    getNearbyTrafficLights
  );

  // Effect to manage markers
  useEffect(() => {
    if (!map || !trafficLights?.length) return;

    const markerRefs = new Map();
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
      el.setAttribute("data-light-id", v.id);
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
              countdown: v.countdown,
              style: v.type == 2 && { transform: `rotate(${v.rotate}deg)` },
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
        anchor: v.type == 2 ? "center" : "bottom",
        pitchAlignment: v.type == 2 ? "map" : "viewpoint",
        rotationAlignment: v.type == 2 ? "map" : "viewpoint",
      })
        .setLngLat([v.lng, v.lat])
        .addTo(map);

      // Store marker reference
      markerRefs.set(v.link_id, { marker, element: el, light: v });

      // Add click event
      el.addEventListener("click", () => {
        setIsPaused(true);
        setCurrentSvetoforId(v.svetofor_id);
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
    // Store marker refs in a ref to access them in other effects
    markersRef.current = markerRefs;

    // Cleanup function
    return () => {
      const existingMarkers = document.getElementsByClassName(
        "traffic-light-marker"
      );
      Array.from(existingMarkers).forEach((marker) => marker.remove());
    };
  }, [
    map,
    trafficLights,
    isDraggable,
    setIsPaused,
    setCurrentSvetoforId,
    setVendor,
    setTrafficLights,
    handleMarkerDragEnd,
    fetchTrafficLights,
  ]);

  // Effect to handle map move events
  useEffect(() => {
    if (!map) return;

    const handleMapMove = async () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const response = await fetchTrafficLights(center, zoom);

      if (response?.data) {
        setTrafficLights(response.data);
      }
    };

    map.on("moveend", handleMapMove);
    handleMapMove(); // Initial fetch

    return () => map.off("moveend", handleMapMove);
  }, [map, fetchTrafficLights, setTrafficLights]);

  return null;
};

export default TrafficlightMarkers;
