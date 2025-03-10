import React, { useEffect, useRef } from "react";

import Draggable from "react-draggable";
import ReactDOM from "react-dom/client";
import { ReduxProvider } from "../../../../../../redux/ReduxProvider";
import maplibregl from "maplibre-gl";

// Popup registry to manage and adjust popup positions
const popupRegistry = {
  popups: [],
  register: function (popup, coordinates) {
    this.popups.push({ popup, coordinates });
  },
  unregister: function (popup) {
    this.popups = this.popups.filter((item) => item.popup !== popup);
  },
  updateCoordinates: function (popup, coordinates) {
    const item = this.popups.find((item) => item.popup === popup);
    if (item) {
      item.coordinates = coordinates;
    }
  },
  getAll: function () {
    return this.popups;
  },
};

const MapLibrePopup = ({
  map,
  coordinates,
  children,
  isDraggable = true,
  onClose,
  offset = [0, 0],
  className = "",
  markerId = "", // Add markerId prop
}) => {
  const popupRef = useRef(null);
  const containerRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    if (!map || !coordinates) return;

    // Create container for the popup
    if (!containerRef.current) {
      containerRef.current = document.createElement("div");
      containerRef.current.className = ` ${className}`;
      ReactDOM.createRoot(containerRef.current).render(
        <ReduxProvider>
          <div className="popup-wrapper">{children}</div>
        </ReduxProvider>
      );
    }

    // Create popup
    if (!popupRef.current) {
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset,
        className: `maplibre-custom-popup ${
          isDraggable ? "draggable-popup" : ""
        }`,
        draggable: isDraggable,
      })
        .setLngLat(coordinates)
        .setDOMContent(containerRef.current)
        .addTo(map);

      // Add the marker ID as a data attribute to the popup element
      setTimeout(() => {
        if (popupRef.current && markerId) {
          const popupElement = popupRef.current.getElement();
          if (popupElement) {
            popupElement.setAttribute("data-marker-id", markerId);
          }
        }
      }, 0);

      // Register the popup in the global registry
      popupRegistry.register(popupRef.current, coordinates);

      // Adjust positions only once after a short delay to ensure all popups are rendered
      // Use a ref to track if we've already adjusted this popup to prevent infinite loops
      if (!popupRef.current._positionAdjusted) {
        setTimeout(() => {
          adjustPopupPositions();
          // Mark this popup as adjusted
          if (popupRef.current) {
            popupRef.current._positionAdjusted = true;
          }
        }, 100);
      }

      // Handle popup close
      popupRef.current.on("close", () => {
        // Unregister from registry
        popupRegistry.unregister(popupRef.current);
        if (onClose) onClose();
      });

      // Handle drag end to update registry
      if (isDraggable && popupRef.current) {
        // Get the popup element
        const popupElement = popupRef.current.getElement();

        if (popupElement && !popupElement._hasMouseUpListener) {
          popupElement._hasMouseUpListener = true;

          // Add mousedown event to start dragging
          popupElement.addEventListener("mousedown", (e) => {
            // Only initiate drag if clicking on the drag handle
            if (e.target.closest(".popup-drag-handle")) {
              popupElement._isDragging = true;
              popupElement._dragStartX = e.clientX;
              popupElement._dragStartY = e.clientY;
              popupElement._initialLngLat = popupRef.current.getLngLat();
            }
          });

          // Add mousemove event to handle dragging
          document.addEventListener("mousemove", (e) => {
            if (popupElement._isDragging && popupRef.current) {
              // Calculate pixel movement
              const dx = e.clientX - popupElement._dragStartX;
              const dy = e.clientY - popupElement._dragStartY;

              // Convert pixel movement to geographic coordinates
              const initialPoint = map.project(popupElement._initialLngLat);
              const newPoint = [initialPoint.x + dx, initialPoint.y + dy];
              const newLngLat = map.unproject(newPoint);

              // Update popup position
              popupRef.current.setLngLat(newLngLat);
            }
          });

          // Add mouseup event to end dragging
          document.addEventListener("mouseup", () => {
            if (popupElement._isDragging && popupRef.current) {
              popupElement._isDragging = false;
              const newCoords = popupRef.current.getLngLat();
              popupRegistry.updateCoordinates(popupRef.current, [
                newCoords.lng,
                newCoords.lat,
              ]);
              // Only adjust positions after manual dragging
              adjustPopupPositions();
            }
          });
        }
      }
    } else {
      popupRef.current.setLngLat(coordinates);
      popupRegistry.updateCoordinates(popupRef.current, coordinates);
      // Only adjust if coordinates have changed significantly
      const oldCoords = popupRef.current._lastCoords || [0, 0];
      const dist = Math.sqrt(
        Math.pow(coordinates[0] - oldCoords[0], 2) +
          Math.pow(coordinates[1] - oldCoords[1], 2)
      );

      if (dist > 0.0001) {
        // Only adjust if moved more than a small threshold
        popupRef.current._lastCoords = [...coordinates];
        adjustPopupPositions();
      }
    }

    return () => {
      if (popupRef.current) {
        popupRegistry.unregister(popupRef.current);
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [map, coordinates, className, offset, isDraggable]);

  // Update popup content when children change
  // useEffect(() => {
  //   if (!containerRef.current) return;

  //   const content = (
  //     <Draggable
  //       disabled={!isDraggable}
  //       handle=".popup-drag-handle"
  //       nodeRef={dragRef}
  //     >
  //       <div ref={dragRef} className="popup-container">
  //         {children}
  //       </div>
  //     </Draggable>
  //   );

  //   // // Render children into the container
  //   // if (containerRef.current) {
  //   //   createPortal(content, containerRef.current);
  //   // }
  // }, [children, isDraggable]);

  // Function to adjust popup positions when they are too close to each other
  const adjustPopupPositions = () => {
    if (!map || !popupRef.current) return;

    // Use a debounce mechanism to prevent multiple rapid adjustments
    if (popupRef.current._adjusting) return;
    popupRef.current._adjusting = true;

    const allPopups = popupRegistry.getAll();
    if (allPopups.length <= 1) {
      popupRef.current._adjusting = false;
      return;
    }

    // Get the current popup's pixel coordinates and dimensions
    const currentPopupCoords = popupRef.current.getLngLat();
    const currentPoint = map.project(currentPopupCoords);

    // Get the current popup's DOM element
    const currentPopupElement = popupRef.current.getElement();
    const currentPopupRect = currentPopupElement
      ? currentPopupElement.getBoundingClientRect()
      : { width: 280, height: 200 };

    // Half dimensions of current popup (for edge-to-edge calculation)
    const currentHalfWidth = currentPopupRect.width / 2;
    const currentHalfHeight = currentPopupRect.height / 2;

    // Minimum gap between popups in pixels
    const minGap = 20; // Small gap between popups

    // Check distance to other popups
    for (const { popup, coordinates } of allPopups) {
      if (popup === popupRef.current) continue;

      // Get other popup's pixel coordinates and dimensions
      const otherPoint = map.project(popup.getLngLat());
      const otherPopupElement = popup.getElement();
      const otherPopupRect = otherPopupElement
        ? otherPopupElement.getBoundingClientRect()
        : { width: 280, height: 200 };

      // Half dimensions of other popup
      const otherHalfWidth = otherPopupRect.width / 2;
      const otherHalfHeight = otherPopupRect.height / 2;

      // Calculate center-to-center distance
      const dx = currentPoint.x - otherPoint.x;
      const dy = currentPoint.y - otherPoint.y;
      const centerDistance = Math.sqrt(dx * dx + dy * dy);

      // Calculate required distance based on popup dimensions plus the minimum gap
      const requiredDistance = currentHalfWidth + otherHalfWidth + minGap;

      // If popups are too close (overlapping or not enough gap), adjust position
      if (centerDistance < requiredDistance) {
        // Calculate direction vector from other popup to current popup
        const angle = Math.atan2(dy, dx);

        // Calculate how much to move
        const moveDistance = requiredDistance - centerDistance + 5; // Add 5px extra to ensure gap

        // Move current popup away from other popup
        const newX = currentPoint.x + Math.cos(angle) * moveDistance;
        const newY = currentPoint.y + Math.sin(angle) * moveDistance;

        // Convert back to geographic coordinates
        const newLngLat = map.unproject([newX, newY]);

        // Update popup position
        popupRef.current.setLngLat(newLngLat);
        popupRegistry.updateCoordinates(popupRef.current, [
          newLngLat.lng,
          newLngLat.lat,
        ]);

        // Update current point for subsequent calculations
        currentPoint.x = newX;
        currentPoint.y = newY;
      }
    }

    // Reset adjustment flag after a short delay
    setTimeout(() => {
      if (popupRef.current) {
        popupRef.current._adjusting = false;
      }
    }, 200);
  };

  return null;
};

export default MapLibrePopup;
