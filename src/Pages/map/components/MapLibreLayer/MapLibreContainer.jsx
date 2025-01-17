import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

import * as THREE from "three";

import { useEffect, useRef } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Supercluster from "supercluster";
import { lightLayer } from "./utils/lightLayer";
import maplibregl from "maplibre-gl";
import { useMapMarkers } from "../../hooks/useMapMarkers";

const MapLibreContainer = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const supercluster = useRef(null);

  const {
    markers,
    setMarkers,
    getDataHandler,
    clearMarkers,
    updateMarkers: updateMarkerData,
    useClusteredMarkers,
  } = useMapMarkers();

  const isCamera = (type) => type === 1 || type === 5 || type === 6;

  const cameraType = (type) => {
    switch (type) {
      case 1:
        return "cameratraffic";
      case 5:
        return "cameraview";
      case 6:
        return "camerapdd";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: lightLayer,
      zoom: 16,
      center: [69.254643, 41.321151],
      pitch: 0,
      bearing: 0,

      canvasContextAttributes: { antialias: true },
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.addControl(new maplibregl.FullscreenControl(), "top-right");
    map.current.addControl(new maplibregl.ScaleControl(), "bottom-left");
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "top-right"
    );

    // Initialize supercluster
    supercluster.current = new Supercluster({
      radius: 100,
      maxZoom: 16,
    });

    const loadClusterData = () => {
      if (!markers.length || !map.current) return;

      const points = markers
        .map((marker) => ({
          type: "Feature",
          properties: {
            ...marker,
            coordinates: [parseFloat(marker.lng), parseFloat(marker.lat)],
          },
          geometry: {
            type: "Point",
            coordinates: [parseFloat(marker.lng), parseFloat(marker.lat)],
          },
        }))
        .filter(
          (point) =>
            !isNaN(point.geometry.coordinates[0]) &&
            !isNaN(point.geometry.coordinates[1])
        );

      if (!points.length) return;
      supercluster.current.load(points);
    };

    const renderClusters = () => {
      if (!markers.length || !map.current) return;

      try {
        // Clear existing cluster markers only
        document
          .querySelectorAll(".cluster-marker")
          .forEach((marker) => marker.remove());

        const bounds = map.current.getBounds();
        const zoom = Math.floor(map.current.getZoom());

        // Get only clusters
        const clusters = supercluster.current
          .getClusters(
            [
              bounds.getWest(),
              bounds.getSouth(),
              bounds.getEast(),
              bounds.getNorth(),
            ],
            zoom
          )
          .filter((props) => props.properties.cluster);

        clusters.forEach((props) => {
          const coordinates = props.geometry.coordinates;
          // Create cluster marker
          const el = document.createElement("div");
          el.className = "marker-container cluster-marker";
          el.innerHTML = `<div class="cluster-count">${props.properties.point_count}</div>`;
          el.addEventListener("click", () => {
            const expansionZoom = supercluster.current.getClusterExpansionZoom(
              props.properties.cluster_id
            );
            map.current.flyTo({
              center: coordinates,
              zoom: expansionZoom,
              duration: 300,
            });
          });
          new maplibregl.Marker({
            element: el,
            trackPointer: true,
          })
            .setLngLat(coordinates)
            .addTo(map.current);
        });
      } catch (error) {
        console.error("Error rendering clusters:", error);
      }
    };

    const renderIndividualMarkers = () => {
      if (!markers.length || !map.current) return;

      try {
        // Clear existing individual markers
        document
          .querySelectorAll(".marker-container:not(.cluster-marker)")
          .forEach((marker) => marker.remove());

        const bounds = map.current.getBounds();
        const zoom = Math.floor(map.current.getZoom());

        // Get only non-clustered points
        const points = supercluster.current
          .getClusters(
            [
              bounds.getWest(),
              bounds.getSouth(),
              bounds.getEast(),
              bounds.getNorth(),
            ],
            zoom
          )
          .filter((props) => !props.properties.cluster);

        points.forEach((props) => {
          const coordinates = props.geometry.coordinates;
          // Create individual marker
          const el = document.createElement("img");
          el.src = `/icons/${props.properties.icon}`;
          el.onclick = () => {
            console.log("Marker clicked:", props.properties);
          };
          const markerClasses = ["marker-container"];

          if (isCamera(props.properties.type)) {
            markerClasses.push("camera-marker");
          }
          if (props.properties.statuserror) {
            markerClasses.push("error-marker");
          }

          el.className = markerClasses.join(" ");

          // Add popup with camera name if it exists
          if (props.properties.cname) {
            const popup = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
            });

            el.addEventListener("mouseenter", () => {
              popup
                .setLngLat(coordinates)
                .setHTML(
                  `<div class="marker-popup">${props.properties.cname}</div>`
                )
                .addTo(map.current);
            });

            el.addEventListener("mouseleave", () => {
              popup.remove();
            });
          }

          new maplibregl.Marker({
            element: el,
            trackPointer: true,
          })
            .setLngLat(coordinates)
            .addTo(map.current);

          // Add click handler for camera details
          if (isCamera(props.properties.type)) {
            el.addEventListener("click", () => {
              console.log("Camera clicked:", props.properties);
            });
          }
        });
      } catch (error) {
        console.error("Error rendering individual markers:", error);
      }
    };

    map.current.on("load", () => {
      loadClusterData();
      renderClusters();
      // renderIndividualMarkers();
    });

    // Update only clusters during map movement
    map.current.on("move", renderClusters);

    // Update individual markers when movement ends
    // map.current.on("moveend", renderIndividualMarkers);

    // map.current.on("zoom", renderClusters);
    // Update everything on zoom end
    map.current.on("zoomend", () => {
      renderClusters();
      renderIndividualMarkers();
    });

    // Initial data fetch and setup
    getDataHandler();

    // Wait for map to load before adding custom layer
    map.current.on("load", () => {
      // parameters to ensure the model is georeferenced correctly on the map
      const modelOrigin = [69.254643, 41.321151];
      const modelAltitude = 0;
      const modelRotate = [0, Math.PI, 0]; // Reset rotation to face up

      const modelAsMercatorCoordinate =
        maplibregl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);

      // transformation parameters to position, rotate and scale the 3D model onto the map
      const modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 20,
      };

      const customLayer = {
        id: "3d-model",
        type: "custom",
        renderingMode: "3d",
        onAdd(map, gl) {
          this.map = map;
          console.log("Custom layer onAdd called");

          // Initialize WebGL context
          this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true,
          });
          console.log("WebGL renderer initialized");

          this.renderer.autoClear = false;
          this.renderer.setPixelRatio(window.devicePixelRatio);

          // Create camera
          this.camera = new THREE.PerspectiveCamera(
            45,
            gl.canvas.width / gl.canvas.height,
            0.1,
            2000
          );
          this.camera.matrixAutoUpdate = false;

          // Create scene
          this.scene = new THREE.Scene();
          console.log("Scene and camera initialized");

          // Lights
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
          directionalLight.position.set(0, -70, 100).normalize();
          this.scene.add(directionalLight);

          const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
          directionalLight2.position.set(0, 70, 100).normalize();
          this.scene.add(directionalLight2);

          const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
          this.scene.add(ambientLight);
          console.log("Lights added to scene");

          // Load model
          const loader = new GLTFLoader();
          loader.load(
            "/models/traffic.gltf",
            (gltf) => {
              console.log("GLTF model loaded successfully:", gltf);

              // Apply transformations
              gltf.scene.scale.set(1, 1, 1); // Reset scale, we'll use modelTransform scale
              gltf.scene.rotation.set(0, Math.PI / 2, -Math.PI / 2); // Reset rotation, we'll use modelTransform rotation

              // Calculate the bounding box
              const box = new THREE.Box3().setFromObject(gltf.scene);
              const center = box.getCenter(new THREE.Vector3());
              const size = box.getSize(new THREE.Vector3());

              // Adjust position to place bottom at ground level
              gltf.scene.position.set(
                -center.x,
                -center.y + size.y,
                -(center.z + size.z / 2)
              );

              this.scene.add(gltf.scene);
              console.log("Model added to scene with transformations");
            },
            (progress) => {
              console.log(
                "Loading progress:",
                (progress.loaded / progress.total) * 100 + "%"
              );
            },
            (error) => {
              console.error("Error loading GLTF model:", error);
            }
          );
        },
        render(gl, matrix) {
          if (!this.renderer || !this.scene || !this.camera) {
            return;
          }

          const m = new THREE.Matrix4().fromArray(matrix);
          const l = new THREE.Matrix4()
            .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ
            )
            .scale(
              new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale
              )
            );

          // Create rotation matrix
          const rotation = new THREE.Matrix4()
            .makeRotationX(modelTransform.rotateX)
            .multiply(new THREE.Matrix4().makeRotationY(modelTransform.rotateY))
            .multiply(
              new THREE.Matrix4().makeRotationZ(modelTransform.rotateZ)
            );

          // Apply transformations in correct order
          const modelMatrix = new THREE.Matrix4()
            .multiply(l)
            .multiply(rotation);

          this.camera.projectionMatrix = m.multiply(modelMatrix);
          this.renderer.state.reset();
          this.renderer.render(this.scene, this.camera);
          this.map.triggerRepaint();
        },
      };

      map.current.addLayer(customLayer);
    });

    return () => map.current?.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
  );
};

export default MapLibreContainer;
