import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef, useState } from "react";

import baseLayers from "../../../../configurations/mapLayers";
import maplibregl from "maplibre-gl";
import { useTheme } from "../../../../customHooks/useTheme";

const MapCore = ({ children, onMapLoad }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { currentLayer, show3DLayer } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return;

    const baseLayer = baseLayers.find((v) => v.name === currentLayer);

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: [baseLayer.url],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "base-layer",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [69.2401, 41.2995], // Tashkent coordinates
      zoom: 12,
      minZoom: 5,
      maxZoom: 22,
      pitch: show3DLayer ? 45 : 0,
      minPitch: 0,
      maxPitch: 60,
      antialias: true,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
      if (onMapLoad) onMapLoad(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle layer changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const baseLayer = baseLayers.find((v) => v.name === currentLayer);
    if (!baseLayer) return;

    const source = map.current.getSource("raster-tiles");
    if (source) {
      source.setTiles([baseLayer.url]);
    }
  }, [currentLayer, mapLoaded]);

  // Handle 3D mode
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    map.current.easeTo({
      pitch: show3DLayer ? 45 : 0,
      duration: 300,
    });
  }, [show3DLayer, mapLoaded]);

  return (
    <div ref={mapContainer} style={{ width: "100%", height: "100%" }}>
      {mapLoaded && children}
    </div>
  );
};

export default MapCore;
