import PropTypes from "prop-types";
import TrafficLightsCard from "./singleCard";
const BottomSection = ({ cardsInfoData = [] }) => {
  return (
    <div className="max-w-[80%] px-5 mx-auto left-0 right-0 r absolute bottom-1 z-[999] min-h-[10vh] flex justify-center items-center gap-10 ">
      {cardsInfoData?.length > 0 &&
        cardsInfoData.map((item, index) => (
          <TrafficLightsCard
            key={index}
            data={item}
            length={cardsInfoData.length}
          />
        ))}
    </div>
  );
};
BottomSection.propTypes = {
  cardsInfoData: PropTypes.any,
};
export default BottomSection;
