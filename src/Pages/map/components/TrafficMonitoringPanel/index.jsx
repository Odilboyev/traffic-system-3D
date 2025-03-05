import "./styles.trafficMonitoring.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import { useEffect, useRef, useState } from "react";

import BottomPanel from "./components/BottomPanel";
import LeftSidePanel from "./components/LeftSidePanel";
import RightSidePanel from "./components/RightSidePanel";
import SlidePanel from "../../../../components/SlidePanel/SlidePanel";
import TopPanelContent from "./components/TopPanelContent";
import { getInfoForCards } from "../../../../api/api.handlers";
import { useZoomPanel } from "../../context/ZoomPanelContext";
import { useModule } from "../../context/ModuleContext";

const TrafficMonitoringPanel = ({ map }) => {
  const [cardsInfoData, setCardsInfoData] = useState([]);
  const [mainSwiperLoaded, setMainSwiperLoaded] = useState(false);
  const [mainSwiperInstance, setMainSwiperInstance] = useState(null);
  const { activeModule } = useModule();
  const conditionMet = useZoomPanel();

  // Ensure main swiper is updated when component is fully mounted
  useEffect(() => {
    if (mainSwiperInstance) {
      // Force update after a short delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        mainSwiperInstance.update();
        setMainSwiperLoaded(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [mainSwiperInstance]);

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
    <>
      <SlidePanel 
        side="top" 
        isOpen={true} 
        content={<TopPanelContent />} 
      />

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
    </>
  );
};

export default TrafficMonitoringPanel;
