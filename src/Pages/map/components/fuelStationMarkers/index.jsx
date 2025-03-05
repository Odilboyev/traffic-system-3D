import { useEffect, useRef } from "react";

import EnergyIcon from "../../../../assets/icons/energy.svg";
import GasIcon from "../../../../assets/icons/gas.svg";
import PetrolIcon from "../../../../assets/icons/petrol.svg";
import ReactDOM from "react-dom/client";
import { getStationIcon } from "./icons/iconSelector";
import maplibregl from "maplibre-gl";
import { useFuelStations } from "../../hooks/useFuelStations";

const MarkerIcon = ({ icon: Icon }) => {
  return (
    <>
      <Icon className="w-full h-full color-white" />
    </>
  );
};

const MarkerComponent = ({ type }) => {
  return (
    <div className="relative" onClick={() => console.log(type)}>
      <div
        className={`w-4 h-4  ${
          type === "petrol"
            ? "bg-blue-gray-500"
            : type === "gas"
            ? "bg-orange-500"
            : "bg-green-500"
        } rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
      ></div>
      <div
        onClick={() => console.log(type)}
        className={`z-10 rounded-full max-w-[40px] max-h-[40px] p-2 backdrop-blur-sm border border-white ${
          type === "petrol"
            ? "bg-blue-blue-gray-500/20"
            : type === "gas"
            ? "bg-orange-500/20"
            : "bg-green-500/20"
        }`}
      >
        <MarkerIcon icon={getStationIcon(type)} />
      </div>
    </div>
  );
};

const FuelStationMarkers = ({ map }) => {
  const markersRef = useRef({});
  const sourceAdded = useRef(false);
  const {
    stations,
    fetchStations,
    clearStations,
    filter,
    useClusteredView,
    getFilteredStations,
    zoomThreshold,
    visibleRadius,
    setSelectedStation,
    clearSelectedStation,
  } = useFuelStations();

  useEffect(() => {
    // Fetch stations when component mounts
    fetchStations();

    // Clean up when component unmounts
    return () => {
      clearStations();
    };
  }, []);

  useEffect(() => {
    if (!map || !stations.length) return;

    // Clean up existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Get filtered stations based on user preferences
    const filteredStations = getFilteredStations();

    // Filter valid stations with proper coordinates
    const validStations = filteredStations.filter((station) => {
      return (
        station.lat &&
        station.lng &&
        station.lng >= -180 &&
        station.lng <= 180 &&
        station.lat >= -90 &&
        station.lat <= 90
      );
    });

    // Handle map zoom changes to show/hide individual markers
    const updateMarkerVisibility = () => {
      const currentZoom = map.getZoom();

      // Only show individual markers at high zoom levels (>= 14)
      if (currentZoom >= zoomThreshold) {
        // Get the current map bounds to only render markers in view
        const bounds = map.getBounds();

        // Calculate visible area with some padding
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        // Filter stations to only those in the current viewport
        const visibleStations = validStations.filter((station) => {
          return (
            station.lng >= sw.lng &&
            station.lng <= ne.lng &&
            station.lat >= sw.lat &&
            station.lat <= ne.lat
          );
        });

        // Limit the number of markers to prevent performance issues
        const maxMarkers = 100;
        const stationsToRender =
          visibleStations.length > maxMarkers
            ? visibleStations.slice(0, maxMarkers)
            : visibleStations;

        // Remove markers that are no longer in view
        Object.entries(markersRef.current).forEach(([id, marker]) => {
          const coords = marker.getLngLat();
          const isVisible =
            coords.lng >= sw.lng &&
            coords.lng <= ne.lng &&
            coords.lat >= sw.lat &&
            coords.lat <= ne.lat;

          if (!isVisible) {
            marker.remove();
            delete markersRef.current[id];
          }
        });

        // Add markers for stations in view that don't have markers yet
        stationsToRender.forEach((station) => {
          if (!markersRef.current[station.id]) {
            const divContainer = document.createElement("div");
            divContainer.className = "fuel-station-marker";
            ReactDOM.createRoot(divContainer).render(
              <MarkerComponent type={station.type} />
            );

            const marker = new maplibregl.Marker({
              element: divContainer,
              anchor: "center",
            })
              .setLngLat([station.lng, station.lat])
              .addTo(map);

            markersRef.current[station.id] = marker;
          }
        });
      } else {
        // At lower zoom levels, remove all individual markers
        Object.values(markersRef.current).forEach((marker) => marker.remove());
        markersRef.current = {};
      }
    };

    // Remove existing source and layers if they exist
    if (sourceAdded.current) {
      if (map.getLayer("cluster-count")) map.removeLayer("cluster-count");
      if (map.getLayer("clusters")) map.removeLayer("clusters");
      if (map.getLayer("unclustered-point"))
        map.removeLayer("unclustered-point");
      if (map.getSource("fuel-stations")) map.removeSource("fuel-stations");
    }

    // Add the GeoJSON source with clustering enabled
    map.addSource("fuel-stations", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: validStations.map((station) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [station.lng, station.lat],
          },
          properties: {
            id: station.id,
            name: station.name || "Station",
            type: station.type || "petrol",
            address: station.address || "",
            brand: station.brand || "",
          },
        })),
      },
      cluster: useClusteredView,
      clusterMaxZoom: zoomThreshold - 2, // Reduce to ensure better transition to individual markers
      clusterRadius: visibleRadius, // Smaller radius for more precise clusters
    });

    // Add a layer for the clusters
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "fuel-stations",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "rgba(56, 139, 255, 0.8)", // Small clusters
          10,
          "rgba(0, 106, 255, 0.8)", // Medium clusters
          30,
          "rgba(1, 79, 188, 0.892)", // Large clusters
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          20, // Small clusters
          10,
          25, // Medium clusters
          30,
          35, // Large clusters
        ],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#016bff",
      },
    });

    // Add a layer for the cluster count labels
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "fuel-stations",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 14,
        "text-allow-overlap": true,
        "text-ignore-placement": true,
      },
      paint: {
        "text-color": "#ffffff",
      },
    });

    // Add a layer for unclustered points (visible at higher zoom levels)
    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "fuel-stations",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": [
          "match",
          ["get", "type"],
          "petrol",
          "rgba(1, 107, 255, 0.3)",
          "gas",
          "rgba(255, 77, 0, 0.3)",
          "electro",
          "rgba(0, 255, 0, 0.3)",
          "rgba(1, 107, 255, 0.3)", // default
        ],
        "circle-radius": 6,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    // Add click handler for unclustered points
    map.on("click", "unclustered-point", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["unclustered-point"],
      });

      if (features.length > 0) {
        const props = features[0].properties;
        console.log("Clicked fuel station:", props);
        // You can add additional actions here, like showing a popup
      }
    });

    sourceAdded.current = true;

    // Add click event for clusters
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });

      if (!features.length) return;

      const clusterId = features[0].properties.cluster_id;
      map
        .getSource("fuel-stations")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    // Change cursor on hover for clusters
    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });

    // Change cursor on hover for points
    map.on("mouseenter", "unclustered-point", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "";
    });

    // Initial update
    updateMarkerVisibility();

    // Add event handlers for map movements
    map.on("zoomend", updateMarkerVisibility);
    map.on("moveend", updateMarkerVisibility);

    // Cleanup function
    return () => {
      // Remove event listeners
      map.off("click", "clusters");
      map.off("mouseenter", "clusters");
      map.off("mouseleave", "clusters");
      map.off("mouseenter", "unclustered-point");
      map.off("mouseleave", "unclustered-point");
      map.off("click", "unclustered-point");
      map.off("zoomend", updateMarkerVisibility);
      map.off("moveend", updateMarkerVisibility);

      // Remove markers
      Object.values(markersRef.current).forEach((marker) => marker.remove());

      // Remove layers and source
      if (map.getLayer("cluster-count")) map.removeLayer("cluster-count");
      if (map.getLayer("clusters")) map.removeLayer("clusters");
      if (map.getLayer("unclustered-point"))
        map.removeLayer("unclustered-point");
      if (map.getSource("fuel-stations")) map.removeSource("fuel-stations");
    };
  }, [map, stations, filter, useClusteredView, getFilteredStations]);

  return null;
};

export default FuelStationMarkers;
