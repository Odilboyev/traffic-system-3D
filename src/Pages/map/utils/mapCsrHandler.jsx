import L from "leaflet";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const LOCALSTORAGE_CSR_KEY = "its_mapCsrLayer";

const MapCRSHandler = ({ currentLayer }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      // Retrieve or set initial CSR
      const storedLayer = localStorage.getItem(LOCALSTORAGE_CSR_KEY);
      const layerToUse = currentLayer || storedLayer || "default";

      // Determine CRS based on layer
      const crs = layerToUse.includes("Yandex")
        ? L.CRS.EPSG3395
        : L.CRS.EPSG3857;

      // Store the current layer in localStorage
      localStorage.setItem(LOCALSTORAGE_CSR_KEY, layerToUse);

      // Set map CRS
      map.options.crs = crs;

      const center = map.getCenter();
      const zoom = map.getZoom();

      map.invalidateSize();

      setTimeout(() => {
        map.setView(center, zoom, { animate: false });
      }, 100);
    }
  }, [currentLayer, map]);

  return null;
};

MapCRSHandler.propTypes = {
  currentLayer: PropTypes.string,
};

export default MapCRSHandler;
