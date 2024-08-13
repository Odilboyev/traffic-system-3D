import TrafficLightsCard from "./singleCard";
import PropTypes from "prop-types";
const BottomSection = ({ cardsInfoData = [] }) => {
  return (
    <div className="max-w-[70%] px-5 mx-auto left-0 right-0 r absolute bottom-1 z-[999] min-h-[20vh] flex justify-center items-center gap-10 ">
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
  cardsInfoData: PropTypes.array,
};
export default BottomSection;
