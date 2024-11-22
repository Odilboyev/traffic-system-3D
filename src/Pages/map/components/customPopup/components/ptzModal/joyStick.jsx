import {
  FaChevronCircleDown,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaChevronCircleUp,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import { useEffect } from "react";

const Joystick = ({ onDirectionControl, onZoomControl }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Handle directional keys (arrow keys)

      // zoom
      if (event.key === "+") {
        onZoomControl("zoom-in", false);
      }
      if (event.key === "-") {
        onZoomControl("zoom-out", false);
      }
      // drag
      if (event.key === "ArrowUp") {
        onDirectionControl("up", true);
      }
      if (event.key === "ArrowDown") {
        onDirectionControl("down", true);
      }
      if (event.key === "ArrowLeft") {
        onDirectionControl("left", true);
      }
      if (event.key === "ArrowRight") {
        onDirectionControl("right", true);
      }
    };

    const handleKeyUp = (event) => {
      // Stop direction control when key is released

      // zoom
      if (event.key === "+") {
        onZoomControl("zoom-in", false);
      }
      if (event.key === "-") {
        onZoomControl("zoom-out", false);
      }
      // drag
      if (event.key === "ArrowUp") {
        onDirectionControl("up", false);
      }
      if (event.key === "ArrowDown") {
        onDirectionControl("down", false);
      }
      if (event.key === "ArrowLeft") {
        onDirectionControl("left", false);
      }
      if (event.key === "ArrowRight") {
        onDirectionControl("right", false);
      }
    };

    // Add event listeners for keydown and keyup
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onDirectionControl, onZoomControl]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Joystick Controls */}
      <div className="relative w-[8vw] h-[8vw] bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
        {/* Main Direction Buttons */}
        <button
          className="absolute top-2 text-lg left-1/2 transform -translate-x-1/2 bg-gray-300 rounded-full p-2 hover:bg-gray-400"
          onMouseDown={() => onDirectionControl("up", true)}
          onMouseUp={() => onDirectionControl("up", false)}
        >
          <FaChevronCircleUp />
        </button>
        <button
          className="absolute bottom-2 text-lg left-1/2 transform -translate-x-1/2 bg-gray-300 rounded-full p-2 hover:bg-gray-400"
          onMouseDown={() => onDirectionControl("down", true)}
          onMouseUp={() => onDirectionControl("down", false)}
        >
          <FaChevronCircleDown />
        </button>
        <button
          className="absolute left-2 text-lg top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full p-2 hover:bg-gray-400"
          onMouseDown={() => onDirectionControl("left", true)}
          onMouseUp={() => onDirectionControl("left", false)}
        >
          <FaChevronCircleLeft />
        </button>
        <button
          className="absolute right-2 text-lg top-1/2 transform -translate-y-1/2 bg-gray-300 rounded-full p-2 hover:bg-gray-400"
          onMouseDown={() => onDirectionControl("right", true)}
          onMouseUp={() => onDirectionControl("right", false)}
        >
          <FaChevronCircleRight />
        </button>

        {/* Middle Diagonal Buttons */}
        <button
          className="absolute top-[18%] left-[18%] text-sm -rotate-45 rounded-full p-1 hover:bg-gray-400"
          onMouseDown={() => onDirectionControl("up-left", true)}
          onMouseUp={() => onDirectionControl("up-left", false)}
        >
          <FaChevronUp />
        </button>
        <button
          className="absolute top-[18%] right-[18%] text-sm rotate-45 rounded-full p-1 hover:bg-gray-400"
          onMouseDown={() => onDirectionControl("up-right", true)}
          onMouseUp={() => onDirectionControl("up-right", false)}
        >
          <FaChevronUp />
        </button>
        <button
          className="absolute bottom-[18%] left-[18%] text-sm rotate-45 rounded-full p-1 hover:bg-gray-400"
          onMouseDown={() => onDirectionControl("down-left", true)}
          onMouseUp={() => onDirectionControl("down-left", false)}
        >
          <FaChevronDown />
        </button>
        <button
          className="absolute bottom-[18%] right-[18%] text-sm -rotate-45 rounded-full p-1 hover:bg-gray-400"
          onMouseDown={() => onDirectionControl("down-right", true)}
          onMouseUp={() => onDirectionControl("down-right", false)}
        >
          <FaChevronDown />
        </button>

        {/* Center Button */}
        <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-4">
        <button
          className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full hover:bg-gray-400"
          onMouseDown={() => onZoomControl("zoom-out", true)}
          onMouseUp={() => onZoomControl("zoom-out", false)}
        >
          -
        </button>
        <button
          className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full hover:bg-gray-400"
          onMouseDown={() => onZoomControl("zoom-in", true)}
          onMouseUp={() => onZoomControl("zoom-in", false)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Joystick;
