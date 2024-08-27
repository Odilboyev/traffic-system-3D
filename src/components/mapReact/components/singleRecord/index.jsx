import { memo } from "react";

const SingleRecord = ({ mselink, cname }) => {
  return (
    <div
      style={{
        minWidth: "12vw",
        minHeight: "8vw",
        overflow: "hidden",
      }}
    >
      <p className="!my-2 ">{cname}</p>
      <iframe
        className="space-x-0 space-y-0"
        width="100%"
        height="100%"
        style={{ margin: "0 auto", border: "none", padding: 0 }}
        src={mselink}
        // onLoad={
        //   'javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));'
        // }
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default memo(SingleRecord);
