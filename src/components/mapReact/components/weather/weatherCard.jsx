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
    <Card className="w-full bg-gray-800/80  text-white">
      <CardHeader floated={false} className="bg-gray-800 p-2">
        <div className="flex items-center justify-between flex-grow">
          <div className="flex-shrink-0">
            <img
              src={`${iconPath}/${today.weather_icon}`}
              alt="Weather icon"
              className="w-12 h-12"
            />
          </div>
          <div className="">
            <Typography variant="h5" className="text-white">
              {today.temp}°C
            </Typography>
            <Typography className="text-gray-400">{today.weather}</Typography>
          </div>
          <div className="">
            <Typography className="text-gray-400 ">
              {today.humidity} % 💧
            </Typography>
            <Typography className="text-gray-400 ">
              {today.wind} m/s 🌪️
            </Typography>
            <Typography className="text-gray-400 ">
              {today.pressure} hPa 🌡️
            </Typography>
          </div>
        </div>
      </CardHeader>
      <div className="border-top border w-full mt-5"></div>
      <CardBody>
        <div className="flex justify-between items-center border-top">
          <Typography className="text-gray-400">Wind</Typography>
          <Typography className="text-white">{today.wind} m/s</Typography>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Typography className="text-gray-400">Humidity</Typography>
          <Typography className="text-white">{today.humidity}%</Typography>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Typography className="text-gray-400">Pressure</Typography>
          <Typography className="text-white">{today.pressure} hPa</Typography>
        </div>
        <div className="mt-4">
          {nextDays.map((day, index) => (
            <div key={index} className="flex justify-between items-center mt-2">
              <Typography className="text-gray-400">
                {day.date_short}
              </Typography>
              <div className="flex items-center">
                <img
                  src={`${iconPath}/${day.wheather_icon_day}`}
                  alt="Day icon"
                  className="w-6 h-6 drop-shadow-neon"
                />
                <img
                  src={`${iconPath}/${day.wheather_icon_night}`}
                  alt="Night icon"
                  className="w-6 h-6 ml-2"
                />
              </div>
              <Typography className="text-white">
                {day.temp_max}°/{day.temp_min}°
              </Typography>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default WeatherCard;
