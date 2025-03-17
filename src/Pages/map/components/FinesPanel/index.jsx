import "./styles.finesPanel.css";

import { useEffect, useRef, useState } from "react";

import { useFines } from "../../context/FinesContext";
import { useMapContext } from "../../context/MapContext";

// Status indicator component
const ConnectionStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "disconnected":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "error":
        return "Connection Error";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs text-white/70 px-2 py-1 bg-black/20 rounded">
      <div
        className={`w-2 h-2 rounded-full ${getStatusColor()} shadow-glow`}
      ></div>
      <span>{getStatusText()}</span>
    </div>
  );
};

const FinesPanel = () => {
  const { fines, showFinesPanel, flyToFine, selectedFine, socketStatus } =
    useFines();
  const { map } = useMapContext();
  const [animatingFineId, setAnimatingFineId] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const panelRef = useRef(null);
  const [flyingImage, setFlyingImage] = useState(null);

  // Add fines-panel class to the panel for targeting in CSS
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.classList.add("fines-panel");
    }
  }, []);

  // Track map center changes
  useEffect(() => {
    if (!map) return;

    const updateMapCenter = () => {
      setMapCenter(map.getCenter());
    };

    // Update initially and on map move
    updateMapCenter();
    map.on("move", updateMapCenter);

    return () => {
      map.off("move", updateMapCenter);
    };
  }, [map]);

  // Helper function to check if a fine is near the current map center
  const isNearMapCenter = (fine) => {
    if (!mapCenter || !fine) return false;

    // Calculate distance between points (simple approximation)
    const latDiff = Math.abs(mapCenter.lat - fine.location[1]);
    const lngDiff = Math.abs(mapCenter.lng - fine.location[0]);

    // Consider "near" if within ~1km (rough approximation)
    return latDiff < 0.01 && lngDiff < 0.01;
  };

  // Add this function to calculate screen coordinates from map coordinates
  const getScreenPosition = (location) => {
    if (!map || !location) return null;
    const point = map.project(location);
    return {
      x: point.x,
      y: point.y,
    };
  };

  // Handle new fines coming in
  useEffect(() => {
    if (fines.length > 0) {
      const latestFine = fines[0];
      console.log(fines, "fines");
      // Get the fine's location on screen
      const screenPos = getScreenPosition([
        latestFine.location[0],
        latestFine.location[1],
      ]);

      if (screenPos && panelRef.current) {
        // Get the panel's position
        const panelRect = panelRef.current.getBoundingClientRect();

        // Find the position where the fine will be added in the list
        const fineElements = panelRef.current.querySelectorAll(".fine-item");
        const targetElement = fineElements[fineElements.length - 1];

        if (targetElement) {
          const targetRect = targetElement.getBoundingClientRect();

          // Set up the flying image animation
          setFlyingImage({
            id: latestFine.id,
            src: latestFine.imagePath,
            startX: screenPos.x,
            startY: screenPos.y,
            endX: targetRect.left,
            endY: targetRect.top,
          });

          // Remove flying image after animation completes
          setTimeout(() => {
            setFlyingImage(null);
          }, 1400);
        }
      }
    }
  }, [fines.length, map]);

  // Add this function for testing

  if (!showFinesPanel) return null;

  return (
    <>
      {flyingImage && (
        <img
          src={flyingImage.src}
          className="flying-image"
          style={{
            "--start-x": `${flyingImage.startX}px`,
            "--start-y": `${flyingImage.startY}px`,
            "--end-x": `${flyingImage.endX}px`,
            "--end-y": `${flyingImage.endY}px`,
          }}
          alt=""
        />
      )}
      <div
        ref={panelRef}
        className="absolute mt-[90px] right-5 top-0 w-[30vw] max-h-[calc(90vh)] bg-[rgba(24,28,41,0.10)] rounded-lg shadow-lg overflow-y-auto flex flex-col z-[100] backdrop-blur-md transition-all duration-300"
      >
        <div className="p-4 bg-black/20 flex flex-col gap-2 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-lg font-semibold m-0">
              Traffic Violations
            </h2>
            <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs">
              {fines.length} total
            </span>
          </div>
          <ConnectionStatus status={socketStatus} />
        </div>

        {/* Display up to 8 fines in a 2x4 grid layout */}
        <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-4">
          {fines.map((fine) => (
            <div
              key={fine.id}
              className={`relative fine-item bg-white/10 rounded-md overflow-hidden cursor-pointer transition-all duration-200 h-60 group ${
                selectedFine?.id === fine.id && isNearMapCenter(fine)
                  ? "ring-2 ring-blue-500"
                  : ""
              } ${animatingFineId === fine.id ? "animate-pulse-gold" : ""}`}
              onClick={() => flyToFine(fine)}
            >
              <div className="w-full h-full overflow-hidden">
                <img
                  src={fine.imagePath}
                  alt="Traffic violation"
                  className="w-full h-full object-cover transition-transform duration-300 "
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30 p-3 opacity-20 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1">
                {fine.crossroad && (
                  <div
                    className="font-semibold text-white text-sm mt-0.5"
                    title={fine.crossroad}
                  >
                    {fine.crossroad.length > 30
                      ? `${fine.crossroad.substring(0, 30)}...`
                      : fine.crossroad}
                  </div>
                )}
                {/* <div className="text-white font-semibold capitalize text-sm">
                  {fine.type}
                </div> */}
                <div className="w-full flex justify-between">
                  <div className="flex justify-between items-center text-white/80 text-xs">
                    <span className="font-semibold bg-white/15 px-1.5 py-0.5 rounded">
                      {fine.vehicleInfo.plate}
                    </span>
                    {fine.speed && parseInt(fine.speed) > 0 && (
                      <span className="text-red-400 font-semibold">
                        {fine.speed} km/h
                      </span>
                    )}
                  </div>
                </div>

                {/* <div className="text-red-400 font-semibold text-sm mt-1">
                  ${fine.amount}
                </div> */}
                <div className="text-white/60 text-xs mt-0.5">
                  {new Date(fine.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FinesPanel;
