import { CameraIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { LiaTrafficLightSolid } from "react-icons/lia";
import { MdOutlineSensorWindow } from "react-icons/md";
import PropTypes from "prop-types";

const statusStyles = {
  0: "bg-green-500/20 text-green-300 ring-green-300 ",
  1: "bg-yellow-500/20 text-yellow-300 ring-yellow-300",
  2: "bg-red-500/20 text-red-300 ring-red-300",
  3: "bg-gray-500/20 text-gray-300 ring-gray-300",
};

const NeonIcon = ({ iconType, status }) => {
  const statusClass = statusStyles[status] || statusStyles[0];
  const [IconComponent, setIconComponent] = useState(
    () => LiaTrafficLightSolid
  );

  useEffect(() => {
    if (typeof iconType === "number") {
      switch (iconType) {
        case 4:
          setIconComponent(() => LiaTrafficLightSolid);
          break;
        case 1:
          setIconComponent(() => CameraIcon);
          break;
        case 3:
          setIconComponent(() => MdOutlineSensorWindow);
          break;
        default:
          setIconComponent(() => LiaTrafficLightSolid);
          break;
      }
    }

    return () => {
      setIconComponent(() => LiaTrafficLightSolid);
    };
  }, [iconType]);
  return (
    <div
      className={`flex items-center justify-center p-2 rounded-full shadow-neon ring-1 ${statusClass} `}
    >
      <IconComponent className="w-8 h-8" />
    </div>
  );
};
NeonIcon.propTypes = {
  iconType: PropTypes.number.isRequired,
  status: PropTypes.oneOf([0, 1, 2, 3, 4]).isRequired,
};

export default NeonIcon;
