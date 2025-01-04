import "@maplibre/maplibre-gl-leaflet";
import "maplibre-gl/dist/maplibre-gl.css";

import * as maplibregl from "maplibre-gl";

import { useCallback, useEffect, useRef } from "react";

import L from "leaflet";
import baseLayers from "../../../../configurations/mapLayers";
import { useMap } from "react-leaflet";
import { useMapMarkers } from "../../hooks/useMapMarkers";
import { useTheme } from "../../../../customHooks/useTheme";

const MapLibreLayer = () => {
  const map = useMap();
  const { show3DLayer, currentLayer } = useTheme();
  const { markers } = useMapMarkers();
  const maplibreLayerRef = useRef(null);
  const maplibreMarkersRef = useRef(new Map());
  const baseLayer = baseLayers.find((v) => v.name === currentLayer);

  const createMapLibreMarker = useCallback((leafletMarker, maplibreMap) => {
    const markerInstance = leafletMarker._leaflet_events?.click?.[0]?.ctx;
    if (!markerInstance) return null;

    const latlng = markerInstance.getLatLng();

    // Create marker element
    const el = document.createElement("div");
    el.className = "maplibre-marker-3d";

    // Copy styles from Leaflet marker
    const markerIcon = leafletMarker.querySelector("img") || leafletMarker;
    el.style.width = markerIcon.style.width || "24px";
    el.style.height = markerIcon.style.height || "24px";

    // Create marker icon
    const iconImg = document.createElement("div");
    iconImg.className = "marker-icon";
    iconImg.style.backgroundImage =
      markerIcon.style.backgroundImage || `url(${markerIcon.src})`;
    iconImg.style.backgroundSize = "contain";
    iconImg.style.backgroundRepeat = "no-repeat";
    iconImg.style.width = "100%";
    iconImg.style.height = "100%";

    el.appendChild(iconImg);

    // Create and configure MapLibre marker
    const marker = new maplibregl.Marker({
      element: el,
      rotationAlignment: "viewport",
      pitchAlignment: "viewport",
      anchor: "center",
      offset: [0, 0],
    })
      .setLngLat([latlng.lng, latlng.lat])
      .addTo(maplibreMap);

    // Add click handler
    el.addEventListener("click", () => {
      if (markerInstance.options.eventHandlers?.click) {
        markerInstance.options.eventHandlers.click();
      }
    });

    return marker;
  }, []);

  const convertToMapLibreMarkers = useCallback(() => {
    if (!maplibreLayerRef.current || !show3DLayer) return;

    const maplibreMap = maplibreLayerRef.current.getMaplibreMap();
    const leafletMarkers = document.querySelectorAll(".leaflet-marker-icon");

    // Remove existing MapLibre markers
    maplibreMarkersRef.current.forEach((marker) => marker.remove());
    maplibreMarkersRef.current.clear();

    // Hide all Leaflet markers
    leafletMarkers.forEach((leafletMarker) => {
      const markerInstance = leafletMarker._leaflet_events?.click?.[0]?.ctx;
      if (!markerInstance) return;

      // Hide Leaflet marker
      leafletMarker.style.visibility = "hidden";
      const parentNode = leafletMarker.parentNode;
      if (parentNode) {
        parentNode.style.visibility = "hidden";
      }

      // Create and store MapLibre marker
      const maplibreMarker = createMapLibreMarker(leafletMarker, maplibreMap);
      if (maplibreMarker) {
        maplibreMarkersRef.current.set(
          markerInstance._leaflet_id,
          maplibreMarker
        );
      }
    });
  }, [show3DLayer, createMapLibreMarker]);

  const restoreLeafletMarkers = useCallback(() => {
    const leafletMarkers = document.querySelectorAll(".leaflet-marker-icon");
    leafletMarkers.forEach((marker) => {
      marker.style.visibility = "visible";
      const parentNode = marker.parentNode;
      if (parentNode) {
        parentNode.style.visibility = "visible";
      }
    });

    // Remove MapLibre markers
    maplibreMarkersRef.current.forEach((marker) => marker.remove());
    maplibreMarkersRef.current.clear();
  }, []);

  useEffect(() => {
    const initializeMapLibre = () => {
      // Clean up existing layer if it exists
      if (maplibreLayerRef.current) {
        map.removeLayer(maplibreLayerRef.current);
        maplibreLayerRef.current = null;
      }

      if (!show3DLayer) return;

      // Determine CRS based on current layer
      const crs = currentLayer.includes("Yandex")
        ? L.CRS.EPSG3395
        : L.CRS.EPSG3857;

      // Create MapLibre GL layer
      maplibreLayerRef.current = L.maplibreGL({
        style: {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: [baseLayer.url.replace("{s}", "a")],
              tileSize: 256,
              attribution:
                baseLayer.attribution || " OpenStreetMap contributors",
              maxzoom: baseLayer.maxNativeZoom,
            },
          },
          layers: [
            {
              id: "raster-tiles",
              type: "raster",
              source: "raster-tiles",
              minzoom: 0,
              maxzoom: baseLayer.maxNativeZoom,
            },
          ],
        },
        pitch: 45,
        bearing: 0,
        antialias: true,
      });

      // Set the CRS before adding the layer
      map.options.crs = crs;

      // Add the layer to the map
      maplibreLayerRef.current.addTo(map);

      const maplibreMap = maplibreLayerRef.current.getMaplibreMap();

      // Get current state
      const center = map.getCenter();
      const zoom = map.getZoom();

      // Force a map redraw
      map.invalidateSize({ animate: false });

      // Reset view and set initial pitch after the map is loaded
      maplibreMap.on("load", () => {
        map.setView(center, zoom, { animate: false });
        if (show3DLayer) {
          maplibreMap.setPitch(45);
          maplibreMap.setBearing(0);
          convertToMapLibreMarkers();
        }
      });

      // Add keyboard controls for pitch and bearing
      const handleKeyDown = (e) => {
        if (!show3DLayer) return;

        const pitch = maplibreMap.getPitch();
        const bearing = maplibreMap.getBearing();

        switch (e.key) {
          case "ArrowUp":
            maplibreMap.setPitch(Math.min(pitch + 5, 60));
            break;
          case "ArrowDown":
            maplibreMap.setPitch(Math.max(pitch - 5, 0));
            break;
          case "ArrowLeft":
            maplibreMap.setBearing(bearing - 15);
            break;
          case "ArrowRight":
            maplibreMap.setBearing(bearing + 15);
            break;
          default:
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      // Handle 3D mode changes
      if (show3DLayer) {
        convertToMapLibreMarkers();
      } else {
        restoreLeafletMarkers();
      }

      // Maintain minimum pitch during map movement
      maplibreMap.on("moveend", () => {
        if (show3DLayer && maplibreMap.getPitch() < 30) {
          maplibreMap.setPitch(30);
        }
      });

      return () => {
        if (maplibreLayerRef.current) {
          const maplibreMap = maplibreLayerRef.current.getMaplibreMap();
          if (maplibreMap) {
            maplibreMap.off("moveend");
            maplibreMap.off("move");
            document.removeEventListener("keydown", handleKeyDown);
          }
          restoreLeafletMarkers();
          map.removeLayer(maplibreLayerRef.current);
          maplibreLayerRef.current = null;
        }
      };
    };

    // Initialize or cleanup based on show3DLayer
    if (map) {
      map.whenReady(() => {
        requestAnimationFrame(initializeMapLibre);
      });
    }
  }, [
    map,
    show3DLayer,
    currentLayer,
    baseLayer,
    convertToMapLibreMarkers,
    restoreLeafletMarkers,
  ]);

  return null;
};

export default MapLibreLayer;
