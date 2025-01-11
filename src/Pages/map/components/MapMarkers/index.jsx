import { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { renderToString } from 'react-dom/server';
import CameraMarker3D from '../MapLibreLayer/CameraMarker3D';
import { useMapMarkers } from '../../hooks/useMapMarkers';
import Supercluster from 'supercluster';

const MapMarkers = ({ map }) => {
  const { markers } = useMapMarkers();
  const markersRef = useRef(new Map());
  const clusterIndex = useRef(null);

  const createMarkerElement = useCallback((markerData) => {
    const el = document.createElement('div');
    const isCamera = markerData?.device_type === 'camera' || markerData?.type === 'camera';
    
    el.className = isCamera ? 'maplibre-marker-3d camera' : 'maplibre-marker-3d';
    
    if (isCamera) {
      el.innerHTML = renderToString(
        <CameraMarker3D rotation={markerData?.rotate || 0} />
      );
      el.style.width = '40px';
      el.style.height = '40px';
    } else {
      el.style.width = '24px';
      el.style.height = '24px';
      // Add your marker icon styles here
    }
    
    return el;
  }, []);

  const updateClusters = useCallback(() => {
    if (!map || !clusterIndex.current) return;

    const bounds = map.getBounds();
    const zoom = Math.floor(map.getZoom());

    // Get clusters
    const clusters = clusterIndex.current.getClusters([
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ], zoom);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    // Add new markers
    clusters.forEach(cluster => {
      if (cluster.properties.cluster) {
        // Create cluster marker
        const el = document.createElement('div');
        el.className = 'marker-cluster';
        el.innerHTML = `<div class="marker-cluster-count">${cluster.properties.point_count}</div>`;
        
        const marker = new maplibregl.Marker({
          element: el
        })
          .setLngLat(cluster.geometry.coordinates)
          .addTo(map);
        
        markersRef.current.set(cluster.id, marker);
      } else {
        // Create individual marker
        const markerData = cluster.properties;
        const el = createMarkerElement(markerData);
        
        const marker = new maplibregl.Marker({
          element: el,
          rotation: markerData?.rotate || 0
        })
          .setLngLat(cluster.geometry.coordinates)
          .addTo(map);
        
        // Add popup if needed
        if (markerData.popup) {
          marker.setPopup(
            new maplibregl.Popup()
              .setHTML(markerData.popup)
          );
        }
        
        markersRef.current.set(cluster.id, marker);
      }
    });
  }, [map, createMarkerElement]);

  // Initialize cluster index
  useEffect(() => {
    if (!markers || !map) return;

    const points = markers.map(marker => ({
      type: 'Feature',
      properties: marker,
      geometry: {
        type: 'Point',
        coordinates: [marker.lng, marker.lat]
      }
    }));

    clusterIndex.current = new Supercluster({
      radius: 40,
      maxZoom: 16
    });
    
    clusterIndex.current.load(points);
    updateClusters();
  }, [markers, map, updateClusters]);

  // Update clusters on map move
  useEffect(() => {
    if (!map) return;
    
    map.on('moveend', updateClusters);
    return () => {
      map.off('moveend', updateClusters);
    };
  }, [map, updateClusters]);

  return null;
};

export default MapMarkers;
