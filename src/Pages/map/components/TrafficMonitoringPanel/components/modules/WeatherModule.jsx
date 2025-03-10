import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTemperatureHigh,
  FaTemperatureLow,
} from "react-icons/fa";
import {
  WiBarometer,
  WiCloudy,
  WiDaySunny,
  WiHumidity,
  WiRain,
  WiSnow,
  WiStrongWind,
} from "react-icons/wi";

import React from "react";
import SlidePanel from "../../../../../../components/SlidePanel/SlidePanel";
import { useZoomPanel } from "../../../../context/ZoomPanelContext";

const WeatherModule = () => {
  const conditionMet = useZoomPanel();
  // Current weather data
  const currentWeather = {
    city: "Toshkent",
    date: "2023-08-15",
    temperature: 32,
    condition: "sunny",
    humidity: 45,
    wind: 12,
    pressure: 1013,
    feelsLike: 34,
  };

  // Forecast data for next days
  const forecast = [
    { day: "Bugun", high: 32, low: 24, condition: "sunny" },
    { day: "Ertaga", high: 30, low: 23, condition: "cloudy" },
    { day: "Seshanba", high: 28, low: 22, condition: "rain" },
    { day: "Chorshanba", high: 27, low: 21, condition: "cloudy" },
    { day: "Payshanba", high: 29, low: 22, condition: "sunny" },
  ];

  // Weather alerts
  const alerts = [
    {
      type: "Kuchli shamol",
      severity: "moderate",
      time: "15:00 - 18:00",
      areas: ["Markaziy", "Shimoliy"],
    },
    {
      type: "Yomg'ir",
      severity: "low",
      time: "Ertaga 10:00 - 14:00",
      areas: ["Janubiy", "G'arbiy"],
    },
  ];

  // Helper function to get weather icon based on condition
  const getWeatherIcon = (condition, size = "text-4xl") => {
    switch (condition) {
      case "sunny":
        return <WiDaySunny className={`${size} text-yellow-400`} />;
      case "cloudy":
        return <WiCloudy className={`${size} text-gray-300`} />;
      case "rain":
        return <WiRain className={`${size} text-blue-300`} />;
      case "snow":
        return <WiSnow className={`${size} text-white`} />;
      default:
        return <WiDaySunny className={`${size} text-yellow-400`} />;
    }
  };

  // Helper function to get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-900/50 text-red-300";
      case "moderate":
        return "bg-orange-900/50 text-orange-300";
      case "low":
        return "bg-yellow-900/50 text-yellow-300";
      default:
        return "bg-gray-900/50 text-gray-300";
    }
  };

  const content = (
    <div className="weather-module space-y-4">
      {/* Current Weather */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-cyan-100 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-cyan-400" />
              {currentWeather.city}
            </h3>
            <p className="text-xs text-gray-400 flex items-center mt-1">
              <FaCalendarAlt className="mr-1" /> {currentWeather.date}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cyan-100">
              {currentWeather.temperature}°C
            </div>
            <p className="text-xs text-gray-400">
              Seziladi: {currentWeather.feelsLike}°C
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex flex-col items-center">
            {getWeatherIcon(currentWeather.condition)}
            <span className="text-sm text-gray-300 mt-1">
              {currentWeather.condition === "sunny"
                ? "Quyoshli"
                : currentWeather.condition === "cloudy"
                ? "Bulutli"
                : currentWeather.condition === "rain"
                ? "Yomg'irli"
                : "Qorli"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <WiHumidity className="text-2xl text-blue-300 mr-1" />
              <div>
                <div className="text-sm text-gray-300">Namlik</div>
                <div className="text-md font-medium text-cyan-100">
                  {currentWeather.humidity}%
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <WiStrongWind className="text-2xl text-gray-300 mr-1" />
              <div>
                <div className="text-sm text-gray-300">Shamol</div>
                <div className="text-md font-medium text-cyan-100">
                  {currentWeather.wind} km/s
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <WiBarometer className="text-2xl text-cyan-300 mr-1" />
              <div>
                <div className="text-sm text-gray-300">Bosim</div>
                <div className="text-md font-medium text-cyan-100">
                  {currentWeather.pressure} hPa
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3">
          5 Kunlik Ob-havo Bashorati
        </h3>

        <div className="space-y-2">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="p-2 rounded-md bg-gray-700/50 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-10">
                  {getWeatherIcon(day.condition, "text-2xl")}
                </div>
                <span className="text-sm text-gray-300 w-24">{day.day}</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <FaTemperatureHigh className="text-red-400 mr-1" />
                  <span className="text-sm font-medium text-gray-300">
                    {day.high}°
                  </span>
                </div>
                <div className="flex items-center">
                  <FaTemperatureLow className="text-blue-400 mr-1" />
                  <span className="text-sm font-medium text-gray-300">
                    {day.low}°
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-lg font-semibold text-cyan-100 mb-3">
          Ob-havo Ogohlantirishlari
        </h3>

        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="p-3 rounded-md bg-gray-700/50 border-l-4 border-orange-500"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-md font-medium text-cyan-100">
                    {alert.type}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(
                      alert.severity
                    )}`}
                  >
                    {alert.severity === "high"
                      ? "Yuqori"
                      : alert.severity === "moderate"
                      ? "O'rta"
                      : "Past"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Vaqt: {alert.time}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Hududlar: {alert.areas.join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400">
            Hozirda faol ogohlantirishlar yo'q
          </div>
        )}
      </div>
    </div>
  );
  return (
    <>
      <SlidePanel side="left" isOpen={conditionMet} content={content} />
    </>
  );
};

export default WeatherModule;
