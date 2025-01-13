import "maplibre-gl/dist/maplibre-gl.css";

import {
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
} from "@vis.gl/react-maplibre";
import { useCallback, useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import ThreeJsMarker from "../ThreeJsMarker";
import ProjectMarker from "../ProjectMarker";
import { darkLayer } from "./utils/darkLayer";
import { lightLayer } from "./utils/lightLayer";

// Map styles for light and dark modes
const MAP_STYLES = {
  light: lightLayer,
  dark: darkLayer,
};

// Layer configuration for the control panel
const LAYER_CONFIG = {
  buildings: {
    label: "Buildings",
    ids: ["building"],
  },
  roads: {
    label: "Roads",
    ids: ["highway", "road_major", "road_minor"],
  },
  water: {
    label: "Water",
    ids: ["water"],
  },
  landuse: {
    label: "Land Use",
    ids: ["landuse_residential"],
  },
  labels: {
    label: "Labels",
    ids: ["place_labels", "poi_labels"],
  },
};

// Theme Toggle Button Component
const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <div className="absolute top-2 right-2 z-10">
      <button
        onClick={onToggle}
        className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm text-gray-700">
          {isDark ? " Dark" : " Light"}
        </span>
      </button>
    </div>
  );
};

// Custom Layer Control Component
const LayerControl = ({ layers, toggleLayer }) => {
  return (
    <div className="absolute top-2 right-20 bg-white p-3 rounded-lg shadow-lg z-10">
      <h3 className="font-bold mb-2 text-gray-700">Layers</h3>
      <div className="space-y-2">
        {Object.entries(layers).map(([key, value]) => (
          <label
            key={key}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value.visible}
              onChange={() => toggleLayer(key)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              {LAYER_CONFIG[key].label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const MaplibreLayer = ({
  initialViewState = {
    longitude: 69.2401, // Centered on Tashkent
    latitude: 41.2995,
    zoom: 12,
    pitch: 45,
    bearing: 0,
  },
}) => {
  const mapInstanceRef = useRef(null);
  const [style, setStyle] = useState(null);
  const [viewState, setViewState] = useState(initialViewState);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentMapStyle, setCurrentMapStyle] = useState(MAP_STYLES.light);
  const [layers, setLayers] = useState(
    Object.keys(LAYER_CONFIG).reduce(
      (acc, key) => ({
        ...acc,
        [key]: { visible: true },
      }),
      {}
    )
  );

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    setCurrentMapStyle((prev) =>
      prev === MAP_STYLES.light ? MAP_STYLES.dark : MAP_STYLES.light
    );
  }, []);

  const toggleLayer = (layerKey) => {
    setLayers((prev) => {
      const newLayers = {
        ...prev,
        [layerKey]: { visible: !prev[layerKey].visible },
      };

      if (style) {
        const updatedStyle = {
          ...style,
          layers: style.layers.map((layer) => {
            const configGroup = Object.entries(LAYER_CONFIG).find(
              ([_, config]) => config.ids.some((id) => layer.id.includes(id))
            );

            if (configGroup) {
              const [groupKey] = configGroup;
              return {
                ...layer,
                layout: {
                  ...layer.layout,
                  visibility: newLayers[groupKey].visible ? "visible" : "none",
                },
              };
            }
            return layer;
          }),
        };
        setStyle(updatedStyle);
      }

      return newLayers;
    });
  };

  useEffect(() => {
    setStyle(currentMapStyle);
  }, [currentMapStyle]);

  const onMove = useCallback(({ viewState }) => {
    setViewState(viewState);
  }, []);

  if (!style) {
    return <div>Loading map style...</div>;
  }

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapInstanceRef}
        onLoad={(e) => {
          setStyle(e.target.getStyle());
        }}
        mapStyle={currentMapStyle}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />
        <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
        <LayerControl layers={layers} toggleLayer={toggleLayer} />
        <ThreeJsMarker longitude={69.2401} latitude={41.2995} />
        <ProjectMarker longitude={69.2501} latitude={41.3095} />
      </Map>
    </div>
  );
};

ThemeToggle.propTypes = {
  isDark: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

LayerControl.propTypes = {
  layers: PropTypes.object.isRequired,
  toggleLayer: PropTypes.func.isRequired,
};

MaplibreLayer.propTypes = {
  initialViewState: PropTypes.shape({
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    zoom: PropTypes.number,
    pitch: PropTypes.number,
    bearing: PropTypes.number,
  }),
};

export default MaplibreLayer;
