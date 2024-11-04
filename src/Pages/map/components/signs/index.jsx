import { useState } from "react";
import Signs from "./signs";

const SignsContainer = ({ isVisible }) => {
  const [signs, setSigns] = useState([]);

  const clearSigns = () => {
    setSigns([]);
  };

  return (
    <div>
      {isVisible && (
        <Signs signs={signs} setSigns={setSigns} clearSigns={clearSigns} />
      )}
    </div>
  );
};

export default SignsContainer;
