import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getInfoForCards } from "../../../../api/api.handlers";
import InfoWidgetCard from "./singleCard";

const InfoWidget = ({ t }) => {
  const [cardsInfoData, setCardsInfoData] = useState([]);
  useEffect(() => {
    const fetchCardsInfoData = async () => {
      try {
        const data = await getInfoForCards();
        setCardsInfoData(data);
      } catch (error) {
        console.error("Error fetching cards info data:", error);
      }
    };
    fetchCardsInfoData();
  }, []);
  return (
    <div className="fixed bottom-1 left-0 right-0 z-[999] px-5 mx-auto">
      <div className="max-w-[80%] mx-auto flex justify-center items-center gap-10">
        {cardsInfoData?.length > 0 &&
          cardsInfoData.map((item, index) => (
            <InfoWidgetCard
              key={index}
              data={item}
              length={cardsInfoData.length}
            />
          ))}
      </div>
    </div>
  );
};

InfoWidget.propTypes = {
  cardsInfoData: PropTypes.array,
};

export default InfoWidget;