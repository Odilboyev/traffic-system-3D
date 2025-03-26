import "./styles.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import MapLibreCameraDetails from "../../components/customPopup/MapLibreCameraDetails";
import PropTypes from "prop-types";
import Supercluster from "supercluster";
import { getCameraDetails } from "../../../../api/api.handlers";
import maplibregl from "maplibre-gl";
import { useMapMarkers } from "../../hooks/useMapMarkers";
import { useTranslation } from "react-i18next";

// Utility function for debouncing
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const PulsingMarkers = ({ map }) => {
  const { markers } = useMapMarkers();
  const { t } = useTranslation();
  const maxMarkers = 7;
  const markersRef = useRef([]);
  const superclusterRef = useRef(null);
  const fetchedDataMapRef = useRef(new Map());

  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);

  const isCamera = useCallback((type) => [1, 5, 6].includes(type), []);
  const cameraType = useCallback(
    (type) =>
      ({ 1: "cameratraffic", 5: "cameraview", 6: "camerapdd" }[type] || ""),
    []
  );

  const updateMarkerWithData = useCallback((marker, data) => {
    const updatedMarker = {
      ...marker,
      cameraData: data,
      lng: marker.lng?.toString() || "0",
      lat: marker.lat?.toString() || "0",
    };

    setSelectedMarkers((prev) => {
      const exists = prev.some(
        (m) => m.cid === marker.cid && m.type === marker.type
      );
      return exists
        ? prev.map((m) =>
            m.cid === marker.cid && m.type === marker.type ? updatedMarker : m
          )
        : [...prev, updatedMarker];
    });
  }, []);

  const fetchCameraDetails = useCallback(
    async (marker) => {
      if (!marker?.type || !isCamera(marker.type)) return;

      const markerKey = `${marker.type}-${marker.cid}`;
      if (fetchedDataMapRef.current.has(markerKey)) {
        updateMarkerWithData(marker, fetchedDataMapRef.current.get(markerKey));
        return;
      }

      try {
        const { data } = await getCameraDetails(
          cameraType(marker.type),
          String(marker.cid)
        );
        fetchedDataMapRef.current.set(markerKey, data);
        updateMarkerWithData(marker, data);
      } catch (error) {
        console.error("Error fetching camera details:", error);
      }
    },
    [cameraType, isCamera, updateMarkerWithData]
  );

  const createMarkerElement = useCallback(
    (marker, count = 1) => {
      const el = document.createElement("div");
      const container = document.createElement("div");
      const innerChild = document.createElement("div");
      const innerChildSecond = document.createElement("div");

      // Set marker data
      Object.assign(el.dataset, {
        cid: marker.cid,
        type: marker.type,
        lng: marker.lng,
        lat: marker.lat,
      });
      container.className =
        "relative flex w-[0.8vw] h-[0.8vw] justify-center items-center";

      // Set colors based on type
      const colors = isCamera(marker.type)
        ? marker.type === 1
          ? ["blue-400", "blue-500"]
          : marker.type === 5
          ? ["purple-400", "purple-500"]
          : ["orange-400", "orange-500"]
        : ["green-400", "green-500"];

      innerChild.className = `absolute inline-flex h-full w-full animate-ping rounded-full bg-${colors[0]} opacity-75`;
      innerChildSecond.className = `relative inline-flex w-[0.4vw] h-[0.4vw] rounded-full bg-${colors[1]} border border-white`;

      if (count > 1) {
        const countElement = document.createElement("div");
        countElement.className = "text-white text-xs font-bold";
        innerChildSecond.appendChild(countElement);
      }

      container.append(innerChildSecond, innerChild);
      el.appendChild(container);

      el.addEventListener("click", () => {
        if (isCamera(marker.type)) {
          setSelectedMarkers((prev) =>
            prev.some((m) => m.cid === marker.cid) ? prev : [...prev, marker]
          );
          fetchCameraDetails(marker);
        }
      });

      return el;
    },
    [isCamera, fetchCameraDetails]
  );
  // Utility function for distance calculation
  const calculateDistance = useCallback(
    (point, center) =>
      Math.hypot(
        parseFloat(point.lat) - center.lat,
        parseFloat(point.lng) - center.lng
      ),
    []
  );

  const updateMarkers = useCallback(() => {
    if (!map || !superclusterRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds = map.getBounds();
    const zoom = Math.floor(map.getZoom());
    const shouldAutoOpenPopups = map.getZoom() > 18;
    const center = map.getCenter();

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
        ? { type: 2, cid: `cluster-${cluster.id}` }
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

      marker.cid = cluster.properties.cid;
      markersRef.current.push(marker);

      if (
        shouldAutoOpenPopups &&
        !cluster.properties.cluster &&
        isCamera(cluster.properties.type)
      ) {
        const markerWithCoords = {
          ...cluster.properties,
          lng: String(lng),
          lat: String(lat),
          coordinates: [lng, lat],
        };

        setVisibleMarkers((prev) => {
          if (prev.some((m) => m.cid === markerWithCoords.cid)) return prev;

          const newMarkers = [...prev, markerWithCoords];
          const limited = newMarkers
            .sort(
              (a, b) =>
                calculateDistance(a, center) - calculateDistance(b, center)
            )
            .slice(0, maxMarkers);

          if (limited.some((m) => m.cid === markerWithCoords.cid)) {
            fetchCameraDetails(markerWithCoords);
          }

          return limited;
        });
      }
    });
  }, [
    map,
    createMarkerElement,
    isCamera,
    fetchCameraDetails,
    calculateDistance,
  ]);

  // Function to handle zoom changes and auto-open popups
  const handleZoomChange = useCallback(() => {
    if (!map) return;
    const currentZoom = map.getZoom();

    if (currentZoom <= 18) {
      setSelectedMarkers([]);
      setVisibleMarkers([]);
    } else {
      updateMarkers();
    }
  }, [map, updateMarkers]);

  useEffect(() => {
    if (!map || !markers) return;

    // Clear existing state
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    setSelectedMarkers([]);
    setVisibleMarkers([]);

    // Setup supercluster
    superclusterRef.current = new Supercluster({
      radius: 40,
      maxZoom: 16,
      minZoom: 0,
    });

    // Load valid points into supercluster
    superclusterRef.current.load(
      markers
        .filter((marker) => [1, 2, 5, 6].includes(marker.type))
        .map((marker) => {
          const [lng, lat] = [parseFloat(marker.lng), parseFloat(marker.lat)];
          return !isNaN(lng) && !isNaN(lat)
            ? {
                type: "Feature",
                properties: marker,
                geometry: { type: "Point", coordinates: [lng, lat] },
              }
            : null;
        })
        .filter(Boolean)
    );

    // Setup event handlers with debounce
    const debounced = debounce(updateMarkers, 300);
    map.on("zoom", handleZoomChange);
    map.on("moveend", debounced);
    map.on("zoomend", debounced);

    // Initial render
    updateMarkers();

    return () => {
      map.off("zoom", handleZoomChange);
      map.off("moveend", debounced);
      map.off("zoomend", debounced);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      setSelectedMarkers([]);
      setVisibleMarkers([]);
    };
  }, [map, markers, handleZoomChange, updateMarkers]);

  const handleClosePopup = useCallback((markerId) => {
    setSelectedMarkers((prev) => prev.filter((marker) => marker.cid !== markerId));
    setVisibleMarkers((prev) => prev.filter((marker) => marker.cid !== markerId));
  }, []);

  const renderPopup = useCallback((marker) => {
    if (!isCamera(marker.type) || !visibleMarkers.some((m) => m.cid === marker.cid)) {
      return null;
    }

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
  }, [isCamera, visibleMarkers, t, map, handleClosePopup]);

  const memoizedPopups = useMemo(
    () => map && selectedMarkers.map(renderPopup),
    [map, selectedMarkers, renderPopup]
  );

  return <>{memoizedPopups}</>;
};

PulsingMarkers.propTypes = {
  map: PropTypes.shape({
    getBounds: PropTypes.func.isRequired,
    getZoom: PropTypes.func.isRequired,
    getCenter: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired,
  }),
};

export default PulsingMarkers;
