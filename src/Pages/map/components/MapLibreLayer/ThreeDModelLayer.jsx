import * as THREE from "three";

import { useCallback, useEffect, useState } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import PropTypes from "prop-types";
import maplibregl from "maplibre-gl";

const ThreeDModelLayer = ({ map }) => {
  const [modelLoaded, setModelLoaded] = useState(false);

  const addCustomLayer = useCallback(() => {
    if (!map || modelLoaded) return;

    const modelOrigin = [69.254643, 41.321151];
    const modelAltitude = 0;
    const modelRotate = [0, Math.PI, 0];
    const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );
    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 5,
    };

    const customLayer = {
      id: "3d-model",
      type: "custom",
      renderingMode: "3d",
      onAdd(map, gl) {
        this.map = map;
        this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
        });
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera = new THREE.PerspectiveCamera(
          45,
          gl.canvas.width / gl.canvas.height,
          0.1,
          2000
        );
        this.camera.matrixAutoUpdate = false;
        this.scene = new THREE.Scene();
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight2.position.set(0, 70, 100).normalize();
        this.scene.add(directionalLight2);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        const loader = new GLTFLoader();
        loader.load(
          "/models/traffic.gltf",
          (gltf) => {
            gltf.scene.scale.set(1, 1, 1);
            gltf.scene.rotation.set(0, Math.PI / 2, -Math.PI / 2);
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            gltf.scene.position.set(
              -center.x,
              -center.y + size.y,
              -(center.z + size.z / 2)
            );
            this.scene.add(gltf.scene);
            setModelLoaded(true);
            this.map.triggerRepaint();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            setModelLoaded(false);
          }
        );
      },
      render(gl, matrix) {
        if (!this.renderer || !this.scene || !this.camera) return;
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
        const rotation = new THREE.Matrix4()
          .makeRotationX(modelTransform.rotateX)
          .multiply(new THREE.Matrix4().makeRotationY(modelTransform.rotateY))
          .multiply(new THREE.Matrix4().makeRotationZ(modelTransform.rotateZ));
        const modelMatrix = new THREE.Matrix4().multiply(l).multiply(rotation);
        this.camera.projectionMatrix = m.multiply(modelMatrix);
        this.renderer.state.reset();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
      },
    };

    // Remove existing layer if it exists
    if (map.getLayer("3d-model")) {
      map.removeLayer("3d-model");
    }

    map.addLayer(customLayer);
  }, [map, modelLoaded]);

  useEffect(() => {
    if (!map) return;

    // Attempt to add layer immediately and on map idle
    addCustomLayer();
    map.on("render", addCustomLayer);

    return () => {
      if (map) {
        map.off("idle", addCustomLayer);
        if (map.getLayer("3d-model")) {
          map.removeLayer("3d-model");
        }
      }
    };
  }, [map, addCustomLayer]);

  return null;
};

ThreeDModelLayer.propTypes = {
  map: PropTypes.shape({
    getCanvas: PropTypes.func.isRequired,
    addLayer: PropTypes.func.isRequired,
    getLayer: PropTypes.func.isRequired,
    removeLayer: PropTypes.func.isRequired,
    getSource: PropTypes.func.isRequired,
    removeSource: PropTypes.func.isRequired,
    triggerRepaint: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired,
  }),
};

export default ThreeDModelLayer;
