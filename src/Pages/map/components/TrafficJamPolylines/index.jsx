import { useEffect, useRef, useState } from "react";

import L from "leaflet";
import { getTrafficJamLines } from "../../../../api/api.handlers";
import { useMap } from "react-leaflet";
import { useTheme } from "../../../../customHooks/useTheme";

const TrafficJamPolylines = () => {
  const map = useMap();
  const [isVisible, setIsVisible] = useState(false);
  const { show3DLayer } = useTheme();
  const layerGroupRef = useRef(null);

  // Initialize layer group
  useEffect(() => {
    layerGroupRef.current = L.layerGroup().addTo(map);
    return () => {
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
        map.removeLayer(layerGroupRef.current);
      }
    };
  }, [map]);

  // Convert coordinates for 3D display
  const convert2Dto3D = (lat, lng) => {
    if (!show3DLayer) return [lat, lng];

    // Get the terrain height at this point (if available)
    let height = 0;
    if (map.getTerrain && map.getTerrain()) {
      height = map.getTerrain().getHeight([lat, lng]) || 0;
    }

    return [lat, lng, height];
  };

  // Fetch and draw traffic lines
  useEffect(() => {
    const fetchAndDrawLines = async () => {
      try {
        const lines = await getTrafficJamLines();

        if (lines?.data && layerGroupRef.current) {
          // Clear existing layers
          layerGroupRef.current.clearLayers();

          // Create lines and markers for each traffic line
          lines.data.forEach((line) => {
            // Parse the traffic_line string to get coordinates
            const positions = JSON.parse(line.traffic_line);

            // Determine color based on traffic ball
            const getTrafficColor = (ball) => {
              if (ball < 6) return "#28a745"; // Green (low)
              if (ball < 8) return "#ffc107"; // Yellow (moderate)
              if (ball < 9) return "#fd7e14"; // Orange (high)
              return "#dc3545"; // Red (severe)
            };

            const lineColor = getTrafficColor(line.traffic_ball);

            // Create a custom icon
            const createTrafficIcon = (color) => {
              return L.divIcon({
                className: "custom-traffic-marker",
                html: `
                  <div style="
                    width: 3px; 
                    height: 3px; 
                    border-radius: 50%; 
                    background-color: ${color};
                  "></div>
                `,
                iconSize: [3, 3],
                iconAnchor: [1.5, 1.5],
              });
            };

            const trafficIcon = createTrafficIcon(lineColor);

            // Prepare coordinates and markers
            const coordinates = [];
            const markers = [];

            // Create markers and collect coordinates
            positions.forEach((pos, index) => {
              const coordinate = [pos.lat, pos.lng];
              coordinates.push(coordinate);

              // Create a marker for each point
              const marker = L.marker(coordinate, {
                icon: trafficIcon,
                interactive: true,
                title: `Traffic Level: ${line.traffic_ball}`,
              });

              // Add tooltip with additional information
              marker.bindTooltip(`Traffic Ball: ${line.traffic_ball}`, {
                permanent: false,
                direction: "top",
              });

              markers.push(marker);
            });

            // Create polyline connecting the points
            const polyline = L.polyline(coordinates, {
              color: lineColor,
              weight: 10,
              opacity: 0.9,
              interactive: true,
            });

            // Only add to layer group if zoom level is appropriate
            if (isVisible) {
              // Add markers
              markers.forEach((marker) => {
                layerGroupRef.current.addLayer(marker);
              });

              // Add connecting line
              layerGroupRef.current.addLayer(polyline);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching traffic jam lines:", error);
      }
    };

    // Fetch and draw lines initially and set up interval
    if (isVisible) {
      fetchAndDrawLines();
      const interval = setInterval(fetchAndDrawLines, 30000);
      return () => clearInterval(interval);
    }
  }, [map, isVisible, show3DLayer]);

  // Handle zoom level changes
  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      const shouldBeVisible = currentZoom >= 16;

      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);

        if (shouldBeVisible) {
          if (layerGroupRef.current) {
            layerGroupRef.current.addTo(map);
          }
        } else {
          if (layerGroupRef.current) {
            map.removeLayer(layerGroupRef.current);
          }
        }
      }
      // Save zoom level on change
      localStorage.setItem("its_currentZoom", JSON.stringify(currentZoom));
    };

    const handleMoveEnd = () => {
      // Save current position on map move
      localStorage.setItem(
        "its_currentLocation",
        JSON.stringify(map.getCenter())
      );
    };

    map.on("zoomend", handleZoomEnd);
    map.on("moveend", handleMoveEnd);
    handleZoomEnd(); // Check initial zoom level

    return () => {
      map.off("zoomend", handleZoomEnd);
      map.off("moveend", handleMoveEnd);
    };
  }, [map, isVisible, layerGroupRef]);

  return null;
};

export default TrafficJamPolylines;
