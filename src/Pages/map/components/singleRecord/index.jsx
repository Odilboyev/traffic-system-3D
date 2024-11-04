import { memo } from "react";

const SingleRecord = memo(function SingleRecord({ mselink, cname, isZoomed }) {
  return (
    <div
      className="rounded-xl relative overflow-hidden"
      style={{
        width: isZoomed ? "24vw" : "18vw",
        height: isZoomed ? "18vw" : "12vw",
        transition: "all 0.3s ease-in-out",
        margin: "0 auto",
        transform: "translateX(-50%)",
        left: "50%",
        position: "relative",
      }}
    >
      <div className="bg-black/50 text-white p-2 absolute top-0 left-0 right-0 z-10">
        <p className="!my-0">{cname}</p>
      </div>
      <iframe
        className="w-full h-full"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          margin: 0,
          padding: 0,
          display: "block",
        }}
        src={mselink}
        allowFullScreen
      ></iframe>
    </div>
  );
});

export default SingleRecord;
