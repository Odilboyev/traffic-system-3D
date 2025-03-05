import DevicesStatusPanelWrapper from "./DevicesStatusPanelWrapper";
import React from "react";

const BottomPanel = ({ cardsInfoData }) => {
  return (
    <div className="bottom-panel">
      <DevicesStatusPanelWrapper cardsInfoData={cardsInfoData} />
    </div>
  );
};

export default BottomPanel;
