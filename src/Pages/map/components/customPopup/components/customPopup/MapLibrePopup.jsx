import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';

const MapLibrePopup = ({ 
  map, 
  coordinates, 
  children, 
  isDraggable = true,
  onClose,
  offset = [0, 0],
  className = ''
}) => {
  const popupRef = useRef(null);
  const containerRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    if (!map || !coordinates) return;

    // Create container for the popup
    if (!containerRef.current) {
      containerRef.current = document.createElement('div');
      containerRef.current.className = `maplibre-popup-content ${className}`;
    }

    // Create popup
    if (!popupRef.current) {
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset,
        className: 'maplibre-custom-popup'
      })
        .setLngLat(coordinates)
        .setDOMContent(containerRef.current)
        .addTo(map);

      // Handle popup close
      popupRef.current.on('close', () => {
        if (onClose) onClose();
      });
    } else {
      popupRef.current.setLngLat(coordinates);
    }

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [map, coordinates, className, offset]);

  // Update popup content when children change
  useEffect(() => {
    if (!containerRef.current) return;
    
    const content = (
      <Draggable
        disabled={!isDraggable}
        handle=".popup-drag-handle"
        nodeRef={dragRef}
      >
        <div ref={dragRef} className="popup-container">
          {children}
        </div>
      </Draggable>
    );

    // Render children into the container
    if (containerRef.current) {
      createPortal(content, containerRef.current);
    }
  }, [children, isDraggable]);

  return null;
};

export default MapLibrePopup;
