import { useState, useEffect } from "react";

const ClockOnMap = () => {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("");

  useEffect(() => {
    // Update time every second
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    // Get the user's current location
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
              .then((response) => response.json())
              .then((data) =>
                setLocation(data.locality || "Location not available")
              )
              .catch((error) => setLocation("Location not available"));
          },
          (error) => setLocation("Location not available")
        );
      } else {
        setLocation("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = time.toLocaleDateString(undefined, options);
  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="w-[15vw] h-[15vw] fixed top-0 right-0 z-[99999] flex flex-col items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md text-white rounded-lg shadow-lg">
      <div className="text-3xl font-bold">{timeString}</div>
      <div className="text-xl text-gray-400 mt-2">{date}</div>
      <div className="mt-4 text-xl font-bold text-gray-300">{location}</div>
    </div>
  );
};

export default ClockOnMap;
