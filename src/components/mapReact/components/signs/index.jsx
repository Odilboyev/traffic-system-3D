import { useState } from "react";
import Signs from "./signs";

const SignsContainer = ({ isInModal }) => {
  const [signs, setSigns] = useState([]);

  const clearSigns = () => {
    setSigns([]);
  };

  return (
    <>
      <Signs signs={signs} setSigns={setSigns} clearSigns={clearSigns} />
    </>
  );
};

export default SignsContainer;
