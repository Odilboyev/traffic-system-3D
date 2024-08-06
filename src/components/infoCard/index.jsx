import TrafficLightsCard from "./singleCard";

const BottomSection = ({ cardsInfoData = [] }) => {
  return (
    <div className="container mx-auto left-0 right-0 r absolute bottom-0 z-[9999] w-full min-h-[30vh] flex justify-center items-center gap-10 p-4 py-8 ">
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
export default BottomSection;
