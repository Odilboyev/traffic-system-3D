import {
  TbArrowRampLeft,
  TbArrowRampRight,
  TbArrowRotaryStraight,
  TbCornerUpLeft,
  TbCornerUpRight,
} from "react-icons/tb";

import { MdStraight } from "react-icons/md";
import PedestrianIcon from "./pedestrian";
import { PiArrowULeftDownBold } from "react-icons/pi";
import ThreeArrowsIcon from "./threeArrowIcon";

const iconSelector = ({ type = 1, status = 0, style }) => {
  const IconComponent = (() => {
    switch (type) {
      case 1:
        return TbArrowRotaryStraight;
      case 2:
        // return status === 1 ? IoIosWalk : IoMdMan;
        return PedestrianIcon;
      case 3:
        return TbCornerUpRight;
      case 4:
        return TbCornerUpLeft;
      case 5:
        return TbArrowRampRight;
      case 6:
        return TbArrowRampLeft;
      case 7:
        return ThreeArrowsIcon;
      case 8:
        return PiArrowULeftDownBold;
      default:
        return MdStraight;
    }
  })();

  return (
    <div className="flex items-center justify-center" style={style}>
      <IconComponent className=" sm:h-8 sm:w-8 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-8 xl:w-8" />
    </div>
  );
};
export default iconSelector;
