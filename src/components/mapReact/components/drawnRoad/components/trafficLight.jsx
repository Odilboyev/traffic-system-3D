const TrafficLight = ({ position, rotate, ...rest }) => {
  return (
    <div
      className="traffic-light"
      style={{
        position: "absolute",
        width: "30px",
        height: "80px",
        backgroundColor: "#222",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        padding: "5px",
        ...position,
        ...rotate,
      }}
      {...rest}
    >
      {/* Red light */}
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "red",
          borderRadius: "50%",
        }}
      ></div>
      {/* Yellow light */}
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "yellow",
          borderRadius: "50%",
        }}
      ></div>
      {/* Green light */}
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "green",
          borderRadius: "50%",
        }}
      ></div>
    </div>
  );
};
export default TrafficLight;
