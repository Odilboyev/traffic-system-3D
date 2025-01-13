import * as THREE from "three";
import { Marker, useMap } from "@vis.gl/react-maplibre";
import { useEffect, useRef } from "react";

const ProjectMarker = ({ longitude, latitude }) => {
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

    // Create base
    const baseGeometry = new THREE.BoxGeometry(4, 4, 4);
    const baseMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      emissive: 0x660000,
      emissiveIntensity: 0.2,
      shininess: 100,
      specular: 0xff0000,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 2;
    base.castShadow = true;

    // Create octahedron (project marker)
    const markerGeometry = new THREE.OctahedronGeometry(3);
    const markerMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
      shininess: 100,
      specular: 0xff0000,
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.y = 8;
    marker.castShadow = true;

    // Create rings
    const ringGroup = new THREE.Group();
    const ringGeometry = new THREE.TorusGeometry(4, 0.2, 16, 32);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      emissive: 0x660000,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.7,
      shininess: 100,
    });

    // Create three rings at different angles
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = (Math.PI / 3) * i;
      ring.rotation.y = (Math.PI / 4) * i;
      ringGroup.add(ring);
    }
    ringGroup.position.y = 8;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create a container for rotation
    const rotationGroup = new THREE.Group();
    rotationGroup.add(base, marker, ringGroup);
    scene.add(rotationGroup);

    // Initial render
    renderer.render(scene, camera);

    // Animation loop
    const animate = () => {
      if (ringGroup) {
        ringGroup.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };
    animate();

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
    map.current.on("move", handleMove);

    return () => {
      if (map.current) {
        map.current.off("move", handleMove);
      }
      scene.remove(rotationGroup);
      renderer.dispose();
      [
        baseGeometry,
        baseMaterial,
        markerGeometry,
        markerMaterial,
        ringGeometry,
        ringMaterial,
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

export default ProjectMarker;
