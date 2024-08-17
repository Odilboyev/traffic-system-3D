import { useEffect, useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { getWeatherData } from "../../../../api/apiHandlers";

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await getWeatherData();
      setWeatherData(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching the weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (!weatherData) {
    return <div></div>;
  }

  const today = weatherData.today;
  const nextDays = Object.values(weatherData.nextdays);
  const iconPath = "icons/wheather_icons";

  return (
    <Card className="w-full mt-5 bg-transparent text-white shadow-xl rounded-xl bg-gradient-to-br from-blue-gray-900/60 to-black/50">
      <CardBody className="p-6">
        <div className="flex justify-evenly items-center gap-5 my-10">
          {/* Today's Weather */}
          <div className="text-center w-1/5">
            <img
              src={`${iconPath}/${today.weather_icon}`}
              alt="Weather icon"
              className="w-full my-3"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Typography className="text-white text-xl font-bold mx-0">
              {today.temp}°C
            </Typography>
            <Typography className="text-gray-200">
              Humidity: {today.humidity}%
            </Typography>
            <Typography className="text-gray-200">
              Wind: {today.wind} m/s
            </Typography>
          </div>
          {/* Upcoming Weather */}
          <div className="flex flex-col justify-between items-stretch w-2/5 gap-4">
            <div className="flex justify-between items-center gap-5 mb-3 bg-white/10 rounded-lg p-3 shadow-md">
              <div className="flex flex-col items-center">
                <Typography className="text-white font-semibold">
                  {nextDays[0].temp_max}°C
                </Typography>
                <Typography className="text-gray-300">
                  {nextDays[0].humidity_max}
                </Typography>
              </div>
              <div className="text-center w-2/5">
                <img
                  src={`${iconPath}/${nextDays[0].wheather_icon_day}`}
                  alt="Weather icon"
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
                  alt="Weather icon"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Future Days (Commented Section) */}
        {/* <div className="border-t border-white/20 mt-5"></div>
        <div className="mt-4 flex max-w-full overflow-x-scroll no-scrollbar space-x-4">
          {nextDays?.slice(1).map((day, index) => (
            <div
              key={index}
              className="flex flex-col justify-between items-center mb-2 basis-1/4 bg-white/10 p-4 rounded-lg shadow-md"
            >
              <div>
                <Typography className="text-gray-200 font-semibold">
                  {day.date_short}
                </Typography>
              </div>
              <div className="flex flex-col items-center justify-center mt-2">
                <img
                  src={`${iconPath}/${day.wheather_icon_day}`}
                  alt="Day icon"
                  className="w-10 h-10 mx-auto my-1"
                />
                <Typography className="text-white font-bold">
                  {day.temp_max}°C
                </Typography>
                <Typography className="text-gray-300">
                  {day.humidity_max}%
                </Typography>
                <img
                  src={`${iconPath}/${day.wheather_icon_night}`}
                  alt="Night icon"
                  className="w-10 h-10 mx-auto my-1 mt-3"
                />
                <Typography className="text-white font-bold">
                  {day.temp_min}°C
                </Typography>
                <Typography className="text-gray-300">
                  {day.humidity_min}%
                </Typography>
              </div>
            </div>
          ))}
        </div> */}
      </CardBody>
    </Card>
  );
};

export default WeatherCard;
