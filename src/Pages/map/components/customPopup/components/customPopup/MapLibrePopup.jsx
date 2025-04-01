import "./style.popup.css";

import React, { useEffect, useRef } from "react";

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
  const rootRef = useRef(null);

  // Create container and root once
  useEffect(() => {
    if (!containerRef.current) {
      containerRef.current = document.createElement("div");
      containerRef.current.className = ` ${className}`;
      rootRef.current = ReactDOM.createRoot(containerRef.current);
    }
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
      containerRef.current = null;
    };
  }, [className]); // Include className as it's used in the effect

  // Update content when children change
  useEffect(() => {
    if (!containerRef.current || !rootRef.current) return;
    
    rootRef.current.render(
      <ReduxProvider>
        <div className="popup-wrapper">{children}</div>
      </ReduxProvider>
    );
  }, [children]);

  // Handle popup creation and updates
  useEffect(() => {
    if (!map || !coordinates) return;

    // Create popup
    if (!popupRef.current) {
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset,
        className: `maplibre-custom-popup no-tip ${
          isDraggable ? "draggable-popup" : ""
        }`,
        draggable: isDraggable,
        anchor: "bottom",
        maxWidth: "none",
        subpixelPositioning: true,
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

      // Positioning is now fixed, no auto-adjustment needed

      // Handle popup close
      popupRef.current.on("close", () => {
        // Unregister from registry
        popupRegistry.unregister(popupRef.current);
        if (onClose) onClose();
      });

      if (isDraggable && popupRef.current) {
        const popupElement = popupRef.current.getElement();

        // Define event handlers
        const handleMouseDown = (e) => {
          if (e.target.closest(".popup-drag-handle")) {
            popupElement._isDragging = true;
            popupElement._dragStartX = e.clientX;
            popupElement._dragStartY = e.clientY;
            popupElement._initialLngLat = popupRef.current.getLngLat();
          }
        };

        const handleMouseMove = (e) => {
          if (popupElement._isDragging && popupRef.current) {
            const dx = e.clientX - popupElement._dragStartX;
            const dy = e.clientY - popupElement._dragStartY;
            const initialPoint = map.project(popupElement._initialLngLat);
            const newPoint = [initialPoint.x + dx, initialPoint.y + dy];
            const newLngLat = map.unproject(newPoint);
            popupRef.current.setLngLat(newLngLat);
          }
        };

        const handleMouseUp = () => {
          if (popupElement._isDragging && popupRef.current) {
            popupElement._isDragging = false;
            const newCoords = popupRef.current.getLngLat();
            popupRegistry.updateCoordinates(popupRef.current, [newCoords.lng, newCoords.lat]);
          }
        };

        // Add event listeners
        popupElement.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        // Store handlers for cleanup
        popupElement._dragHandlers = { handleMouseDown, handleMouseMove, handleMouseUp };
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
        // Only update coordinates if moved more than a small threshold
        popupRef.current._lastCoords = [...coordinates];
      }
    }

    return () => {
      if (popupRef.current) {
        const popupElement = popupRef.current.getElement();
        if (popupElement && popupElement._dragHandlers) {
          popupElement.removeEventListener("mousedown", popupElement._dragHandlers.handleMouseDown);
          document.removeEventListener("mousemove", popupElement._dragHandlers.handleMouseMove);
          document.removeEventListener("mouseup", popupElement._dragHandlers.handleMouseUp);
          delete popupElement._dragHandlers;
        }
        popupRegistry.unregister(popupRef.current);
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [map, coordinates, isDraggable, markerId, offset, onClose]); // Include all dependencies

  return null;
};

export default MapLibrePopup;
