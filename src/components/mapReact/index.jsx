import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet-rotatedmarker";
import "leaflet/dist/leaflet.css";
import zebraIcon from "@/assets/zebra.png";
import cameraIcon from "@/assets/camera.png";
import crossRoadIcon from "@/assets/crossroad.png";

const MonitoringMapReact = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markersData, setMarkersData] = useState(mockdata);

  useEffect(() => {
    const storedMarkersData = localStorage.getItem("markersData");
    if (storedMarkersData) {
      setMarkersData(JSON.parse(storedMarkersData));
    } else {
      setMarkersData(mockdata);
    }
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleMarkerDragEnd = (marker, markerData) => {
    const updatedMarkersData = markersData.map((prevMarkerData) =>
      prevMarkerData.id === markerData.id
        ? {
            ...prevMarkerData,
            dragged: false,
            rotated: marker.options.rotationAngle || 0,
          }
        : prevMarkerData
    );

    setMarkersData(updatedMarkersData);

    // Save the updated markers data to localStorage
    localStorage.setItem("markersData", JSON.stringify(updatedMarkersData));
  };

  const handleMarkerDragStart = (markerData) => {
    setMarkersData((prevMarkersData) =>
      prevMarkersData.map((prevMarkerData) =>
        prevMarkerData.id === markerData.id
          ? { ...prevMarkerData, dragged: true }
          : prevMarkerData
      )
    );
  };

  const handlePopoverSlide = (event, marker) => {
    const angle = parseInt(event.target.value);
    if (marker) {
      marker.setRotationAngle(angle);
    }
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markersData.map((markerData) => (
        <Marker
          key={markerData.id}
          position={[markerData.lat, markerData.lng]}
          icon={L.icon({
            iconUrl:
              Number(markerData.type) === 1
                ? zebraIcon
                : Number(markerData.type) === 2
                ? cameraIcon
                : crossRoadIcon,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })}
          rotationAngle={markerData.rotated}
          draggable
          eventHandlers={{
            click: () => handleMarkerClick(markerData),
            dragend: (e) => handleMarkerDragEnd(e.target, markerData),
            dragstart: () => handleMarkerDragStart(markerData),
          }}
        >
          <Popup>
            <div className="popover">
              <div className="popover-content">
                <div className="popover-header">Selected Marker</div>
                <div className="popover-body">
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={
                      selectedMarker ? selectedMarker.options?.rotationAngle : 0
                    }
                    onChange={(e) => handlePopoverSlide(e, selectedMarker)}
                  />
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MonitoringMapReact;
const mockdata = [
  { id: 1, lat: 51.5, lng: -0.1, dragged: false, rotated: 0, type: 1 },
  { id: 2, lat: 51.51, lng: -0.12, dragged: false, rotated: 45, type: 1 },
  { id: 3, lat: 51.52, lng: -0.09, dragged: false, rotated: 90, type: 2 },
  {
    id: 4,
    lat: 51.53,
    lng: -0.11,
    dragged: false,
    rotated: 135,
    type: 2,
  },
  { id: 5, lat: 51.54, lng: -0.1, dragged: false, rotated: 180, type: 3 },
  {
    id: 6,
    lat: 51.55,
    lng: -0.12,
    dragged: false,
    rotated: 225,
    type: 3,
  },
  {
    id: 7,
    lat: 51.56,
    lng: -0.08,
    dragged: false,
    rotated: 270,
    type: 1,
  },
  {
    id: 8,
    lat: 51.57,
    lng: -0.11,
    dragged: false,
    rotated: 315,
    type: 2,
  },
  { id: 9, lat: 51.58, lng: -0.09, dragged: false, rotated: 0, type: 3 },
  { id: 10, lat: 51.59, lng: -0.1, dragged: false, rotated: 45, type: 1 },
];
