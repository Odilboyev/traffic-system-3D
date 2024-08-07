import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { getWeatherData } from "../../../../api/apiHandlers";
const WeatherCard = () => {
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
  }, []);

  if (!weatherData) {
    return <div></div>;
  }

  const today = weatherData.today;
  const nextDays = Object.values(weatherData.nextdays);
  const iconPath = "@/../../public/icons/wheather_icons";

  return (
    <Card className="w-full text-white shadow-none bg-transparent">
      <CardBody>
        <div className="flex justify-evenly items-center gap-5 mb-4">
          <div className="flex flex-col gap-2 ">
            <div>
              <Typography variant="h5" className="text-white">
                {today.temp}°C
              </Typography>
              <Typography className="text-gray-400">
                {today.humidity}% 💧
              </Typography>
              <Typography className="text-gray-400">
                {today.wind} m/s 💨
              </Typography>
            </div>
            <div className="text-center">
              <img
                src={`${iconPath}/${today.weather_icon}`}
                alt="Weather icon"
                className="w-16 h-16 my-3"
              />
            </div>
          </div>
          <div className="flex flex-col justify-between h-full items-stretch">
            <div className="flex justify-between gap-5 mb-7 flex-grow">
              <div>
                <Typography className="text-white">
                  {nextDays[0].temp_max}°C
                </Typography>
                <Typography className="text-gray-400">
                  {nextDays[0].humidity_max}
                </Typography>
              </div>
              <div className="text-center flex-grow">
                <img
                  src={`${iconPath}/${nextDays[0].wheather_icon_day}`}
                  alt="Weather icon"
                  className="w-8 h-8"
                />
              </div>
            </div>
            <div className="flex justify-between gap-5 flex-grow">
              <div>
                <Typography className="text-white">
                  {nextDays[0].temp_min}°C
                </Typography>
                <Typography className="text-gray-400">
                  {nextDays[0].humidity_min}
                </Typography>
              </div>
              <div className="text-center flex-grow">
                <img
                  src={`${iconPath}/${nextDays[0].wheather_icon_night}`}
                  alt="Weather icon"
                  className="w-8 h-8"
                />
              </div>
            </div>
          </div>
        </div>
        {/* <div className="border border-top mt-5"></div> */}
        <div className="mt-4 flex ">
          {nextDays?.slice(1).map((day, index) => (
            <div
              key={index}
              className="flex flex-col justify-between items-center mb-2 basis-full"
            >
              <div>
                <Typography className="text-gray-400">
                  {day.date_short}
                </Typography>
              </div>
              <div className="flex flex-col items-center justify-center mt-2">
                <div className="text-center pb-2 mb-3 border-b">
                  <img
                    src={`${iconPath}/${day.wheather_icon_day}`}
                    alt="Day icon"
                    className="w-6 h-6 mx-auto my-1"
                  />
                  <Typography className="text-white">
                    {day.temp_max}°C
                  </Typography>
                  <Typography className="text-gray-400">
                    {nextDays[0].humidity_max}
                  </Typography>
                </div>
                <div className="text-center">
                  <img
                    src={`${iconPath}/${day.wheather_icon_night}`}
                    alt="Night icon"
                    className="w-6 h-6 mx-auto my-1"
                  />
                  <Typography className="text-white">
                    {day.temp_min}°C
                  </Typography>
                  <Typography className="text-gray-400">
                    {nextDays[0].humidity_min}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default WeatherCard;
