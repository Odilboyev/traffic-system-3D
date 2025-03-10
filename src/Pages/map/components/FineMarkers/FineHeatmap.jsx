import { useEffect, useRef, useState } from "react";
import { useFines } from "../../context/FinesContext";
import maplibregl from "maplibre-gl";
import "./styles.css";

const FineHeatmap = ({ map }) => {
  const { fines } = useFines();
  const sourceAdded = useRef(false);
  const popupRef = useRef(null);
  const flashlightRef = useRef(null);
  const [lastFineId, setLastFineId] = useState(null);

  // Initialize heatmap and flashlight effect
  useEffect(() => {
    if (!map) return;
    console.log("Initializing heatmap");

    // Function to initialize heatmap after style is loaded
    const initializeHeatmap = () => {
      try {
        console.log("Map style loaded, initializing heatmap");
        
        // Remove existing layers and sources if they exist
        if (sourceAdded.current) {
          if (map.getLayer("fines-heat")) map.removeLayer("fines-heat");
          if (map.getSource("fines-heatmap")) map.removeSource("fines-heatmap");
          if (map.getLayer("flashlight-effect")) map.removeLayer("flashlight-effect");
          if (map.getSource("flashlight-effect")) map.removeSource("flashlight-effect");
        }

        // Add the GeoJSON source for heatmap
        map.addSource("fines-heatmap", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

      // Add heatmap layer
      map.addLayer({
        id: "fines-heat",
        type: "heatmap",
        source: "fines-heatmap",
        maxzoom: 18,
        paint: {
          // Increase weight based on fine amount
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "weight"],
            0, 0,
            10, 1
          ],
          // Increase intensity as zoom level increases
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8, 0.5,
            15, 2
          ],
          // Color heatmap based on density
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(236,222,239,0)",
            0.2, "rgb(208,209,230)",
            0.4, "rgb(166,189,219)",
            0.6, "rgb(103,169,207)",
            0.8, "rgb(28,144,153)",
            1, "rgb(1,108,89)"
          ],
          // Adjust radius based on zoom level
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8, 10,
            15, 25
          ],
          // Decrease opacity as zoom increases
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7, 1,
            16, 0.7
          ],
        },
      });

      // Add flashlight effect layer for new fines
      map.addSource("flashlight-effect", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });

      map.addLayer({
        id: "flashlight-effect",
        type: "circle",
        source: "flashlight-effect",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10, 40,
            15, 100
          ],
          "circle-color": "#ffffff",
          "circle-opacity": 0,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-opacity": 0
        }
      });

      // Set sourceAdded to true
      sourceAdded.current = true;
      console.log("Fine heatmap and flashlight layers added successfully");
      } catch (error) {
        console.error("Error setting up fine heatmap:", error);
        sourceAdded.current = false;
      }
    };

    // Check if style is loaded
    if (map.isStyleLoaded()) {
      initializeHeatmap();
    } else {
      // Wait for the style to load
      console.log("Waiting for map style to load...");
      map.once('style.load', initializeHeatmap);
    }

    // Clean up when component unmounts
    return () => {
      try {
        if (map) {
          if (popupRef.current) popupRef.current.remove();
          if (map.getLayer("fines-heat")) map.removeLayer("fines-heat");
          if (map.getSource("fines-heatmap")) map.removeSource("fines-heatmap");
          if (map.getLayer("flashlight-effect")) map.removeLayer("flashlight-effect");
          if (map.getSource("flashlight-effect")) map.removeSource("flashlight-effect");
          sourceAdded.current = false;
        }
      } catch (error) {
        console.error("Error cleaning up fine heatmap:", error);
      }
    };
  }, [map]);

  // Update heatmap data and handle flashlight effect when fines change
  useEffect(() => {
    if (!map || !sourceAdded.current || !Array.isArray(fines)) return;
    if (!map.isStyleLoaded() || !map.getSource("fines-heatmap")) {
      console.log("Map style or source not ready yet, skipping update");
      return;
    }
    
    console.log("Updating heatmap with", fines.length, "fines");

    try {
      // Check if there's a new fine (compare with lastFineId)
      const newFine = fines.length > 0 && lastFineId !== null && fines[0].id !== lastFineId ? fines[0] : null;
      
      // If there's a new fine, show flashlight effect
      if (newFine) {
        // Update flashlight position
        map.getSource("flashlight-effect").setData({
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [newFine.location.lng, newFine.location.lat]
            },
            properties: {}
          }]
        });

        // Animate flashlight
        let opacity = 0.8;
        const flashlightAnimation = setInterval(() => {
          map.setPaintProperty("flashlight-effect", "circle-opacity", opacity);
          map.setPaintProperty("flashlight-effect", "circle-stroke-opacity", opacity);
          opacity -= 0.1;
          
          if (opacity <= 0) {
            clearInterval(flashlightAnimation);
            map.setPaintProperty("flashlight-effect", "circle-opacity", 0);
            map.setPaintProperty("flashlight-effect", "circle-stroke-opacity", 0);
          }
        }, 30); // 30ms intervals for smooth animation over 300ms

        // Create flying image animation
        const flyingImg = document.createElement("img");
        flyingImg.src = newFine.imagePath;
        flyingImg.className = "flying-fine-image";
        document.body.appendChild(flyingImg);

        // Get panel position - look for the div with the right-5 class
        const panel = document.querySelector("div[class*='right-5']");
        console.log("Found panel:", panel);
        
        // Get panel position
        const panelPos = panel
          ? panel.getBoundingClientRect()
          : { top: 90, right: window.innerWidth - 20, bottom: 0, left: window.innerWidth - 320 };
          
        console.log("Panel position:", panelPos);

        // Calculate position on screen based on map coordinates
        let coordinates;
        if (Array.isArray(newFine.location)) {
          coordinates = newFine.location;
        } else if (newFine.location && typeof newFine.location === 'object') {
          coordinates = [newFine.location.lng || newFine.location[0], newFine.location.lat || newFine.location[1]];
        } else {
          console.error("Invalid location format for new fine:", newFine);
          return;
        }
        const point = map.project(coordinates);
        console.log("Starting point for flying image:", point);
        
        // Set initial position at marker location
        flyingImg.style.top = `${point.y}px`;
        flyingImg.style.left = `${point.x}px`;
        flyingImg.style.opacity = "0";

        // Start animation after a small delay
        setTimeout(() => {
          flyingImg.style.opacity = "1";
          console.log("Starting flying animation");

          // Animate to panel
          setTimeout(() => {
            // Panel is on the right side, so animate to the right side of the screen
            flyingImg.style.top = `${panelPos.top + 80}px`;
            flyingImg.style.left = `${panelPos.right - 80}px`;
            flyingImg.style.width = "60px";
            flyingImg.style.height = "60px";

            console.log("Flying animation completed");
            // Remove flying image after animation completes
            setTimeout(() => {
              if (flyingImg.parentNode) {
                flyingImg.parentNode.removeChild(flyingImg);
                console.log("Removed flying image");
              }
            }, 1500);
          }, 100);
        }, 300);

        // Update lastFineId
        setLastFineId(newFine.id);
      }

      // Convert fines to GeoJSON for heatmap
      const features = fines.map(fine => {
        // Check if fine.location is in the correct format
        let coordinates;
        if (Array.isArray(fine.location)) {
          coordinates = fine.location;
        } else if (fine.location && typeof fine.location === 'object') {
          coordinates = [fine.location.lng || fine.location[0], fine.location.lat || fine.location[1]];
        } else {
          console.error("Invalid location format for fine:", fine);
          return null;
        }
        
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: coordinates
          },
          properties: {
            id: fine.id,
            type: fine.type,
            amount: fine.amount,
            timestamp: fine.timestamp,
            imagePath: fine.imagePath,
            vehicleInfo: fine.vehicleInfo,
            speed: fine.speed,
            crossroad: fine.crossroad,
            weight: Math.min(fine.amount / 50, 10), // Weight based on fine amount, capped at 10
            photos: fine.photos
          }
        };
      }).filter(Boolean); // Remove any null features

      console.log("Heatmap features:", features.length);
      
      // Update heatmap data
      map.getSource("fines-heatmap").setData({
        type: "FeatureCollection",
        features: features
      });
    } catch (error) {
      console.error("Error updating fine heatmap:", error);
    }
  }, [fines, map, lastFineId]);

  // Handle clicks on the heatmap to show popup
  useEffect(() => {
    if (!map || !sourceAdded.current) return;

    const handleMapClick = (e) => {
      // Remove any existing popup
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      // Query features at click point
      const features = map.queryRenderedFeatures(e.point, { layers: ["fines-heat"] });
      
      if (features.length > 0) {
        // Find the closest fine to the click point
        const clickPoint = [e.lngLat.lng, e.lngLat.lat];
        
        let closestFine = null;
        let minDistance = Infinity;
        
        fines.forEach(fine => {
          let finePoint;
          if (Array.isArray(fine.location)) {
            finePoint = fine.location;
          } else if (fine.location && typeof fine.location === 'object') {
            finePoint = [fine.location.lng || fine.location[0], fine.location.lat || fine.location[1]];
          } else {
            return; // Skip this fine if location is invalid
          }
          // Simple distance calculation
          const distance = Math.sqrt(
            Math.pow(clickPoint[0] - finePoint[0], 2) + 
            Math.pow(clickPoint[1] - finePoint[1], 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            closestFine = fine;
          }
        });
        
        // Only show popup if a fine is found
        if (closestFine) {
          const popup = new maplibregl.Popup({
            closeButton: true,
            closeOnClick: true,
            maxWidth: "300px"
          });
          
          // Add popup content
          popup.setHTML(`
            <div class="fine-popup-content">
              <div class="fine-popup-header">
                <h3>Traffic Violation</h3>
                <span class="fine-popup-type">${closestFine.type}</span>
              </div>
              <div class="fine-popup-image">
                <img src="${closestFine.imagePath}" alt="Violation" />
              </div>
              <div class="fine-popup-details">
                <div class="fine-popup-vehicle">
                  <strong>Vehicle:</strong> ${closestFine.vehicleInfo.plate}
                  ${closestFine.vehicleInfo.model !== "Unknown" ? `(${closestFine.vehicleInfo.model}, ${closestFine.vehicleInfo.color})` : ""}
                </div>
                ${closestFine.speed && parseInt(closestFine.speed) > 0 ? `
                  <div class="fine-popup-speed">
                    <strong>Speed:</strong> ${closestFine.speed} km/h
                  </div>
                ` : ""}
                ${closestFine.crossroad ? `
                  <div class="fine-popup-location">
                    <strong>Location:</strong> ${closestFine.crossroad}
                  </div>
                ` : ""}
                <div class="fine-popup-amount">
                  <strong>Fine Amount:</strong> $${closestFine.amount}
                </div>
                <div class="fine-popup-time">
                  <strong>Time:</strong> ${new Date(closestFine.timestamp).toLocaleString()}
                </div>
                ${closestFine.photos && closestFine.photos.length > 1 ? `
                  <div class="fine-popup-gallery">
                    <strong>Additional Photos:</strong>
                    <div class="fine-popup-thumbnails">
                      ${closestFine.photos.slice(1, 4).map(photo => `
                        <a href="${photo.link}" target="_blank" class="fine-popup-thumbnail">
                          <img src="${photo.link}" alt="Violation photo type ${photo.type}" />
                        </a>
                      `).join("")}
                    </div>
                  </div>
                ` : ""}
              </div>
            </div>
          `);
          
          popup.setLngLat([closestFine.location.lng, closestFine.location.lat]);
          popup.addTo(map);
          popupRef.current = popup;
        }
      }
    };

    // Add click event listener
    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, fines]);

  return null;
};

export default FineHeatmap;
