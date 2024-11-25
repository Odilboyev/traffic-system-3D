import WeatherCard from "./weatherCard";

const WeatherWidget = ({ t }) => {
  return (
    <div className="weather w-[280px] bg-gray-900/80 backdrop-blur-md  rounded-lg shadow-lg p-3">
      <WeatherCard />
    </div>
  );
};

export default WeatherWidget;
