import { memo } from "react";
import { useSelector } from "react-redux";

const Records = ({ videos, name }) => {
  const isHighQuality = useSelector((state) => state.map.isHighQuality);
  return (
    <div
      className=" bg-gray-900/60 backdrop-blur-md text-white"
      style={{
        minWidth: "14vw",
        minHeight: "8vw",
        overflow: "hidden",
      }}
    >
      <p className="!my-1 pl-2">{name}</p>
      <div className="flex flex-col w-full">
        {videos?.map((video, index) => {
          // Modify the mselink based on isHighQuality
          const updatedLink = video.mselink.replace(
            /.$/,
            isHighQuality ? "1" : "0"
          );
          return (
            <iframe
              key={index}
              className="space-x-0 space-y-0"
              width="100%"
              height="100%"
              style={{ margin: "0 auto", border: "none", padding: 0 }}
              src={updatedLink}
              allowFullScreen
            ></iframe>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Records);
