import "./styles.finesPanel.css";

import { useEffect, useRef, useState } from "react";

import SlidePanel from "../../../../components/SlidePanel/SlidePanel";
import { getRegions } from "../../../../api/api.handlers";
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
  const {
    fines,
    showFinesPanel,
    fetchFinesData,
    flyToFine,
    selectedFine,
    socketStatus,
  } = useFines();
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
  useEffect(() => {
    fetchFinesData();
  }, [fetchFinesData]);

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
      <SlidePanel
        side="right"
        isOpen={true}
        content={
          <div
            ref={panelRef}
            className=" w-[30vw] h-[85vh] mt-[10%] bg-[rgba(24,28,41,0.10)] rounded-lg shadow-lg overflow-y-auto flex flex-col z-[100] backdrop-blur-md transition-all duration-300"
          >
            {/* Display up to 8 fines in a 2x4 grid layout */}
            <div className="flex-1 overflow-y-auto p-2 grid grid-cols-3 grid-rows-[5] gap-2 scrollbar-hide">
              {fines?.map((fine) => (
                <div
                  key={fine.id}
                  className={`relative fine-item bg-white/10 rounded-md overflow-hidden cursor-pointer transition-all duration-200  group  ${
                    animatingFineId === fine.id ? "animate-pulse-gold" : ""
                  }`}
                  onClick={() => flyToFine(fine)}
                >
                  {" "}
                  {fine.carnum && (
                    <div
                      className="absolute top-0 right-0 font-semibold text-white text-xs  bg-black/40 rounded-bl-lg  "
                      title={fine.carnum}
                    >
                      {fine.carnum}
                    </div>
                  )}
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={fine?.photo_link}
                      alt="Traffic violation"
                      className="w-full h-full object-cover transition-transform duration-300 "
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30 p-2 opacity-5 group-hover:opacity-100 transition-opacity duration-400 flex flex-col gap-1">
                    {fine.crossroad && (
                      <div
                        className="font-semibold text-white text-sm mt-0.5"
                        title={fine.crossroad?.name}
                      >
                        {fine.crossroad.name?.length > 30
                          ? `${fine.crossroad?.name.substring(0, 30)}...`
                          : fine.crossroad?.name}
                      </div>
                    )}
                    {fine.violation_name && (
                      <div
                        className="font-semibold text-white text-xs mt-0.5 bg-red-400/20 p-1 rounded-full truncate"
                        title={fine.violation_name}
                      >
                        {fine.violation_name}
                      </div>
                    )}

                    {/* <div className="text-white font-semibold capitalize text-sm">
                  {fine.type}
                </div> */}
                    <div className="w-full flex flex-col gap-1.5 justify-center">
                      {fine.region_name && (
                        <div className="text-[10px] text-blue-400 font-medium truncate">
                          {fine.region_name}
                        </div>
                      )}
                      <div className="flex justify-between items-center text-white/80 text-xs">
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
                    <div className="text-white/60 text-xs">
                      {new Date(fine.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </>
  );
};

export default FinesPanel;
