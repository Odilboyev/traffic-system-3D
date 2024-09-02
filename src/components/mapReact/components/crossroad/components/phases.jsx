import React, { useEffect, useState } from "react";

const PhasesDisplay = ({ phases }) => {
  console.log("phases display", phases);
  //   const [phases, setPhases] = useState([]);

  //   useEffect(() => {
  //     // Connect to the WebSocket and listen for phase updates
  //     socket.on("phaseUpdate", (data) => {
  //       setPhases(data.phase); // Update phases with the new data
  //     });

  //     // Cleanup when the component is unmounted
  //     return () => {
  //       socket.off("phaseUpdate");
  //     };
  //   }, []);

  return (
    <div className="phases-container absolute top-0 left-0 w-full z-[99999999999999]">
      {phases?.map((phase) => (
        <div
          key={phase.id}
          className={`phase z-[99999999999999] ${
            phase.status === 1 ? "active" : ""
          }`}
        >
          <div className="phase-info">
            <span>{phase.desc}</span>
            <span>
              {phase.now}s / {phase.total}s
            </span>
          </div>
          <div
            className="phase-bar"
            style={{ width: `${(phase.now / phase.total) * 100}%` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default PhasesDisplay;
