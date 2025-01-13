import * as THREE from "three";

import { Marker, useMap } from "@vis.gl/react-maplibre";
import { useEffect, useRef } from "react";

const ThreeJsMarker = ({ longitude, latitude }) => {
  const containerRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const map = useMap();

  useEffect(() => {
    if (!containerRef.current || !map.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 50, 50);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

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
    const lensGroup = new THREE.Group();

    // Main lens cylinder
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
    lensGroup.add(lens);

    // Lens glass
    const glassGeometry = new THREE.CircleGeometry(0.8, 32);
    const glassMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      emissive: 0x003333,
      emissiveIntensity: 0.5,
      shininess: 100,
      specular: 0x00ffff,
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.y = 0.82;
    glass.rotation.x = -Math.PI / 2;
    lensGroup.add(glass);

    lensGroup.position.y = 16;
    lensGroup.position.z = 4;

    // Create mounting bracket
    const bracketGeometry = new THREE.BoxGeometry(0.8, 3.2, 0.8);
    const bracketMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.2,
      shininess: 100,
      specular: 0x00ffff,
    });
    const bracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
    bracket.position.y = 16;
    bracket.castShadow = true;

    // Add status LED
    const ledGeometry = new THREE.CircleGeometry(0.4, 16);
    const ledMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.5,
      shininess: 100,
    });
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.set(1.2, 16, 2.42);
    led.rotation.y = Math.PI;

    // Add cooling fins
    const finGroup = new THREE.Group();
    const finGeometry = new THREE.BoxGeometry(3.6, 0.1, 0.6);
    const finMaterial = new THREE.MeshPhongMaterial({
      color: 0x008888,
      emissive: 0x008888,
      emissiveIntensity: 0.1,
      shininess: 100,
    });

    for (let i = 0; i < 5; i++) {
      const fin = new THREE.Mesh(finGeometry, finMaterial);
      fin.position.y = 15.6 + i * 0.4;
      fin.position.z = -1.6;
      finGroup.add(fin);
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create a container for rotation
    const rotationGroup = new THREE.Group();
    rotationGroup.add(pole, body, lensGroup, bracket, led, finGroup);
    scene.add(rotationGroup);

    // Initial render
    renderer.render(scene, camera);

    // Map move handler
    const handleMove = (e) => {
      if (sceneRef.current && rendererRef.current && cameraRef.current) {
        const viewState = e.viewState;
        if (viewState) {
          // Apply pitch to camera
          const pitch = THREE.MathUtils.degToRad(viewState.pitch);
          
          // Update camera position for pitch
          camera.position.y = 50 * Math.cos(pitch);
          camera.position.z = 50 * Math.sin(pitch);
          camera.lookAt(0, 0, 0);
          
          // Simple bearing rotation
          rotationGroup.rotation.y = THREE.MathUtils.degToRad(viewState.bearing);
          
          renderer.render(scene, camera);
        }
      }
    };

    // Add move listener
    console.log(map.current, "map");
    map.current.on("move", handleMove);

    return () => {
      if (map.current) {
        map.current.off("move", handleMove);
      }
      scene.remove(rotationGroup);
      renderer.dispose();
      [
        poleGeometry,
        poleMaterial,
        bodyGeometry,
        bodyMaterial,
        lensGeometry,
        lensMaterial,
        bracketGeometry,
        bracketMaterial,
        detailGeometry,
        detailMaterial,
        glassGeometry,
        glassMaterial,
        ledGeometry,
        ledMaterial,
        finGeometry,
        finMaterial,
      ].forEach((item) => item.dispose());
    };
  }, [map]);

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      rotationAlignment="map"
      pitchAlignment="map"
    >
      <div
        ref={containerRef}
        style={{
          width: "400px",
          height: "400px",
          transform: "translate(-50%, -0%)",
        }}
      />
    </Marker>
  );
};

export default ThreeJsMarker;
