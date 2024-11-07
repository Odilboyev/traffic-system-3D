import { useEffect, useState } from "react";
import WeatherCard from "./weatherCard";

const WeatherWidget = ({ t }) => {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("Tashkent");

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="weather w-[280px] bg-gray-900/80 backdrop-blur-md text-white rounded-lg shadow-lg p-3">
      <div className="text-center mb-1 flex items-center justify-evenly">
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
      </div>
      <WeatherCard />
    </div>
  );
};

export default WeatherWidget;
const timeToString = (time) => {
  return time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};
const options = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
};
