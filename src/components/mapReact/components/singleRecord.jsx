const SingleRecord = ({ mselink, cname }) => {
  return (
    <div
      style={{
        width: "40vw",
        height: "50vh",
        overflow: "hidden",
        padding: 0,
      }}
    >
      {" "}
      <p style={{ margin: "5px auto" }}>{cname}</p>
      <iframe
        width="100%"
        height="100%"
        style={{ margin: "0 auto", border: "none" }}
        src={mselink}
        // onLoad={
        //   'javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));'
        // }
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default SingleRecord;
