import * as THREE from "three";
import { Marker, useMap } from "@vis.gl/react-maplibre";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

const ThreeJsMarker = ({ longitude, latitude, altitude = 0 }) => {
  const containerRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const map = useMap();

  useEffect(() => {
    if (!containerRef.current || !map.current) return;

    // Convert the marker's longitude/latitude to Mercator coordinates
    const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
      [longitude, latitude],
      altitude
    );

    // Create the transformation parameters
    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: Math.PI / 2,
      rotateY: 0,
      rotateZ: 0,
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up camera (we'll update its projection matrix in render)
    const camera = new THREE.Camera();
    cameraRef.current = camera;

    // Set up renderer with MapLibre GL JS canvas
    const renderer = new THREE.WebGLRenderer({
      canvas: map.current.getCanvas(),
      context: map.current.getCanvas().getContext('webgl'),
      antialias: true
    });
    renderer.autoClear = false;
    rendererRef.current = renderer;

    // Create two directional lights
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    scene.add(directionalLight2);

    // Create pole
    const poleGeometry = new THREE.CylinderGeometry(0.6, 0.6, 16, 16);
    const poleMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.2,
      shininess: 100,
      specular: 0x00ffff,
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 8;
    pole.castShadow = true;
    scene.add(pole);

    // Create camera body
    const bodyGeometry = new THREE.BoxGeometry(3.2, 2.4, 4.8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.2,
      shininess: 100,
      specular: 0x00ffff,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 16;
    body.position.z = 1.6;
    body.castShadow = true;
    scene.add(body);

    // Add details to camera body
    const detailGeometry = new THREE.BoxGeometry(3.4, 2.6, 0.4);
    const detailMaterial = new THREE.MeshPhongMaterial({
      color: 0x008888,
      emissive: 0x008888,
      emissiveIntensity: 0.1,
      shininess: 100,
    });
    const detail = new THREE.Mesh(detailGeometry, detailMaterial);
    detail.position.z = -0.8;
    body.add(detail);

    // Create camera lens
    const lensGeometry = new THREE.CylinderGeometry(1, 1, 1.6, 32);
    const lensMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
      shininess: 100,
      specular: 0x00ffff,
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.x = Math.PI / 2;
    lens.castShadow = true;
    body.add(lens);

    // Create render function
    const render = () => {
      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX
      );
      const rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY
      );
      const rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ
      );

      const m = new THREE.Matrix4().fromArray(map.current.transform.projMatrix);
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
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

      camera.projectionMatrix = m.multiply(l);
      renderer.resetState();
      renderer.render(scene, camera);
      map.current.triggerRepaint();
    };

    // Add the custom layer to the map
    map.current.addLayer({
      id: '3d-model',
      type: 'custom',
      renderingMode: '3d',
      onAdd: () => {
        // Nothing to do here since we've already set up the scene
      },
      render: (gl, matrix) => {
        render();
      }
    });

    return () => {
      if (map.current) {
        map.current.removeLayer('3d-model');
      }
      scene.clear();
      renderer.dispose();
    };
  }, [longitude, latitude, altitude, map]);

  return null;
};

export default ThreeJsMarker;
