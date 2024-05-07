import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import zebraIcon from "@/assets/zebra.png";
import cameraIcon from "@/assets/camera.png";
import crossRoadIcon from "@/assets/crossroad.png";
import mockdata from "./mock";

const savedData = localStorage.getItem("markersData");
const MonitoringMap = () => {
  const mapRef = useRef(null);
  const markerClusterGroupRef = useRef(null);
  const markerRefs = useRef([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markersData, setMarkersData] = useState(
    savedData ? JSON.parse(savedData) : mockdata
  );
  const [filterType, setFilterType] = useState(1);
  const [filteredMarkersData, setFilteredMarkersData] = useState(markersData);

  const createMarkers = (data) => {
    markerClusterGroupRef.current.clearLayers();
    markerRefs.current = [];

    data.forEach((markerData) => {
      const marker = L.marker([markerData.lat, markerData.lng], {
        icon: L.divIcon({
          className: "rounded-full p-1 bg-white shadow-lg shadow-black", // CSS class for the rounded div
          html: `<div><img src="${
            markerData.type === 1
              ? zebraIcon
              : markerData.type === 2
              ? cameraIcon
              : crossRoadIcon
          }" style="width:100%"/></div>`, // HTML for the smaller icon
          iconSize: [32, 32], // Size of the rounded div
          iconAnchor: [16, 16], // Anchor position of the rounded div
        }),
        rotationAngle: markerData.rotated,
        draggable: true,
      });

      marker.on("click", () => {
        setSelectedMarker(marker);
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

      marker.on("dragend", (e) => {
        console.log(e.target.getLatLng());
        setMarkersData((prevMarkersData) => {
          const updatedMarkersData = prevMarkersData.map((prevMarkerData) => {
            if (prevMarkerData.id === markerData.id) {
              // Update the dragged and rotated properties
              return {
                ...prevMarkerData,
                dragged: false,
                lat: e.target.getLatLng().lat,
                lng: e.target.getLatLng().lng,
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
          console.log(updatedMarkersData, "updatedMarkersData");

          return updatedMarkersData;
        });
      });

      markerRefs.current.push(marker);
      markerClusterGroupRef.current.addLayer(marker);
    });
  };

  const handleFilter = (event) => {
    const type = event.target.value;
    setFilterType(type);

    setFilteredMarkersData(
      markersData.filter((marker) => {
        if (type == 0) {
          return true; // No filter applied, show all markers
        }
        return marker.type === Number(type);
      })
    );
  };

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
    const OpenStreeMap = L.tileLayer(
      "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "Burgut Soft" }
    );

    const Transport = L.tileLayer(
      "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=d1a9e90db928407291e29bc3d1264714",
      { attribution: "Burgut Soft" }
    );

    const Transport_Dark = L.tileLayer(
      "https://pm.bgsoft.uz/adminpanel/mapcacher.php?link=https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=d1a9e90db928407291e29bc3d1264714",
      { attribution: "Burgut Soft" }
    );

    OpenStreeMap.addTo(map); // Add the OpenStreeMap layer by default

    const tileLayers = {
      OpenStreetMap: OpenStreeMap,
      Transport: Transport,
      "Transport Dark": Transport_Dark,
    };
    L.control.layers(tileLayers).addTo(map);

    markerClusterGroupRef.current = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 10, // Adjust this value based on your needs
    }).addTo(map);

    //   setMarkersData((prevMarkersData) =>
    //     prevMarkersData.map((prevMarkerData) =>
    //       prevMarkerData.id === markerData.id
    //         ? { ...prevMarkerData, dragged: true }
    //         : prevMarkerData
    //     )
    //   );
    // });

    // marker.on("dragend", () => {
    //   setMarkersData((prevMarkersData) => {
    //     const updatedMarkersData = prevMarkersData.map((prevMarkerData) => {
    //       if (prevMarkerData.id === markerData.id) {
    //         // Update the dragged and rotated properties
    //         return {
    //           ...prevMarkerData,
    //           dragged: false,
    //           rotated: marker.options.rotationAngle || 0,
    //         };
    //       }
    //       return prevMarkerData;
    //     });

    //     // Save the updated markers data to localStorage
    //     localStorage.setItem("markersData", JSON.stringify(updatedMarkersData));

    //     return updatedMarkersData;
    //   });
    // });

    // markerRefs.current.push(marker);
    // markerClusterGroupRef.current.addLayer(marker);

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

  useEffect(() => {
    createMarkers(filteredMarkersData);
  }, [filteredMarkersData]);

  const handlePopoverSlide = (event) => {
    const rotation = Number(event.target.value);

    if (selectedMarker) {
      selectedMarker.setRotationAngle(rotation);
      setMarkersData((prevMarkersData) => {
        const updatedData = prevMarkersData.map((prevMarkerData) =>
          prevMarkerData.id === selectedMarker.options.id
            ? { ...prevMarkerData, rotated: rotation }
            : prevMarkerData
        );
        localStorage.setItem("markersData", JSON.stringify(updatedData));
        return updatedData;
      });
    }
  };

  return (
    <div>
      <div>
        <select value={filterType} onChange={handleFilter}>
          <option value={0}>All</option>
          <option value={1}>Zebra</option>
          <option value={2}>Camera</option>
          <option value={3}>Crossroad</option>
        </select>
      </div>
      <div
        id="map"
        style={{ width: "100%", height: "500px" }}
        ref={mapRef}
      ></div>
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
