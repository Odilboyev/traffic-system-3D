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

  useEffect(() => {
    const checkZoomLevel = () => {
      const currentZoom = map.getZoom();
      setIsVisible(currentZoom > 15);
    };

    // Check initial zoom level
    checkZoomLevel();

    // Add zoom change listener
    map.on("zoomend", checkZoomLevel);

    // Cleanup
    return () => {
      map.off("zoomend", checkZoomLevel);
    };
  }, [map]);

  useEffect(() => {
    const fetchAndDrawLines = async () => {
      try {
        const lines = await getTrafficJamLines();
        if (lines?.data && layerGroupRef.current) {
          // Clear existing layers
          layerGroupRef.current.clearLayers();

          // Create new polylines with styling
          lines.data.forEach((line) => {
            // Parse the traffic_line string to get coordinates
            const positions = JSON.parse(line.traffic_line);
            const coordinates = positions.map((pos) => [pos.lat, pos.lng]);

            const getTrafficStyle = (ball) => {
              // Common style properties
              const baseStyle = {
                weight: 9,
                opacity: show3DLayer ? 0.7 : 0.9, // Slightly more transparent in 3D mode
                lineCap: "round",
                lineJoin: "round",
                // Add elevation profile for 3D mode
                elevation: show3DLayer
                  ? {
                      sampling: 100, // Sample points for smooth elevation
                      simplify: 0.5,
                      height: 5, // Height above terrain in meters
                    }
                  : undefined,
              };

              // Define colors for different traffic levels
              const styles = {
                low: {
                  ...baseStyle,
                  color: "#28a745", // Green (0-5)
                  className: "traffic-line-low",
                },
                moderate: {
                  ...baseStyle,
                  color: "#ffc107", // Yellow (6-7)
                  className: "traffic-line-moderate",
                },
                high: {
                  ...baseStyle,
                  color: "#fd7e14", // Orange (8-9)
                  className: "traffic-line-high",
                },
                severe: {
                  ...baseStyle,
                  color: "#dc3545", // Red (9-10)
                  className: "traffic-line-severe",
                },
              };

              // Determine traffic level based on specified ranges
              if (ball < 6) return styles.low; // 0 <= traffic_count < 6
              if (ball < 8) return styles.moderate; // 6 <= traffic_count < 8
              if (ball < 9) return styles.high; // 8 <= traffic_count < 9
              return styles.severe; // 9 <= traffic_count <= 10
            };

            const style = getTrafficStyle(line.traffic_ball);

            // Create polyline with coordinates
            const polyline = L.polyline(coordinates, {
              ...style,
              // Add smooth animation for style changes
              smoothFactor: 1,
              interactive: true,
            });

            // Only add to layer group if zoom level is appropriate
            if (isVisible) {
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
