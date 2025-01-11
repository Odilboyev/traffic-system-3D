import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useTheme } from "../../../../customHooks/useTheme";
import baseLayers from "../../../../configurations/mapLayers";
import { createRoot } from "react-dom/client";

const createMarkerElement = (type, status) => {
  const el = document.createElement('div');
  el.className = 'marker-container';
  
  // Create marker content similar to the old implementation
  const markerContent = document.createElement('div');
  markerContent.className = `marker-content ${status === "online" ? "online" : "offline"}`;
  
  // Add icon based on type
  const icon = document.createElement('div');
  icon.className = `marker-icon ${type}`;
  
  markerContent.appendChild(icon);
  el.appendChild(markerContent);
  
  return el;
};

const MapLibreLayer = ({ markers = [], onMarkerClick }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const { show3DLayer, currentLayer } = useTheme();
  const baseLayer = baseLayers.find((v) => v.name === currentLayer) || baseLayers.find(v => v.checked);

  // Debug markers
  useEffect(() => {
    console.log('Markers received:', markers);
  }, [markers]);

  // Handle marker updates
  useEffect(() => {
    if (!map.current) return;

    console.log('Updating markers:', markers);

    // Remove old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    markers.forEach(marker => {
      if (!marker.lng || !marker.lat) {
        console.warn('Invalid marker coordinates:', marker);
        return;
      }

      const el = createMarkerElement(marker.type, marker.status);
      
      const markerObj = new maplibregl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.current);

      // Add click handler
      el.addEventListener('click', () => {
        onMarkerClick?.(marker);
      });

      markersRef.current[marker.id] = markerObj;
    });
  }, [markers, onMarkerClick]);

  useEffect(() => {
    if (map.current) return;

    const tileUrl = baseLayer.url
      .replace('{s}', 'a')
      .replace('{z}', '{z}')
      .replace('{x}', '{x}')
      .replace('{y}', '{y}');

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [tileUrl],
            tileSize: 256,
            maxzoom: baseLayer.maxNativeZoom
          }
        },
        layers: [{
          id: 'raster-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: baseLayer.maxNativeZoom
        }]
      },
      center: [69.2401, 41.2995],
      zoom: 12,
      pitch: show3DLayer ? 45 : 0,
      bearing: 0,
      antialias: true
    });

    map.current.addControl(new maplibregl.NavigationControl());

    // Debug map initialization
    map.current.on('load', () => {
      console.log('Map loaded');
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    map.current.easeTo({
      pitch: show3DLayer ? 45 : 0,
      duration: 300
    });
  }, [show3DLayer]);

  useEffect(() => {
    if (!map.current) return;

    const newBaseLayer = baseLayers.find((v) => v.name === currentLayer) || baseLayers.find(v => v.checked);
    const source = map.current.getSource('raster-tiles');
    
    if (source && newBaseLayer) {
      const tileUrl = newBaseLayer.url
        .replace('{s}', 'a')
        .replace('{z}', '{z}')
        .replace('{x}', '{x}')
        .replace('{y}', '{y}');
      
      source.setTiles([tileUrl]);
    }
  }, [currentLayer]);

  return (
    <div 
      ref={mapContainer} 
      className="absolute inset-0 w-full h-full pointer-events-auto"
    />
  );
};

export default MapLibreLayer;
