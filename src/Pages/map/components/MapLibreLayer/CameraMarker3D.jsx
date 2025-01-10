import * as THREE from 'three';
import { useEffect, useRef } from 'react';

const CameraMarker3D = ({ rotation = 0 }) => {
  const containerRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(40, 40);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Create camera model
    const cameraGeometry = new THREE.ConeGeometry(0.8, 2, 8);
    const cameraMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const cameraMesh = new THREE.Mesh(cameraGeometry, cameraMaterial);
    
    // Add field of view visualization
    const fovGeometry = new THREE.ConeGeometry(2, 4, 8);
    const fovMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const fovMesh = new THREE.Mesh(fovGeometry, fovMaterial);
    fovMesh.position.z = -2;
    
    // Create a group to hold both meshes
    const group = new THREE.Group();
    group.add(cameraMesh);
    group.add(fovMesh);
    
    // Apply rotation
    group.rotation.z = THREE.MathUtils.degToRad(rotation);
    group.rotation.x = Math.PI / 2;
    
    scene.add(group);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [rotation]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '40px', 
        height: '40px',
        position: 'relative'
      }} 
    />
  );
};

export default CameraMarker3D;
