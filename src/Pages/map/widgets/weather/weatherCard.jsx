import { useEffect, useState } from "react";

import { Typography } from "@material-tailwind/react";
import { getWeatherData } from "../../../../api/api.handlers";

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
    <div className="w-full text-white bg-blue-gray-900/10 backdrop-blur-xl py-2">
      {isSidebarOpen ? (
        <div className=" flex justify-evenly h-full">
          {/* Current Weather */}
          <div className="px-4 py-2 h-full flex flex-col justify-between  rounded">
            <div className="flex items-center gap-3 mb-1">
              <img
                src={`${iconPath}/${today.weather_icon}`}
                alt={today.weather_icon}
                className="w-8 h-8"
              />
              <Typography className="text-2xl font-medium">
                {today.temp}°C
              </Typography>
            </div>
            <div className="space-y-0.5 text-sm  text-gray-300">
              <div>
                {t("humidity")}: <b>{today.humidity}%</b>
              </div>
              <div>
                {t("wind")}:{" "}
                <b>
                  {today.wind} {t("m/s")}
                </b>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="flex flex-col gap-2 ">
            {/* Day Forecast */}
            <div className=" border border-blue-gray-200/20 rounded py-2 px-3">
              <div className="flex items-center gap-2">
                <img
                  src={`${iconPath}/${nextDays[0].wheather_icon_day}`}
                  alt="day"
                  className="w-6 h-6"
                />
                <div>
                  <div className="text-sm font-medium">
                    {nextDays[0].temp_max}°C
                  </div>
                  <div className="text-xs text-gray-400">
                    {nextDays[0].humidity_max}
                  </div>
                </div>
              </div>
            </div>

            {/* Night Forecast */}
            <div className=" border border-blue-gray-200/20 rounded py-2 px-3">
              <div className="flex items-center gap-2">
                <img
                  src={`${iconPath}/${nextDays[0].wheather_icon_night}`}
                  alt="night"
                  className="w-6 h-6"
                />
                <div>
                  <div className="text-sm font-medium">
                    {nextDays[0].temp_min}°C
                  </div>
                  <div className="text-xs text-gray-400">
                    {nextDays[0].humidity_min}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Collapsed view - just temperature

        <Typography className="text-sm font-bold text-center">
          {today.temp}°C
        </Typography>
      )}
    </div>
  );
};

export default WeatherCard;
