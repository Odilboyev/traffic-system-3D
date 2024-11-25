import { useEffect, useState } from "react";

const DateTime = ({ t, isSidebarOpen, currentLocation }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  const location = "Tashkent";
  return (
    <div className="w-full bg-blue-gray-900/10  px-4 py-3 backdrop-blur-xl flex items-center justify-between">
      {isSidebarOpen ? (
        <>
          <div className="text-base  font-bold">
            <div className="text-xs ">{t("region")}</div>
            <div className="text-lg font-bold">{location}</div>
          </div>
          <div>
            <div className="text-xs text-right">
              {time.toLocaleDateString(undefined, options)}
            </div>
            <div className="text-lg text-right font-bold">
              {timeToString(time)}
            </div>
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
