import { FaCompress, FaExpand } from "react-icons/fa";
import React, { useEffect, useState, useCallback } from "react";

const FullscreenControl = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(document.fullscreenElement !== null);
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, [isFullscreen]);

  return (
    <button
      onClick={toggleFullscreen}
      className="p-2 text-white/80 hover:text-blue-400 hover:bg-white/10 rounded-xl transition-all duration-300"
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <FaCompress className="text-lg" />
      ) : (
        <FaExpand className="text-lg" />
      )}
    </button>
  );
};

export default FullscreenControl;
