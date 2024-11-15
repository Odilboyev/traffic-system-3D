const Videos = ({ t, videos }) => {
  return (
    <>
      {videos?.length > 0 ? (
        <div className="grid grid-cols-3 h-full gap-4 px-3  no-scrollbar">
          {videos?.map((v, i) => (
            <iframe
              key={i}
              height={"100%"}
              style={{ minHeight: "18vh", minWidth: "90%" }}
              src={v.mselink}
              allowFullScreen
            />
          ))}{" "}
        </div>
      ) : (
        <div className="text-center">{t("no_data_found")}</div>
      )}
    </>
  );
};

export default Videos;
