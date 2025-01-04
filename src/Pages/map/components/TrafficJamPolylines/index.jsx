import { useEffect, useState } from "react";
import L from "leaflet";
import { getTrafficJamLines } from "../../../../api/api.handlers";
import { useMap } from "react-leaflet";

const TrafficJamPolylines = () => {
  const map = useMap();
  const [polylines, setPolylines] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

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

            // Enhanced color and styling based on traffic_ball
            const getTrafficStyle = (ball) => {
              // Define base styles for different traffic levels
              const styles = {
                low: {
                  color: "#28a745",  // Green
                  weight: 6,
                  className: "traffic-line-low"
                },
                moderate: {
                  color: "#ffc107",  // Yellow
                  weight: 7,
                  className: "traffic-line-moderate"
                },
                high: {
                  color: "#fd7e14",  // Orange
                  weight: 8,
                  className: "traffic-line-high"
                },
                severe: {
                  color: "#dc3545",  // Red
                  weight: 9,
                  className: "traffic-line-severe"
                }
              };

              // Determine traffic level based on new ranges
              if (ball <= 2) return styles.low;
              if (ball <= 5) return styles.moderate;
              if (ball <= 8) return styles.high;
              return styles.severe;
            };

            const style = getTrafficStyle(line.traffic_ball);

            // Create the polyline with enhanced styling
            const polyline = L.polyline(coordinates, {
              ...style,
              opacity: 0.9,
              lineCap: "round",
              lineJoin: "round",
            });

            // Add interactive features
            polyline.on('mouseover', function(e) {
              this.setStyle({
                weight: style.weight + 2,
                opacity: 1
              });
              
              // Show tooltip with traffic info
              const tooltipContent = `
                <div class="traffic-tooltip">
                  <strong>Traffic Level: ${line.traffic_ball}/10</strong>
                  <br/>
                  ${line.traffic_ball <= 2 ? 'Low Traffic' :
                    line.traffic_ball <= 5 ? 'Moderate Traffic' :
                    line.traffic_ball <= 8 ? 'High Traffic' :
                    'Severe Traffic'}
                </div>
              `;
              
              this.bindTooltip(tooltipContent, {
                className: 'traffic-tooltip',
                direction: 'top'
              }).openTooltip();
            });

            polyline.on('mouseout', function(e) {
              this.setStyle({
                weight: style.weight,
                opacity: 0.9
              });
              this.closeTooltip();
            });

            return polyline;
          });

          setPolylines(newPolylines);

          // Add to map if zoom level is appropriate
          if (isVisible) {
            newPolylines.forEach((polyline) => polyline.addTo(map));
          }
        }
      } catch (error) {
        console.error("Error fetching traffic jam lines:", error);
      }
    };

    // Initial fetch
    fetchAndDrawLines();

    // Set up periodic updates
    const interval = setInterval(fetchAndDrawLines, 30000); // Update every 30 seconds

    return () => {
      clearInterval(interval);
      polylines.forEach((polyline) => map.removeLayer(polyline));
    };
  }, [map, isVisible]);

  // Handle zoom level changes
  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      const shouldBeVisible = currentZoom >= 18; // Changed back to zoom level 18

      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);

        if (shouldBeVisible) {
          polylines.forEach((polyline) => polyline.addTo(map));
        } else {
          polylines.forEach((polyline) => map.removeLayer(polyline));
        }
      }
    };

    map.on("zoomend", handleZoomEnd);
    handleZoomEnd(); // Check initial zoom level

    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map, polylines, isVisible]);

  return null;
};

export default TrafficJamPolylines;
