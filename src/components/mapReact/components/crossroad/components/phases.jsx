import React, { useEffect, useState } from "react";
import getRowColor from "../../../../../configurations/getRowColor";

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
          className={`phase z-[99999999999999] bg-blue-gray-100 text-gray-900 text-center dark:bg-blue-gray-700 dark:text-white`}
        >
          <div className="phase-info z-[999] text-white">
            <span>{phase.desc}</span>
            <span>
              {phase.now}s / {phase.total}s
            </span>
          </div>
          <div
            className={`phase-bar ${getRowColor(phase.status - 1)}`}
            style={{
              width: `${(phase.now / phase.total) * 100}%`,
              height: "100%",
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default PhasesDisplay;
