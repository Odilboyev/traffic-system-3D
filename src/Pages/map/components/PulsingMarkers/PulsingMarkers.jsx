import "./styles.css";

import { useCallback, useEffect, useRef, useState } from "react";

import MapLibreCameraDetails from "../../components/customPopup/MapLibreCameraDetails";
import Supercluster from "supercluster";
import { getCameraDetails } from "../../../../api/api.handlers";
import maplibregl from "maplibre-gl";
import { useMapMarkers } from "../../hooks/useMapMarkers";
import { useTranslation } from "react-i18next";

const PulsingMarkers = ({ map }) => {
  const { markers } = useMapMarkers();

  const markersRef = useRef([]);
  const superclusterRef = useRef(null);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [cameraData, setCameraData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchedDataMapRef = useRef(new Map()); // Store fetched data
  const { t } = useTranslation();

  const isCamera = (type) => type === 1 || type === 5 || type === 6;

  const cameraType = useCallback(
    (type) =>
      ({
        1: "cameratraffic",
        5: "cameraview",
        6: "camerapdd",
      }[type] || ""),
    []
  );
  const fetchCameraDetails = async (marker) => {
    if (!marker || !isCamera(marker.type)) return;

    const markerKey = `${marker.type}-${marker.cid}`;
    if (fetchedDataMapRef.current.has(markerKey)) {
      // Update the marker with cached data
      const cachedData = fetchedDataMapRef.current.get(markerKey);
      updateMarkerWithData(marker, cachedData);
      return;
    }

    setIsLoading(true);
    try {
      const res = await getCameraDetails(
        cameraType(marker.type),
        marker.cid + ""
      );
      fetchedDataMapRef.current.set(markerKey, res.data); // Cache data
      updateMarkerWithData(marker, res.data);
    } catch (error) {
      console.error("Error fetching camera details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMarkerWithData = (marker, data) => {
    // Create a new marker object with the data
    const updatedMarker = {
      ...marker,
      cameraData: data,
      isLoading: false,
      // Ensure coordinates are included and in the correct format
      lng: marker.lng ? marker.lng.toString() : "0",
      lat: marker.lat ? marker.lat.toString() : "0",
    };

    // Update the selected markers list
    setSelectedMarkers((prev) => {
      // Check if the marker already exists in the array
      const markerExists = prev.some(
        (m) => m.cid === marker.cid && m.type === marker.type
      );

      if (markerExists) {
        // If it exists, update it in place
        return prev.map((m) => {
          if (m.cid === marker.cid && m.type === marker.type) {
            return updatedMarker;
          }
          return m;
        });
      } else {
        // If it doesn't exist, add it to the array
        return [...prev, updatedMarker];
      }
    });
  };

  const createMarkerElement = (marker, count = 1) => {
    const el = document.createElement("div");
    const container = document.createElement("div");
    const innerChild = document.createElement("div");
    const innerChildSecond = document.createElement("div");
    const countElement = count > 1 ? document.createElement("div") : null;

    // Set data attributes to identify the marker
    el.dataset.cid = marker.cid;
    el.dataset.type = marker.type;
    el.dataset.lng = marker.lng;
    el.dataset.lat = marker.lat;

    container.className =
      "relative flex w-[0.8vw] h-[0.8vw] justify-center items-center";

    // Different colors for different camera types
    let bgColor = "bg-green-400";
    let bgColorSolid = "bg-green-500";

    if (isCamera(marker.type)) {
      if (marker.type === 1) {
        bgColor = "bg-blue-400";
        bgColorSolid = "bg-blue-500";
      } else if (marker.type === 5) {
        bgColor = "bg-purple-400";
        bgColorSolid = "bg-purple-500";
      } else if (marker.type === 6) {
        bgColor = "bg-orange-400";
        bgColorSolid = "bg-orange-500";
      }
    }

    innerChild.className = `absolute inline-flex h-full w-full animate-ping rounded-full ${bgColor} opacity-75`;

    innerChildSecond.className = `relative inline-flex w-[0.4vw] h-[0.4vw] rounded-full ${bgColorSolid} border border-white`;

    if (count > 1) {
      countElement.className = "text-white text-xs font-bold";
      // countElement.textContent = count;
      innerChildSecond.appendChild(countElement);
    }

    container.appendChild(innerChildSecond);
    container.appendChild(innerChild);
    el.appendChild(container);

    // Add click event listener
    el.addEventListener("click", () => {
      if (isCamera(marker.type)) {
        // Add the marker to the existing selectedMarkers array instead of replacing it
        setSelectedMarkers((prev) => {
          // Check if this marker is already in the array
          const markerExists = prev.some((m) => m.cid === marker.cid);
          if (markerExists) {
            // If it exists, don't add it again
            return prev;
          }
          // Add the new marker to the array
          return [...prev, marker];
        });
        fetchCameraDetails(marker);
      }
    });

    return el;
  };

  const updateMarkers = () => {
    if (!map || !superclusterRef.current) return;

    // Clean up existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds = map.getBounds();
    const zoom = Math.floor(map.getZoom());
    const currentZoom = map.getZoom();

    // Check if we should auto-open camera popups (zoom > 19)
    const shouldAutoOpenPopups = currentZoom > 18;

    const clusters = superclusterRef.current.getClusters(
      [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ],
      zoom
    );

    clusters.forEach((cluster) => {
      const [lng, lat] = cluster.geometry.coordinates;

      const markerObj = cluster.properties.cluster
        ? { type: 2, cid: `cluster-${cluster.id}` } // Default to type 2 for clusters
        : cluster.properties;

      const el = createMarkerElement(
        markerObj,
        cluster.properties.cluster ? cluster.properties.point_count : 1
      );

      const marker = new maplibregl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([lng, lat])
        .addTo(map);

      // Store marker cid directly on the marker object for easier reference
      marker.cid = cluster.properties.cid;

      markersRef.current.push(marker);

      // Auto-open camera popups when zoom level > 19
      if (
        shouldAutoOpenPopups &&
        !cluster.properties.cluster &&
        isCamera(cluster.properties.type)
      ) {
        // Create a marker object with the correct coordinates from the cluster
        const markerWithCoords = {
          ...cluster.properties,
          lng: lng.toString(), // Ensure coordinates are in the expected format
          lat: lat.toString(),
          coordinates: [lng, lat], // Store original coordinates array for reference
        };

        // Collect all potential visible markers first, then apply limit
        setVisibleMarkers((prev) => {
          if (prev.some((m) => m.cid === markerWithCoords.cid)) {
            return prev;
          }
          
          // Add the new marker
          const newMarkers = [...prev, markerWithCoords];
          
          // Sort by distance to center and limit
          const center = map.getCenter();
          const sorted = newMarkers.sort((a, b) => {
            const distA = Math.sqrt(
              Math.pow(parseFloat(a.lat) - center.lat, 2) +
              Math.pow(parseFloat(a.lng) - center.lng, 2)
            );
            const distB = Math.sqrt(
              Math.pow(parseFloat(b.lat) - center.lat, 2) +
              Math.pow(parseFloat(b.lng) - center.lng, 2)
            );
            return distA - distB;
          });

          // Keep only the closest markers up to maxPopups
          const limited = sorted.slice(0, 5);
          
          // Fetch details only if the marker made it into the limited set
          if (limited.some(m => m.cid === markerWithCoords.cid)) {
            fetchCameraDetails(markerWithCoords);
          }
          
          return limited;
        });
      }
    });
  };

  // Function to handle zoom changes and auto-open popups
  const handleZoomChange = () => {
    if (!map) return;

    const currentZoom = map.getZoom();

    // If zoom level drops below 19, close any open popups
    if (currentZoom <= 18) {
      setSelectedMarkers([]);
      setVisibleMarkers([]);
    } else {
      // Always enforce the popup limit when zoom level is appropriate
      limitVisiblePopups();
    }
  };

  // Function to limit the number of visible popups
  const limitVisiblePopups = () => {
    if (!map || visibleMarkers.length === 0) return;

    // Maximum number of popups to show at once
    const maxPopups = 5;

    // Sort markers by distance to center of the screen
    const center = map.getCenter();
    const sortedMarkers = [...visibleMarkers].sort((a, b) => {
      const distA = Math.sqrt(
        Math.pow(parseFloat(a.lat) - center.lat, 2) +
          Math.pow(parseFloat(a.lng) - center.lng, 2)
      );
      const distB = Math.sqrt(
        Math.pow(parseFloat(b.lat) - center.lat, 2) +
          Math.pow(parseFloat(b.lng) - center.lng, 2)
      );
      return distA - distB;
    });

    // Keep only the closest markers up to maxPopups
    const limitedMarkers = sortedMarkers.slice(0, maxPopups);
    
    // Update both visible markers and selected markers to enforce the limit
    setVisibleMarkers(limitedMarkers);
    setSelectedMarkers(prev => {
      // Only keep selected markers that are in the limited set
      const limitedIds = new Set(limitedMarkers.map(m => m.cid));
      return prev.filter(m => limitedIds.has(m.cid));
    });
  };

  useEffect(() => {
    if (!map || !markers) return;

    // Clear existing markers and popups to prevent duplicates
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    setSelectedMarkers([]);
    setVisibleMarkers([]);

    // Add zoom change listener
    map.on("zoom", handleZoomChange);

    // Filter and prepare markers
    // Include type 1, 2, 5, and 6 markers
    const filteredMarkers = markers.filter(
      (marker) =>
        marker.type === 1 ||
        marker.type === 2 ||
        marker.type === 5 ||
        marker.type === 6
    );

    // Initialize supercluster
    superclusterRef.current = new Supercluster({
      radius: 40,
      maxZoom: 16,
      minZoom: 0,
    });

    // Add points to supercluster
    const points = filteredMarkers
      .map((marker) => {
        const lng = parseFloat(marker.lng);
        const lat = parseFloat(marker.lat);

        if (isNaN(lng) || isNaN(lat)) {
          console.warn(
            `Invalid coordinates for marker ${marker.cid}: [${marker.lng}, ${marker.lat}]`
          );
          return null;
        }

        return {
          type: "Feature",
          properties: { ...marker },
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };
      })
      .filter((point) => point !== null);

    superclusterRef.current.load(points);

    // Initial render of markers
    updateMarkers();

    // Use a debounced version of updateMarkers for map events to prevent too many updates
    let updateTimeout;
    const debouncedUpdate = () => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        updateMarkers();
      }, 300); // 300ms debounce
    };

    // Add event listeners for map movement
    map.on("moveend", debouncedUpdate);
    map.on("zoomend", debouncedUpdate);

    return () => {
      clearTimeout(updateTimeout);
      map.off("moveend", debouncedUpdate);
      map.off("zoomend", debouncedUpdate);
      map.off("zoom", handleZoomChange);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      setSelectedMarkers([]);
      setVisibleMarkers([]);
    };
  }, [map, markers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, []);

  // Function to handle closing a popup
  const handleClosePopup = (markerId) => {
    // Remove the marker from selectedMarkers to close its popup
    setSelectedMarkers((prev) =>
      prev.filter((marker) => marker.cid !== markerId)
    );
  };

  return (
    <>
      {map &&
        selectedMarkers.map((marker) => {
          if (
            isCamera(marker.type) &&
            visibleMarkers.some((m) => m.cid === marker.cid)
          ) {
            // Find the visible marker with the correct coordinates
            const visibleMarker = visibleMarkers.find(
              (m) => m.cid === marker.cid
            );

            const markerWithCorrectCoords = {
              ...marker,
              lng: marker.popup_lng?.toString() || marker.lng,
              lat: marker.popup_lat?.toString() || marker.lat,
            };

            return (
              <MapLibreCameraDetails
                key={`camera-popup-${marker.cid}`}
                marker={markerWithCorrectCoords}
                t={t}
                isLoading={marker.isLoading || false}
                cameraData={marker.cameraData}
                isPTZ={marker.type === 5}
                map={map}
                onClose={handleClosePopup}
              />
            );
          }
          return null;
        })}
    </>
  );
};

export default PulsingMarkers;
