import { useEffect } from "react";
import VideoCallReceiver from "./CallCenter";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://172.25.24.182/smart/opendoor.php");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    // fetchData();

    return () => {};
  }, []);

  return (
    <div className="p-5">
      {/* Your content here */}
      <VideoCallReceiver />
    </div>
  );
}

export default App;
