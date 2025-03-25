import "./styles.css";

import { useEffect, useRef, useState } from "react";

import { MdOutlineGavel } from "react-icons/md";
import PropTypes from "prop-types";
import ReactDOM from "react-dom/client";
import { getFineMarkers } from "../../../../api/api.handlers";
import maplibregl from "maplibre-gl";

const FinePopup = ({ data }) => {
  const { name, count, violations } = data;

  return (
    <div className="fine-popup-content">
      <div className="fine-popup-header">
        <h3>{name}</h3>
        {/* <button className="fine-popup-close" onClick={onClose}>
          <IoClose />
        </button> */}
      </div>

      <div className="fine-popup-main">
        <div className="fine-popup-current">
          <div className="fine-popup-icon">
            <MdOutlineGavel size="3em" />
          </div>
          <div className="fine-popup-count">{count}</div>
          <div className="fine-popup-desc">Total violations today</div>
        </div>
      </div>

      <div className="fine-popup-violations">
        {violations.map((violation, index) => (
          <div key={index} className="fine-popup-violation-item">
            <div className="fine-popup-violation-name">{violation.name}</div>
            <div className="fine-popup-violation-count">{violation.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

FinePopup.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    violations: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const FineHeatmap = ({ map }) => {
  const popupRef = useRef(null);
  const [fineMarkers, setFineMarkers] = useState([]);

  // Fetch fine markers
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const markers = await getFineMarkers();
        setFineMarkers(markers);
      } catch (error) {
        console.error("Error fetching fine markers:", error);
      }
    };
    fetchMarkers();
  }, []);

  // // Initialize map sources and layers
  // useEffect(() => {
  //   if (!map) return;

  //   try {
  //     // Add fine markers source
  //     map.addSource("fine-markers", {
  //       type: "geojson",
  //       data: {
  //         type: "FeatureCollection",
  //         features: [],
  //       },
  //     });

  //     // Add fine markers layer
  //     map.addLayer({
  //       id: "fine-markers-pulse",
  //       type: "circle",
  //       source: "fine-markers",
  //       paint: {
  //         "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 5, 15, 10],
  //         "circle-color": "#ff4444",
  //         "circle-opacity": ["get", "pulse"],
  //         "circle-stroke-width": 2,
  //         "circle-stroke-color": "#ff4444",
  //       },
  //     });

  //     setSourceAdded(true);
  //   } catch (error) {
  //     console.error("Error initializing map sources and layers:", error);
  //   }
  // }, [map]);

  // Update markers when fineMarkers change
  useEffect(() => {
    if (!map) return;
    console.log("fines are loaded");

    // Add fine markers source
    if (!map.getSource('fine-markers')) {
      map.addSource("fine-markers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      // Add fine markers layer
      map.addLayer({
        id: "fine-markers-pulse",
        type: "circle",
        source: "fine-markers",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 5, 15, 10],
          "circle-color": "#ff4444",
          "circle-opacity": ["get", "pulse"],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ff4444",
        },
      });
    }

    if (!Array.isArray(fineMarkers) || fineMarkers.length === 0) {
      console.error("fineMarkers is not an array or is empty:", fineMarkers);
      return;
    }
    console.log(fineMarkers, "fine markers");
    // Update markers data
    const features = fineMarkers
      .map((marker) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(marker.crossroad_location_lng),
            parseFloat(marker.crossroad_location_lat),
          ],
        },
        properties: {
          id: marker.crossroad_id,
          name: marker.crossroad_name,
          count: marker.count_all_today,
          pulse: 0,
          violations: marker.count_by_cat_today,
        },
      }))
      .filter((feature) =>
        feature.geometry.coordinates.every((coord) => !isNaN(coord))
      );

    console.log("Updating markers with", features.length, "features");
    map.getSource("fine-markers").setData({
      type: "FeatureCollection",
      features,
    });

    // Add click event for popups
    const handleMarkerClick = (e) => {
      const feature = e.features[0];
      const coordinates = feature.geometry.coordinates.slice();
      const { name, count, violations } = feature.properties;

      // Remove existing popup if any
      if (popupRef.current) popupRef.current.remove();

      // Create new popup with React component
      const container = document.createElement("div");
      const root = ReactDOM.createRoot(container);
      root.render(
        <FinePopup
          data={{
            name,
            count,
            violations:
              typeof violations === "string"
                ? JSON.parse(violations)
                : violations,
          }}
          onClose={() => {
            if (popupRef.current) {
              popupRef.current.remove();
              popupRef.current = null;
            }
          }}
        />
      );

      // Create and set new popup
      try {
        popupRef.current = new maplibregl.Popup({ className: "fine-popup" })
          .setLngLat(coordinates)
          .setDOMContent(container)
          .addTo(map);
      } catch (error) {
        console.error("Error creating popup:", error);
      }
    };

    // Add click event listener
    map.on("click", "fine-markers-pulse", handleMarkerClick);

    // Cleanup function
    return () => {
      // Remove event listener
      map.off("click", "fine-markers-pulse", handleMarkerClick);

      // Remove popup if it exists
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      // Remove layer and source if they exist
      if (map.getLayer("fine-markers-pulse")) {
        map.removeLayer("fine-markers-pulse");
      }
      if (map.getSource("fine-markers")) {
        map.removeSource("fine-markers");
      }
    };
  }, [map, fineMarkers]);

  return null;
};

FineHeatmap.propTypes = {
  map: PropTypes.shape({
    addSource: PropTypes.func,
    addLayer: PropTypes.func,
    removeLayer: PropTypes.func,
    removeSource: PropTypes.func,
    getLayer: PropTypes.func,
    getSource: PropTypes.func,
    on: PropTypes.func,
    off: PropTypes.func,
    isStyleLoaded: PropTypes.func,
    getCanvas: PropTypes.func,
    getZoom: PropTypes.func,
    setPaintProperty: PropTypes.func,
  }),
};

export default FineHeatmap;
