import DevicesStatusPanel from "../../DevicesStatusPanel";
import React from "react";

const DevicesStatusPanelWrapper = ({ forwardedRef, cardsInfoData }) => {
  return (
    <div ref={forwardedRef} className="max-w-[40vw] mx-auto">
      <DevicesStatusPanel cardsInfoData={cardsInfoData} />
    </div>
  );
};

export default DevicesStatusPanelWrapper;
