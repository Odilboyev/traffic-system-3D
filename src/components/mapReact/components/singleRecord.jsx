const SingleRecord = ({ mselink, cname }) => {
  return (
    <div style={{ width: "600px", height: "350px", padding: 0 }}>
      <p>{cname}</p>
      <iframe width="100%" height="100%" src={mselink} allowfullscreen></iframe>
    </div>
  );
};

export default SingleRecord;
