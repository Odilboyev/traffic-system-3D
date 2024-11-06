import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { ToastContainer } from "react-toastify";
import MapControls from "../MapControls";
import MapEvents from "../MapEvents";
import MarkerComponent from "../markers/DynamicMarkers";

const MapContainerComponent = ({
  map,
  center,
  zoom,
  currentLayerDetails,
  errorMessage,
  theme,
  controls,
  markers,
  events,
}) => {
  return (
    <MapContainer
      ref={map}
      id="monitoring"
      attributionControl={false}
      center={center}
      zoom={zoom}
      zoomDelta={0.6}
      style={{ height: "100vh", width: "100%" }}
      zoomControl={false}
    >
      <ToastContainer containerId="alarms" className="z-[9998]" />
      {errorMessage && (
        <div className="w-[50vw] h-[20vh] z-[9999] rounded-md bg-blue-gray-900 backdrop-blur-md flex justify-center items-center text-white">
          {errorMessage}
        </div>
      )}

      <MapEvents {...events} />

      {currentLayerDetails && (
        <TileLayer
          maxNativeZoom={currentLayerDetails.maxNativeZoom}
          url={currentLayerDetails.url}
          attribution={currentLayerDetails.attribution}
          key={currentLayerDetails.name}
          maxZoom={22}
        />
      )}

      <MapControls {...controls} theme={theme} />

      <MarkerComponent {...markers} />
    </MapContainer>
  );
};

export default MapContainerComponent;
