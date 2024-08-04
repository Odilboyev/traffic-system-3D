import { useState, useEffect, useRef, memo } from "react";
import { IconButton } from "@material-tailwind/react";
import Control from "react-leaflet-custom-control";

const DropdownControl = ({ position, icon, children }) => {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const controlRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (controlRef.current && !controlRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const calculateDropdownPosition = () => {
    if (dropdownRef.current && controlRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const controlRect = controlRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let top = controlRect.height; // default space below the control
      let left = 0;

      if (controlRect.bottom + dropdownRect.height > viewportHeight) {
        top = -dropdownRect.height; // position above the control
      }

      if (controlRect.right + dropdownRect.width > viewportWidth) {
        left = -dropdownRect.width + controlRect.width; // adjust to the left
      }

      setDropdownStyle({
        top: `${top}px`,
        left: `${left}px`,
      });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (open) {
      calculateDropdownPosition();
    }
  }, [open]);

  return (
    <Control position={position} style={{ position: "absolute", zIndex: 1000 }}>
      <div className="relative" ref={controlRef}>
        <IconButton size="lg" onClick={() => setOpen((prev) => !prev)}>
          {icon}
        </IconButton>
        {open && (
          <div
            ref={dropdownRef}
            style={{ ...dropdownStyle, position: "fixed" }}
            className="absolute z-10 p-2 flex flex-col me-2 dark:bg-gray-900/80 dark:text-white bg-white/80 backdrop-blur-md"
          >
            {children}
          </div>
        )}
      </div>
    </Control>
  );
};

export default memo(DropdownControl);
