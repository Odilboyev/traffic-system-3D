import maplibregl from "maplibre-gl";
import { useEffect } from "react";

const MapControls = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    // Add Navigation Control (includes zoom control)
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    
    // Add Scale Control
    map.addControl(new maplibregl.ScaleControl(), "bottom-left");
    
    // Add Fullscreen Control
    map.addControl(new maplibregl.FullscreenControl(), "top-right");
    
    // Add Geolocation Control
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    // Cleanup function to remove controls when component unmounts
    return () => {
      const controls = map._controls;
      controls.forEach(control => {
        map.removeControl(control);
      });
    };
  }, [map]);

  return null; // This component doesn't render anything directly
};

export default MapControls;
