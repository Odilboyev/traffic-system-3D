import "maplibre-gl/dist/maplibre-gl.css";

import * as THREE from "three";

import { useEffect, useRef } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { lightLayer } from "./utils/lightLayer";
import maplibregl from "maplibre-gl";

const MapLibreContainer = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

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
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');
    map.current.addControl(new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }), 'top-right');

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
