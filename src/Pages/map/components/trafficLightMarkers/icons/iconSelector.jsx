import ModernTrafficLight from "./ModernTrafficLight";
import PedestrianIcon from "./pedestrian";
import ThreeArrowsIcon from "./threeArrowIcon";

const iconSelector = ({ type = 1, status = 0, style, countdown }) => {
  // Return the original pedestrian icon for type 2
  if (type === 2) {
    return (
      <div className="flex items-center justify-center" style={style}>
        <PedestrianIcon className="sm:h-8 sm:w-8 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-8 xl:w-8" />
      </div>
    );
  }

  // // Return the original three arrows icon for type 7
  // if (type === 7) {
  //   return (
  //     <div className="flex items-center justify-center" style={style}>
  //       <ThreeArrowsIcon className="sm:h-8 sm:w-8 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-8 xl:w-8" />
  //     </div>
  //   );
  // }

  // Use modern traffic light design for all other types
  return (
    <ModernTrafficLight
      type={type}
      status={status}
      countdown={countdown}
      rotate={style?.transform ? parseInt(style.transform.match(/\d+/)[0]) : 0}
    />
  );
};

export default iconSelector;
