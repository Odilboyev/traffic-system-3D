import { useEffect, useState } from "react";

const DateTime = ({ t, isSidebarOpen }) => {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("Tashkent");

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="w-full bg-blue-gray-900/10 py-2 backdrop-blur-xl text-center flex items-center justify-evenly">
      {isSidebarOpen ? (
        <>
          <div className="text-base font-bold text-gray-300">
            <div className="text-xs text-gray-400">{t("region")}</div>
            <div className="text-lg font-bold">{location}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">
              {time.toLocaleDateString(undefined, options)}
            </div>
            <div className="text-lg font-bold">{timeToString(time)}</div>
          </div>
        </>
      ) : (
        <div className="text-sm font-bold">{timeToStringShort(time)}</div>
      )}
    </div>
  );
};

export default DateTime;

const timeToString = (time) => {
  return time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};
const timeToStringShort = (time) => {
  return time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",

    hour12: false,
  });
};
const options = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
};
