import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { useTheme } from '../../../../customHooks/useTheme';

class MapOrientationControl {
  constructor(options = {}) {
    this._map = null;
    this._container = null;
    this._rotationEnabled = options.rotationEnabled || false;
    this.onRotate = options.onRotate || (() => {});
    this.on3DToggle = options.on3DToggle || (() => {});
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group orientation-control';
    
    // Add rotation control
    const rotationRing = document.createElement('div');
    rotationRing.className = 'rotation-ring';
    this._container.appendChild(rotationRing);

    // Add 3D toggle
    const toggle3D = document.createElement('button');
    toggle3D.className = 'toggle-3d';
    toggle3D.innerHTML = '3D';
    toggle3D.onclick = () => this.on3DToggle();
    this._container.appendChild(toggle3D);

    // Add rotation handlers
    if (this._rotationEnabled) {
      let isDragging = false;
      let startAngle = 0;

      const handleDragStart = (e) => {
        isDragging = true;
        const rect = rotationRing.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(
          e.clientY - centerY,
          e.clientX - centerX
        );
      };

      const handleDrag = (e) => {
        if (!isDragging) return;
        
        const rect = rotationRing.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const currentAngle = Math.atan2(
          e.clientY - centerY,
          e.clientX - centerX
        );
        
        const angleDiff = currentAngle - startAngle;
        const bearing = (angleDiff * 180) / Math.PI;
        
        this.onRotate(bearing);
      };

      const handleDragEnd = () => {
        isDragging = false;
      };

      rotationRing.addEventListener('mousedown', handleDragStart);
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

const MapControls = ({ map }) => {
  const { show3DLayer, setShow3DLayer } = useTheme();

  useEffect(() => {
    if (!map) return;

    // Add navigation control
    const nav = new maplibregl.NavigationControl();
    map.addControl(nav, 'top-right');

    // Add orientation control
    const orientationControl = new MapOrientationControl({
      rotationEnabled: true,
      onRotate: (bearing) => {
        map.easeTo({ bearing, duration: 0 });
      },
      on3DToggle: () => {
        setShow3DLayer(!show3DLayer);
      }
    });
    map.addControl(orientationControl, 'top-right');

    return () => {
      map.removeControl(nav);
      map.removeControl(orientationControl);
    };
  }, [map, show3DLayer, setShow3DLayer]);

  return null;
};

export default MapControls;
