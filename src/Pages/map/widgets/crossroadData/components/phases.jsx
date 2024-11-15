const statusStyles = {
  0: "dark:bg-green-500/20 bg-green-600/20 dark:text-green-300 text-green-400 ring-green-300",
  1: "dark:bg-yellow-500/20 bg-orange-600/20 dark:text-yellow-300 text-orange-600 dark:ring-yellow-300 ring-orange-600",
  2: "dark:bg-red-500/20 bg-red-600/20 dark:text-red-300 text-red-400 ring-red-300",
  3: "dark:bg-gray-500/20 bg-gray-600/20 dark:text-gray-300 text-gray-400 ring-gray-300",
};
const PhasesDisplay = ({ phases }) => {
  return (
    <div className="phases-container absolute top-0 font-bold left-0 w-full z-[99999999999999] flex">
      {phases?.map((phase) => (
        <div
          key={phase.id}
          className={`phase flex-1 z-[99999999999999] bg-blue-gray-100 text-gray-900 text-center dark:bg-blue-gray-700 dark:text-white`}
        >
          <div className="phase-info z-[999] text-white">
            <span>{phase.desc}</span>
            <span>
              {phase.now}s / {phase.total}s
            </span>
          </div>
          <div
            className={`phase-bar ${statusStyles[phase.status - 1]}`}
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
