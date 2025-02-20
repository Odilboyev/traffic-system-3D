import { useEffect, useState } from "react";

import { Typography } from "@material-tailwind/react";
import { getWeatherData } from "../../../../../../api/api.handlers";

const WeatherCard = ({ t, isSidebarOpen }) => {
  const [weatherData, setWeatherData] = useState(null);

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
    <div className="w-full no-scrollbar p-3 bg-gradient-to-br from-blue-400/40 to-black/20 backdrop-blur-sm">
      {isSidebarOpen ? (
        <div className="flex items-start justify-between h-full">
          {/* Current Weather */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/30 backdrop-blur-md border border-white/10">
                <img
                  src={`${iconPath}/${today.weather_icon}`}
                  alt={today.weather_icon}
                  className="w-8 h-8 drop-shadow-lg"
                />
              </div>
              <div>
                <Typography className="text-2xl font-medium tracking-tight text-white/90">
                  {today.temp}°C
                </Typography>
                <Typography className="text-xl font-medium text-blue-gray-400">
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                </Typography>
              </div>
            </div>

            <div className="flex  flex-col gap-3 text-xl text-blue-gray-300">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14.5v-5M16 12h6"
                  />
                </svg>
                <span className="text-blue-gray-400">{today.wind}</span>
                <span className="text-xl text-blue-gray-500">{t("m/s")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-blue-gray-400">{today.humidity}</span>
                <span className="text-xl text-blue-gray-500">%</span>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="flex flex-col gap-2">
            {/* Day Forecast */}
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <img
                  src={`${iconPath}/${nextDays[0].wheather_icon_day}`}
                  alt="day"
                  className="w-6 h-6"
                />
                <div>
                  <div className="text-xl font-medium text-white/90">
                    {nextDays[0].temp_max}°C
                  </div>
                  <div className="text-sm text-blue-gray-400">Day</div>
                </div>
              </div>
            </div>

            {/* Night Forecast */}
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <img
                  src={`${iconPath}/${nextDays[0].wheather_icon_night}`}
                  alt="night"
                  className="w-6 h-6"
                />
                <div>
                  <div className="text-xl font-medium text-white/90">
                    {nextDays[0].temp_min}°C
                  </div>
                  <div className="text-sm text-blue-gray-400">Night</div>
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
