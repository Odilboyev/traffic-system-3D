import { useEffect, useState } from "react";

import { Typography } from "@material-tailwind/react";
import { getWeatherData } from "../../../../api/api.handlers";

const WeatherCard = ({ isSidebarOpen }) => {
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await getWeatherData();
      setWeatherData(response);
    } catch (error) {
      console.error("Error fetching the weather data:", error);
    }
  };

  // Fetch data every 10 minutes (600,000 milliseconds)
  useEffect(() => {
    fetchWeatherData();
    const intervalId = setInterval(fetchWeatherData, 600000); // 10 minutes

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  if (!weatherData) {
    return <div></div>;
  }

  const today = weatherData.today;
  const nextDays = Object.values(weatherData.nextdays);
  const iconPath = "icons/wheather_icons";

  return (
    <div className="w-full py-2 text-center text-white shadow-xl rounded-none bg-blue-gray-900/10 backdrop-blur-xl">
      {isSidebarOpen ? (
        <div className="p-3 py-0 relative">
          <div className="flex justify-evenly items-center gap-5 py-3 w-full">
            {/* Today's Weather */}
            <div className="w-1/5">
              <img
                src={`${iconPath}/${today.weather_icon}`}
                alt={today.weather_icon}
                className="w-full"
              />
            </div>
            <div className="flex flex-col w-3/5 my-2">
              <Typography className="text-white text-xl font-bold mx-0">
                {today.temp}°C
              </Typography>
              <Typography className="text-gray-200">
                Humidity: <b> {today.humidity}%</b>
              </Typography>
              <Typography className="text-gray-200">
                Wind: <b>{today.wind} m/s</b>
              </Typography>
            </div>
          </div>
          {/* Upcoming Weather */}
          <div className="flex justify-between gap-3 mb-3">
            <div className="flex justify-between items-center gap-5  bg-white/10 rounded-lg p-3 shadow-md">
              <div className="flex flex-col items-center">
                <Typography className="text-white font-semibold">
                  {nextDays[0].temp_max}°C
                </Typography>
                <Typography className="text-gray-300">
                  {nextDays[0].humidity_max}
                </Typography>
              </div>
              <div className="text-center w-3/5">
                <img
                  src={`${iconPath}/${nextDays[0].wheather_icon_day}`}
                  alt={nextDays[0].wheather_icon_day}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-between items-center gap-5 bg-white/10 rounded-lg p-3 shadow-md">
              <div className="flex flex-col items-center">
                <Typography className="text-white font-semibold">
                  {nextDays[0].temp_min}°C
                </Typography>
                <Typography className="text-gray-300">
                  {nextDays[0].humidity_min}
                </Typography>
              </div>
              <div className="text-center w-2/5">
                <img
                  src={`${iconPath}/${nextDays[0].wheather_icon_night}`}
                  alt={nextDays[0].wheather_icon_night}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Typography className="text-white text-sm font-bold mx-0">
          {today.temp}°C
        </Typography>
      )}
    </div>
  );
};

export default WeatherCard;
