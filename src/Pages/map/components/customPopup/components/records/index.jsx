import "./records.style.css";

import { ReduxProvider } from "../../../../../../redux/ReduxProvider";
import { memo } from "react";
import { useMapMarkers } from "../../../../hooks/useMapMarkers";

const RecordsContent = ({ videos, name, isLoading }) => {
  const { isHighQuality } = useMapMarkers();
  console.log(videos, "the videos");
  return (
    <div
      className="bg-black text-white"
      style={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div className="flex flex-col w-full">
        {videos?.map((video, index) => {
          const updatedLink = video.mselink.replace(
            /.$/,
            isHighQuality ? "1" : "0"
          );
          return (
            <div
              key={index}
              style={{
                width: "100%",
                height: "15vh",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <iframe
                src={updatedLink}
                allowFullScreen
                style={{
                  border: "none",
                  width: "100%",
                  height: "100%",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
              ></iframe>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Wrap the component with ReduxProvider to ensure it has access to the Redux store
const Records = (props) => (
  <ReduxProvider>
    <RecordsContent {...props} />
  </ReduxProvider>
);

export default memo(Records);
