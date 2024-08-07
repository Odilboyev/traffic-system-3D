import { useState, useEffect } from "react";
import WeatherCard from "./weatherCard";

const ClockOnMap = () => {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("Tashkent");

  useEffect(() => {
    // Update time every second
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="w-[15vw] min-h-[15vw] top-1 right-1 z-[9999] absolute flex-col items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md text-white rounded-lg shadow-lg">
      <div id="time" className="text-center">
        <div className="mt-4 text-xl font-bold text-gray-300">{location}</div>
        <div className="text-xl text-gray-400 my-2">
          {time.toLocaleDateString(undefined, options)}
        </div>{" "}
        <div className="text-3xl font-bold">{timeToString(time)}</div>
      </div>
      <div id="weather" className="mt-4">
        <WeatherCard />
      </div>
    </div>
  );
};

export default ClockOnMap;
const timeToString = (time) => {
  return time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
