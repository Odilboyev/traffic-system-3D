import { FaDroplet, FaWind } from "react-icons/fa6";
import { useEffect, useState } from "react";

import { Typography } from "@material-tailwind/react";
import { getWeatherData } from "../../../../../../api/api.handlers";

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const WeatherCard = ({ t, isSidebarOpen }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await getWeatherData();
      setWeatherData(response);
    } catch (error) {
      console.error("Error fetching the weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 600000);
    return () => clearInterval(intervalId);
  }, []);

  if (!weatherData) {
    return <div></div>;
  }

  const today = weatherData.today;
  const nextDays = Object.values(weatherData.nextdays);
  const iconPath = "icons/wheather_icons";

  return (
    <div className="w-full no-scrollbar p-4 bg-gradient-to-br from-cyan-950/90 to-black/90 backdrop-blur-lg font-mono border border-cyan-500/20 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.15)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,211,238,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.1),transparent_50%)]" />
      {isSidebarOpen ? (
        <div className="flex flex-col gap-6 relative">
          {/* Digital Clock Section */}
          <div className="flex flex-col items-center w-full p-3 bg-cyan-950/50 rounded-lg border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
            <div className="text-4xl font-bold tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] bg-gradient-to-b from-cyan-300 to-cyan-500 text-transparent bg-clip-text">
              {formatTime(currentTime)}
            </div>
            <div className="text-lg tracking-[0.15em] text-cyan-400/60 mt-1">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Weather Info Section */}
          <div className="flex items-center justify-between w-full p-3 bg-cyan-950/50 rounded-lg border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 backdrop-blur-md border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <img
                  src={`${iconPath}/${today.weather_icon}`}
                  alt={today.weather_icon}
                  className="w-10 h-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                />
              </div>
              <div>
                <div className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                  {today.temp}°C
                </div>
                <div className="text-lg font-medium text-cyan-400/80 tracking-wide">
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className="flex items-center gap-2 bg-cyan-950/50 px-3 py-1.5 rounded-full border border-cyan-500/20">
                <FaWind className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-300 tracking-wider font-medium">
                  {today.wind}
                </span>
                <span className="text-cyan-400/70 tracking-wide">
                  {t("m/s")}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-cyan-950/50 px-3 py-1.5 rounded-full border border-cyan-500/20">
                <FaDroplet className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-300 tracking-wider font-medium">
                  {today.humidity}
                </span>
                <span className="text-cyan-400/70 tracking-wide">%</span>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Day Forecast */}
            <div className="p-3 rounded-lg bg-cyan-950/50 border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
              <div className="text-sm text-cyan-400/60 tracking-wider mb-2">
                Day
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/20">
                    <img
                      src={`${iconPath}/${nextDays[0].wheather_icon_day}`}
                      alt="day"
                      className="w-8 h-8 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]"
                    />
                  </div>
                  <div className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">
                    {nextDays[0].temp_max}°C
                  </div>
                </div>
                <div className="text-xs text-cyan-400/60 tracking-wider">
                  Max
                </div>
              </div>
            </div>

            {/* Night Forecast */}
            <div className="p-3 rounded-lg bg-cyan-950/50 border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
              <div className="text-sm text-cyan-400/60 tracking-wider mb-2">
                Night
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/20">
                    <img
                      src={`${iconPath}/${nextDays[0].wheather_icon_night}`}
                      alt="night"
                      className="w-8 h-8 drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]"
                    />
                  </div>
                  <div className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">
                    {nextDays[0].temp_min}°C
                  </div>
                </div>
                <div className="text-xs text-cyan-400/60 tracking-wider">
                  Min
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Collapsed view - just temperature

        <Typography className="text-xl font-bold text-center">
          {today.temp}°C
        </Typography>
      )}
    </div>
  );
};

export default WeatherCard;
