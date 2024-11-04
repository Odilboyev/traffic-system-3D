import SingleRecord from "../../singleRecord";

const Videos = ({ videos }) => {
  return (
    <div className="grid grid-cols-3 h-full gap-4 px-3  no-scrollbar">
      {videos?.length > 0 ? (
        videos?.map((v, i) => (
          <iframe
            key={i}
            height={"100%"}
            style={{ minHeight: "18vh", minWidth: "90%" }}
            src={v.mselink}
            allowFullScreen
          ></iframe>
        ))
      ) : (
        <div>No Data</div>
      )}
    </div>
  );
};

export default Videos;
