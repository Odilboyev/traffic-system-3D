import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useEffect, useRef, useMemo, useCallback } from 'react';
import { Layer } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';

const createCustomLayer = ({
    id,
    modelUrl,
    modelOrigin,
    modelAltitude = 0,
    modelRotate = [Math.PI / 2, 0, 0],
    onClick,
    onLoaded
}) => {
    // Calculate mercator coordinates
    const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
    );

    // Define model transform
    const modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

    return {
        id,
        type: 'custom',
        renderingMode: '3d',
        onAdd(map, gl) {
            this.camera = new THREE.Camera();
            this.scene = new THREE.Scene();

            // Create two three.js lights to illuminate the model
            const directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(0, -70, 100).normalize();
            this.scene.add(directionalLight);

            const directionalLight2 = new THREE.DirectionalLight(0xffffff);
            directionalLight2.position.set(0, 70, 100).normalize();
            this.scene.add(directionalLight2);

            // Load the 3D model
            const loader = new GLTFLoader();
            loader.load(
                modelUrl,
                (gltf) => {
                    this.scene.add(gltf.scene);
                    if (onLoaded) onLoaded();
                },
                (progress) => {
                    console.log('Loading model:', (progress.loaded / progress.total * 100) + '%');
                },
                (error) => console.error('Error loading model:', error)
            );

            this.map = map;

            // Set up the WebGL renderer
            this.renderer = new THREE.WebGLRenderer({
                canvas: map.getCanvas(),
                context: gl,
                antialias: true
            });

            this.renderer.autoClear = false;

            // Set up click handling if needed
            if (onClick) {
                this.setupClickHandler(map);
            }
        },

        setupClickHandler(map) {
            this.raycaster = new THREE.Raycaster();
            const canvas = map.getCanvas();
            
            canvas.addEventListener('click', (e) => {
                const rect = canvas.getBoundingClientRect();
                const mouse = new THREE.Vector2(
                    ((e.clientX - rect.left) / rect.width) * 2 - 1,
                    -((e.clientY - rect.top) / rect.height) * 2 + 1
                );

                this.raycaster.setFromCamera(mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children, true);

                if (intersects.length > 0) {
                    onClick(intersects[0]);
                }
            });
        },

        render(gl, args) {
            // Handle both vanilla MapLibre GL and @vis.gl/react-maplibre matrix formats
            const projectionMatrix = args.defaultProjectionData?.mainMatrix || args.projectionMatrix;
            
            if (!projectionMatrix) {
                console.error('No projection matrix available');
                return;
            }

            const m = new THREE.Matrix4().fromArray(projectionMatrix);
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

            // Apply rotations
            l.multiply(new THREE.Matrix4().makeRotationX(modelTransform.rotateX));
            l.multiply(new THREE.Matrix4().makeRotationY(modelTransform.rotateY));
            l.multiply(new THREE.Matrix4().makeRotationZ(modelTransform.rotateZ));

            this.camera.projectionMatrix = m.multiply(l);
            this.renderer.resetState();
            this.renderer.render(this.scene, this.camera);
            this.map.triggerRepaint();
        }
    };
};

const ThreeJsMarkerRenderer = ({ 
    modelUrl, 
    coordinates,
    altitude = 0,
    rotation = { x: Math.PI / 2, y: 0, z: 0 },
    onClick,
    onLoaded
}) => {
    const layerId = useMemo(() => 
        `3d-model-${coordinates.join('-')}-${Math.random().toString(36).substr(2, 9)}`,
        [coordinates]
    );

    const handleClick = useCallback((intersection) => {
        if (onClick) onClick(intersection);
    }, [onClick]);

    const layer = useMemo(() => createCustomLayer({
        id: layerId,
        modelUrl,
        modelOrigin: [coordinates[1], coordinates[0]], // Swap lat/lng to lng/lat
        modelAltitude: altitude,
        modelRotate: [rotation.x, rotation.y, rotation.z],
        onClick: handleClick,
        onLoaded
    }), [layerId, modelUrl, coordinates, altitude, rotation, handleClick, onLoaded]);

    return <Layer {...layer} />;
};

export default ThreeJsMarkerRenderer;
