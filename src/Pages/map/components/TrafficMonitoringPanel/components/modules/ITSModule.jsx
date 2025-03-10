import { useEffect, useState } from "react";

import BottomPanel from "../BottomPanel";
import LeftSidePanel from "../LeftSidePanel";
import RightSidePanel from "../RightSidePanel";
import SlidePanel from "../../../../../../components/SlidePanel/SlidePanel";
import { getInfoForCards } from "../../../../../../api/api.handlers";
import { useZoomPanel } from "../../../../context/ZoomPanelContext";

const ITSModule = ({ map }) => {
  const conditionMet = useZoomPanel();
  const [cardsInfoData, setCardsInfoData] = useState([]);
  // device stats
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
    <div>
      {" "}
      <SlidePanel
        side="bottom"
        isOpen={conditionMet}
        content={<BottomPanel cardsInfoData={cardsInfoData} />}
      />
      <SlidePanel
        side="left"
        isOpen={conditionMet}
        content={<LeftSidePanel />}
      />
      <SlidePanel
        side="right"
        isOpen={conditionMet}
        content={<RightSidePanel />}
      />
    </div>
  );
};

export default ITSModule;
