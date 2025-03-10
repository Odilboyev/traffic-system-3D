import { useCallback, useState } from "react";

// Mock weather data - in a real app, this would come from an API
const mockWeatherData = [
  {
    id: 1,
    city: "Tashkent",
    lat: 41.2995,
    lng: 69.2401,
    temp: 28.5,
    feels_like: 30.2,
    humidity: 45,
    wind_speed: 3.5,
    wind_direction: "NE",
    pressure: 1012,
    weatherCode: 800,
    description: "Clear sky",
    forecast: [
      { day: "Today", high: 29, low: 18, weatherCode: 800 },
      { day: "Tomorrow", high: 30, low: 19, weatherCode: 801 },
      { day: "Day 3", high: 28, low: 17, weatherCode: 802 }
    ]
  },
  {
    id: 2,
    city: "Samarkand",
    lat: 39.6542,
    lng: 66.9597,
    temp: 26.8,
    feels_like: 28.1,
    humidity: 50,
    wind_speed: 4.2,
    wind_direction: "NW",
    pressure: 1010,
    weatherCode: 801,
    description: "Few clouds",
    forecast: [
      { day: "Today", high: 27, low: 16, weatherCode: 801 },
      { day: "Tomorrow", high: 28, low: 17, weatherCode: 800 },
      { day: "Day 3", high: 29, low: 18, weatherCode: 500 }
    ]
  },
  {
    id: 3,
    city: "Bukhara",
    lat: 39.7747,
    lng: 64.4286,
    temp: 30.2,
    feels_like: 32.5,
    humidity: 35,
    wind_speed: 5.1,
    wind_direction: "W",
    pressure: 1008,
    weatherCode: 802,
    description: "Scattered clouds",
    forecast: [
      { day: "Today", high: 31, low: 20, weatherCode: 802 },
      { day: "Tomorrow", high: 32, low: 21, weatherCode: 800 },
      { day: "Day 3", high: 30, low: 19, weatherCode: 801 }
    ]
  },
  {
    id: 4,
    city: "Namangan",
    lat: 41.0011,
    lng: 71.6725,
    temp: 25.7,
    feels_like: 26.9,
    humidity: 55,
    wind_speed: 3.8,
    wind_direction: "SE",
    pressure: 1014,
    weatherCode: 500,
    description: "Light rain",
    forecast: [
      { day: "Today", high: 26, low: 15, weatherCode: 500 },
      { day: "Tomorrow", high: 24, low: 14, weatherCode: 501 },
      { day: "Day 3", high: 27, low: 16, weatherCode: 800 }
    ]
  },
  {
    id: 5,
    city: "Andijan",
    lat: 40.7829,
    lng: 72.3442,
    temp: 27.3,
    feels_like: 29.1,
    humidity: 48,
    wind_speed: 4.5,
    wind_direction: "E",
    pressure: 1013,
    weatherCode: 801,
    description: "Few clouds",
    forecast: [
      { day: "Today", high: 28, low: 17, weatherCode: 801 },
      { day: "Tomorrow", high: 29, low: 18, weatherCode: 800 },
      { day: "Day 3", high: 27, low: 16, weatherCode: 802 }
    ]
  }
];

/**
 * Custom hook for managing weather data
 * @returns {Object} Functions and state for weather data management
 */
export const useWeather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch weather data
  const fetchWeatherData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll use the mock data with a delay to simulate network request
      setTimeout(() => {
        setWeatherData(mockWeatherData);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to fetch weather data");
      setIsLoading(false);
    }
  }, []);

  // Clear weather data
  const clearWeatherData = useCallback(() => {
    setWeatherData([]);
    setSelectedLocation(null);
  }, []);

  // Select a specific location
  const selectLocation = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  // Clear selected location
  const clearSelectedLocation = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  return {
    weatherData,
    isLoading,
    error,
    selectedLocation,
    fetchWeatherData,
    clearWeatherData,
    selectLocation,
    clearSelectedLocation
  };
};
