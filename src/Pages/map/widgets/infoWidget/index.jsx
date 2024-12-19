import { useEffect, useState } from "react";

import InfoWidgetCard from "./singleCard";
import PropTypes from "prop-types";
import { getInfoForCards } from "../../../../api/api.handlers";

const InfoWidget = ({ t, changedMarker, isSideBarOpen }) => {
  const [cardsInfoData, setCardsInfoData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [changedMarker]);

  if (isMobile) return null;

  return (
    <div className={`fixed bottom-1 left-0 right-0 z-[999] px-5 mx-auto `}>
      <div
        className={`max-w-[69%]  mx-auto flex justify-center items-end gap-10`}
      >
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
