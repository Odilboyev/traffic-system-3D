import { useEffect, useRef } from "react";

import NeonIcon from "../../../../components/neonIcon";
import { Typography } from "@material-tailwind/react";
import { fixIncompleteJSON } from "./utils";
import { getNearbyTrafficLights } from "../../../../api/api.handlers";
import iconSelector from "./icons/iconSelector";
import maplibregl from "maplibre-gl";
import { renderToString } from "react-dom/server";
import useMapDataFetcher from "../../../../customHooks/useMapDataFetcher";
import useTrafficLightsFetcher from "../../../../hooks/useTrafficLightsFetcher";
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
  const markersRef = useRef(null);
  const { fetchTrafficLights } = useTrafficLightsFetcher(getNearbyTrafficLights);

  // Effect to manage markers
  useEffect(() => {
    if (!map || !trafficLights) return;

    console.log("Creating traffic light markers:", { trafficLights, map });

    // Create a Map to store marker references
    const markerRefs = new Map();

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

      // Store marker reference
      markerRefs.set(v.link_id, { marker, element: el, light: v });

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

    // Store marker refs in a ref to access them in other effects
    markersRef.current = markerRefs;

    // Cleanup function
    return () => {
      markerRefs.forEach(({ marker }) => marker.remove());
    };
  }, [map, isDraggable]); // Only recreate markers when map or draggable state changes

  // Effect to update marker visuals
  useEffect(() => {
    if (!markersRef.current || !trafficLights) return;

    trafficLights.forEach((light) => {
      const markerData = markersRef.current.get(light.link_id);
      if (markerData) {
        const { element } = markerData;
        // Update only the visual state
        const icon = renderToString(
          <NeonIcon
            isRounded={false}
            icon={
              light.type !== 100 &&
              iconSelector({
                type: light.type,
                status: light.status,
                style: { transform: `rotate(${light.rotate}deg)` },
              })
            }
            status={light.status === 1 ? 0 : light.status === 2 ? 2 : 1}
            text={light.type === 100 && (light.countdown || "0")}
          />
        );
        element.innerHTML = icon;
      }
    });
  }, [trafficLights, theme]);

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
            const update = data.channel.find((v) => v.id === light.id);
            if (update) {
              console.log("Updating light:", light.id, update); // Debug log
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

  // Effect to handle map move events
  useEffect(() => {
    if (!map) return;

    const handleMapMove = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      
      fetchTrafficLights(center, zoom).then(response => {
        if (response && response.data) {
          setTrafficLights(response.data);
        }
      });
    };

    map.on('moveend', handleMapMove);
    // Initial fetch
    handleMapMove();

    return () => {
      map.off('moveend', handleMapMove);
    };
  }, [map, fetchTrafficLights, setTrafficLights]);

  return null;
};

export default TrafficlightMarkers;
