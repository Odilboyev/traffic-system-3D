import React from "react";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiBarometer, WiHumidity, WiStrongWind } from "react-icons/wi";
import { IoClose } from "react-icons/io5";

const getWeatherIcon = (weatherCode, size = "2em") => {
  // Weather codes based on common API standards
  let Icon;
  if (weatherCode >= 200 && weatherCode < 300) Icon = WiThunderstorm;
  else if (weatherCode >= 300 && weatherCode < 400) Icon = WiRain;
  else if (weatherCode >= 500 && weatherCode < 600) Icon = WiRain;
  else if (weatherCode >= 600 && weatherCode < 700) Icon = WiSnow;
  else if (weatherCode >= 700 && weatherCode < 800) Icon = WiFog;
  else if (weatherCode === 800) Icon = WiDaySunny;
  else if (weatherCode > 800) Icon = WiCloudy;
  else Icon = WiDaySunny; // Default
  
  return <Icon size={size} />;
};

const WeatherPopup = ({ data, onClose }) => {
  const { city, temp, feels_like, humidity, wind_speed, wind_direction, pressure, weatherCode, description, forecast } = data;
  
  return (
    <div className="weather-popup-content">
      <div className="weather-popup-header">
        <h3>{city}</h3>
        <button className="weather-popup-close" onClick={onClose}>
          <IoClose />
        </button>
      </div>
      
      <div className="weather-popup-main">
        <div className="weather-popup-current">
          <div className="weather-popup-temp">
            {Math.round(temp)}°C
          </div>
          <div className="weather-popup-icon">
            {getWeatherIcon(weatherCode, "3em")}
          </div>
          <div className="weather-popup-desc">
            {description}
          </div>
          <div className="weather-popup-feels">
            Feels like: {Math.round(feels_like)}°C
          </div>
        </div>
        
        <div className="weather-popup-details">
          <div className="weather-popup-detail-item">
            <WiHumidity size="1.5em" />
            <span>{humidity}%</span>
          </div>
          <div className="weather-popup-detail-item">
            <WiStrongWind size="1.5em" />
            <span>{wind_speed} m/s {wind_direction}</span>
          </div>
          <div className="weather-popup-detail-item">
            <WiBarometer size="1.5em" />
            <span>{pressure} hPa</span>
          </div>
        </div>
      </div>
      
      <div className="weather-popup-forecast">
        {forecast.map((day, index) => (
          <div key={index} className="weather-popup-forecast-day">
            <div className="weather-popup-forecast-day-name">{day.day}</div>
            <div className="weather-popup-forecast-day-icon">
              {getWeatherIcon(day.weatherCode, "1.5em")}
            </div>
            <div className="weather-popup-forecast-day-temp">
              <span className="high">{Math.round(day.high)}°</span>
              <span className="low">{Math.round(day.low)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherPopup;
