import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import zebraIcon from "@/assets/zebra.png";
import cameraIcon from "@/assets/camera.png";
import crossRoadIcon from "@/assets/crossroad.png";

const MonitoringMap = () => {
  const mapRef = useRef(null);
  const markerClusterGroupRef = useRef(null);
  const markerRefs = useRef([]);
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
  useEffect(() => {
    const map = L.map(mapRef.current);

    // Restore map center and zoom from localStorage if available
    const storedCenter = localStorage.getItem("mapCenter");
    const storedZoom = localStorage.getItem("mapZoom");
    if (storedCenter && storedZoom) {
      const [lat, lng] = JSON.parse(storedCenter);
      const zoom = JSON.parse(storedZoom);
      map.setView([lat, lng], zoom);
    } else {
      map.setView([51.505, -0.09], 13);
    }

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data © OpenStreetMap contributors",
    }).addTo(map);

    markerClusterGroupRef.current = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 28, // Adjust this value based on your needs
    }).addTo(map);

    markersData.forEach((markerData) => {
      const marker = L.marker([markerData.lat, markerData.lng], {
        icon: L.icon({
          iconUrl:
            Number(markerData.type) == 1
              ? zebraIcon
              : Number(markerData.type) == 2
              ? cameraIcon
              : crossRoadIcon,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
        rotationAngle: markerData.rotated,
        draggable: true,
      });

      marker.on("click", () => {
        setSelectedMarker(marker);

        //       marker.bindPopup(`
        //   <div>
        //     <div class="popup-header">Selected Marker</div>
        //     <div class="popup-body">
        //       <input
        //         type="range"
        //         min="0"
        //         max="360"
        //         value="${marker.options.rotationAngle}"
        //         onchange="handlePopupSlide(${markerData.id})"
        //       />
        //       <p>${marker.options.rotationAngle} degrees</p>
        //       <div class="marker-icon">
        //         <img
        //           src="${marker.options.icon.options.iconUrl}"
        //           alt="Marker"
        //           style="transform: rotate(${marker.options.rotationAngle}deg)"
        //         />
        //       </div>
        //     </div>
        //   </div>
        // `);
        const handlePopupSlide = (event, markerId) => {
          const rotation = Number(event.target.value);
          const updatedMarkersData = markersData.map((markerData) =>
            markerData.id === markerId
              ? { ...markerData, rotated: rotation }
              : markerData
          );
          setMarkersData(updatedMarkersData);
          const marker = markerRefs.current.find(
            (marker) => marker.options.id === markerId
          );
          if (marker) {
            marker.options.rotationAngle = rotation;
            marker.setIcon(
              L.icon({
                iconUrl: marker.options.icon.options.iconUrl,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                rotationAngle: rotation,
              })
            );
          }
        };
      });
      marker.on("dragstart", () => {
        setMarkersData((prevMarkersData) =>
          prevMarkersData.map((prevMarkerData) =>
            prevMarkerData.id === markerData.id
              ? { ...prevMarkerData, dragged: true }
              : prevMarkerData
          )
        );
      });

      marker.on("dragend", () => {
        setMarkersData((prevMarkersData) => {
          const updatedMarkersData = prevMarkersData.map((prevMarkerData) => {
            if (prevMarkerData.id === markerData.id) {
              // Update the dragged and rotated properties
              return {
                ...prevMarkerData,
                dragged: false,
                rotated: marker.options.rotationAngle || 0,
              };
            }
            return prevMarkerData;
          });

          // Save the updated markers data to localStorage
          localStorage.setItem(
            "markersData",
            JSON.stringify(updatedMarkersData)
          );

          return updatedMarkersData;
        });
      });

      markerRefs.current.push(marker);
      markerClusterGroupRef.current.addLayer(marker);
    });

    // Save map center and zoom to localStorage on change
    map.on("moveend", () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      localStorage.setItem(
        "mapCenter",
        JSON.stringify([center.lat, center.lng])
      );
      localStorage.setItem("mapZoom", JSON.stringify(zoom));
    });

    return () => {
      map.remove();
    };
  }, []);

  const handlePopoverSlide = (event) => {
    const rotation = Number(event.target.value);

    if (selectedMarker) {
      selectedMarker.setRotationAngle(rotation);
      setMarkersData((prevMarkersData) =>
        prevMarkersData.map((prevMarkerData) =>
          prevMarkerData.id === selectedMarker.options.id
            ? { ...prevMarkerData, rotated: rotation }
            : prevMarkerData
        )
      );
    }
  };

  return (
    <div>
      <div ref={mapRef} className="h-[70vh]"></div>
      {selectedMarker && (
        <div className="popover">
          <div className="popover-content">
            <div className="popover-header">Selected Marker</div>
            <div className="popover-body">
              <input
                type="range"
                min={0}
                max={360}
                value={
                  selectedMarker ? selectedMarker.options.rotationAngle : 0
                }
                onChange={handlePopoverSlide}
              />
              <p>{selectedMarker.options.rotationAngle} degrees</p>
              <div className="w-10">
                <img
                  src={selectedMarker.options.icon.options.iconUrl}
                  alt="Marker"
                  style={{
                    transform: `rotate(${selectedMarker.options.rotationAngle}deg)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringMap;
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
