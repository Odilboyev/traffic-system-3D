import "./records.style.css";

import { memo } from "react";
import { useSelector } from "react-redux";

const Records = memo(
  function Records({ videos, name }) {
    const { isHighQuality } = useSelector((state) => state.map.isHighQuality);

    return (
      <div
        className="bg-gray-900/60 backdrop-blur-md text-white  rounded-t-lg"
        style={{
          minWidth: "14vw",
          minHeight: "8vw",
          overflow: "hidden",
        }}
      >
        <p className="!my-1 pl-2 py-2">{name}</p>
        <div className="flex flex-col w-full">
          {videos?.map((video, index) => {
            const updatedLink = video.mselink.replace(
              /.$/,
              isHighQuality ? "1" : "0"
            );
            return (
              <div key={index} className="aspect-w-16 aspect-h-9 w-full h-auto">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={updatedLink}
                  allowFullScreen
                  style={{ border: "none" }}
                ></iframe>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if videos or name changes
    return (
      prevProps.videos === nextProps.videos && prevProps.name === nextProps.name
    );
  }
);

export default Records;
