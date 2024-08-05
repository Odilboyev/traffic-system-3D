import SingleRecord from "../../singleRecord";

const Videos = ({ videos }) => {
  return (
    <div className="grid grid-cols-3  overflow-y-scroll px-3 max-h-full no-scrollbar">
      {videos?.length > 0 ? (
        videos?.map((v, i) => (
          <iframe
            key={i}
            width={"100%"}
            height={"100%"}
            style={{ minHeight: "18vh" }}
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
