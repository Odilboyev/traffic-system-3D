import "./styles.css";

import { useEffect, useRef, useState } from "react";

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

  const cameraType = (type) => {
    switch (type) {
      case 1:
        return "cameratraffic";
      case 5:
        return "cameraview";
      case 6:
        return "camerapdd";
      default:
        return "";
    }
  };

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

        // Add to visible markers only if it doesn't already exist
        // This is crucial to prevent infinite loops
        setVisibleMarkers((prev) => {
          if (!prev.some((m) => m.cid === markerWithCoords.cid)) {
            // Only fetch camera details if this is a new marker
            fetchCameraDetails(markerWithCoords);
            return [...prev, markerWithCoords];
          }
          return prev;
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
      // Only update markers if we don't already have visible markers
      // This prevents infinite loops of marker creation
      if (visibleMarkers.length === 0) {
        updateMarkers();
      }

      // Limit the number of visible popups to avoid cluttering the screen
      // Only call this if we have markers to limit
      if (visibleMarkers.length > 0) {
        limitVisiblePopups();
      }
    }
  };

  // Function to limit the number of visible popups and ensure they're properly spaced
  const limitVisiblePopups = () => {
    if (!map || visibleMarkers.length === 0) return;

    const bounds = map.getBounds();
    const center = map.getCenter();
    const viewportWidth = map.getContainer().offsetWidth;
    const viewportHeight = map.getContainer().offsetHeight;

    // Maximum number of popups to show at once
    const maxPopups = 5;

    // Sort markers by distance to center of the screen
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

    // Estimate popup dimensions - these will be used to calculate required spacing
    // Actual dimensions will vary, but we need an estimate for initial positioning
    const estimatedPopupWidth = 280; // Average popup width in pixels
    const estimatedPopupHeight = 200; // Average popup height in pixels
    const minGap = 20; // Minimum gap between popups in pixels

    // Calculate optimal positions for these markers to avoid overlap
    const optimizedMarkers = limitedMarkers.map((marker, index) => {
      // For the first marker, keep its original position
      if (index === 0) return marker;

      // For subsequent markers, ensure they're not too close to previous markers
      const markerPoint = map.project([
        parseFloat(marker.lng),
        parseFloat(marker.lat),
      ]);

      // Check distance to all previous markers
      for (let i = 0; i < index; i++) {
        const prevMarker = optimizedMarkers[i];
        const prevPoint = map.project([
          parseFloat(prevMarker.lng),
          parseFloat(prevMarker.lat),
        ]);

        // Calculate center-to-center distance
        const dx = markerPoint.x - prevPoint.x;
        const dy = markerPoint.y - prevPoint.y;
        const centerDistance = Math.sqrt(dx * dx + dy * dy);

        // Calculate required distance based on estimated popup dimensions plus the minimum gap
        // This ensures popups don't overlap and have at least a small gap between them
        const requiredDistance = estimatedPopupWidth + minGap;

        // If markers are too close (would cause popups to overlap or be too close), adjust position
        if (centerDistance < requiredDistance) {
          // Calculate direction vector
          const angle = Math.atan2(dy, dx);

          // Calculate how much to move
          const moveDistance = requiredDistance - centerDistance + 10; // Add extra pixels to ensure gap

          // Move current marker away from previous marker
          const newX = markerPoint.x + Math.cos(angle) * moveDistance;
          const newY = markerPoint.y + Math.sin(angle) * moveDistance;

          // Ensure the new position is within viewport bounds with some padding
          const padding = 100; // Increased padding to keep popups more visible
          const boundedX = Math.max(
            padding,
            Math.min(newX, viewportWidth - padding)
          );
          const boundedY = Math.max(
            padding,
            Math.min(newY, viewportHeight - padding)
          );

          // Convert back to geographic coordinates
          const newLngLat = map.unproject([boundedX, boundedY]);

          // Update marker coordinates
          marker.lng = newLngLat.lng.toString();
          marker.lat = newLngLat.lat.toString();

          // Update the marker point for subsequent distance calculations
          markerPoint.x = boundedX;
          markerPoint.y = boundedY;
        }
      }

      return marker;
    });

    // Additional pass to ensure all popups are within the viewport
    const finalMarkers = optimizedMarkers.map((marker) => {
      const point = map.project([
        parseFloat(marker.lng),
        parseFloat(marker.lat),
      ]);

      // Check if the point is too close to the edge of the viewport
      const padding = 150; // Larger padding to account for popup size
      let needsAdjustment = false;
      let newX = point.x;
      let newY = point.y;

      if (point.x < padding) {
        newX = padding;
        needsAdjustment = true;
      } else if (point.x > viewportWidth - padding) {
        newX = viewportWidth - padding;
        needsAdjustment = true;
      }

      if (point.y < padding) {
        newY = padding;
        needsAdjustment = true;
      } else if (point.y > viewportHeight - padding) {
        newY = viewportHeight - padding;
        needsAdjustment = true;
      }

      if (needsAdjustment) {
        const newLngLat = map.unproject([newX, newY]);
        marker.lng = newLngLat.lng.toString();
        marker.lat = newLngLat.lat.toString();
      }

      return marker;
    });

    setVisibleMarkers(finalMarkers);
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

    // Optionally, also remove from visibleMarkers if you want to completely hide it
    // setVisibleMarkers(prev => prev.filter(marker => marker.cid !== markerId));

    console.log(`Closed popup for marker: ${markerId}`);
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

            // Get coordinates from the map for this marker
            const markerElement = markersRef.current.find(
              (m) => m.cid === marker.cid
            );

            let coordinates = [0, 0];
            if (markerElement) {
              coordinates = markerElement.getLngLat().toArray();
            }

            const markerWithCorrectCoords = {
              ...marker,
              lng: coordinates[0].toString(),
              lat: coordinates[1].toString(),
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
