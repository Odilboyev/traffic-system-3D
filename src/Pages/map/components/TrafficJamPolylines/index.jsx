import { useEffect, useState } from "react";

import L from "leaflet";
import { getTrafficJamLines } from "../../../../api/api.handlers";
import { useMap } from "react-leaflet";

const TrafficJamPolylines = () => {
  const map = useMap();
  const [polylines, setPolylines] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkZoomLevel = () => {
      const currentZoom = map.getZoom();
      setIsVisible(currentZoom > 15);
    };

    // Check initial zoom level
    checkZoomLevel();

    // Add zoom change listener
    map.on('zoomend', checkZoomLevel);

    // Cleanup
    return () => {
      map.off('zoomend', checkZoomLevel);
    };
  }, [map]);

  useEffect(() => {
    const fetchAndDrawLines = async () => {
      try {
        const lines = await getTrafficJamLines();
        if (lines?.data) {
          // Remove existing polylines
          polylines.forEach((polyline) => map.removeLayer(polyline));

          // Create new polylines with styling
          const newPolylines = lines.data.map((line) => {
            // Parse the traffic_line string to get coordinates
            const positions = JSON.parse(line.traffic_line);
            const coordinates = positions.map((pos) => [pos.lat, pos.lng]);

            const getTrafficStyle = (ball) => {
              // Common style properties
              const baseStyle = {
                weight: 9,
                opacity: 0.9,
                lineCap: "round",
                lineJoin: "round",
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

            // Create the polyline with enhanced styling
            const polyline = L.polyline(coordinates, style);

            // Add interactive features
            polyline.on("mouseover", function (e) {
              this.setStyle({
                weight: style.weight + 2,
                opacity: 1,
              });

              // // Show tooltip with traffic info
              // const tooltipContent = `
              //   <div class="traffic-tooltip">
              //     <strong>Traffic Level: ${line.traffic_ball}/10</strong>
              //     <br/>
              //     ${
              //       line.traffic_ball < 6
              //         ? "Low Traffic"
              //         : line.traffic_ball < 8
              //         ? "Moderate Traffic"
              //         : line.traffic_ball < 9
              //         ? "High Traffic"
              //         : "Severe Traffic"
              //     }
              //   </div>
              // `;

              // this.bindTooltip(tooltipContent, {
              //   className: "traffic-tooltip",
              //   direction: "top",
              // }).openTooltip();
            });

            polyline.on("mouseout", function (e) {
              this.setStyle({
                weight: style.weight,
                opacity: 0.9,
              });
              this.closeTooltip();
            });

            // Add the polyline to the map only if zoom level is appropriate
            if (isVisible) {
              polyline.addTo(map);
            }

            return polyline;
          });

          setPolylines(newPolylines);
        }
      } catch (error) {
        console.error("Error fetching traffic jam lines:", error);
      }
    };

    // Initial fetch
    fetchAndDrawLines();

    // Set up periodic updates every minute
    const interval = setInterval(fetchAndDrawLines, 60000); // Update every minute

    // Save current map position and zoom level when unmounting
    return () => {
      clearInterval(interval);
      // Safely remove polylines if they exist
      if (polylines && polylines.length > 0) {
        polylines.forEach((polyline) => {
          if (polyline && map) {
            try {
              map.removeLayer(polyline);
            } catch (error) {
              console.warn('Error removing polyline:', error);
            }
          }
        });
      }
      
      // Safely save map position and zoom
      try {
        if (map && map.getCenter && map.getZoom) {
          localStorage.setItem(
            "its_currentLocation",
            JSON.stringify(map.getCenter())
          );
          localStorage.setItem("its_currentZoom", JSON.stringify(map.getZoom()));
        }
      } catch (error) {
        console.warn('Error saving map position:', error);
      }
    };
  }, [map, isVisible]);

  // Handle zoom level changes
  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      const shouldBeVisible = currentZoom >= 16;

      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);

        if (shouldBeVisible) {
          polylines.forEach((polyline) => polyline.addTo(map));
        } else {
          polylines.forEach((polyline) => map.removeLayer(polyline));
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
  }, [map, polylines, isVisible]);

  return null;
};

export default TrafficJamPolylines;
