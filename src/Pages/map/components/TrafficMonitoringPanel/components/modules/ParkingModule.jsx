import { useEffect, useState } from "react";

import PropTypes from "prop-types";
import SlidePanel from "../../../../../../components/SlidePanel/SlidePanel";
import { getParkingWidgets } from "../../../../../../api/api.handlers";
import { useZoomPanel } from "../../../../context/ZoomPanelContext";

const BottomPanelContent = ({ parkingData }) => {
  if (!parkingData?.widget_1?.data) return null;
  const totalData = parkingData.widget_1.data[0];

  return (
    <div className="relative p-4">
      <div className="relative mb-4 flex items-center gap-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <h3 className="text-sm uppercase text-center tracking-[0.2em] font-medium text-cyan-200 relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] flex items-center gap-2">
          <span className="text-cyan-500/50">|</span>
          {parkingData.widget_1.name}
          <span className="text-cyan-500/50">|</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-cyan-950/30 transition-all duration-300">
          <div className="text-sm text-cyan-500/70 mb-1">Total Parkings</div>
          <div className="text-2xl font-bold text-cyan-200">{totalData.parkings_count}</div>
        </div>
        <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-cyan-950/30 transition-all duration-300">
          <div className="text-sm text-cyan-500/70 mb-1">Total Spaces</div>
          <div className="text-2xl font-bold text-cyan-200">{totalData.space_max_sum}</div>
        </div>
        <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-cyan-950/30 transition-all duration-300">
          <div className="text-sm text-cyan-500/70 mb-1">Occupied</div>
          <div className="text-2xl font-bold text-cyan-200">{totalData.space_busy_sum}</div>
        </div>
        <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-cyan-950/30 transition-all duration-300">
          <div className="text-sm text-cyan-500/70 mb-1">Available</div>
          <div className="text-2xl font-bold text-cyan-200">{totalData.space_free_sum}</div>
        </div>
      </div>
    </div>
  );
};

const LeftSidePanelContent = ({ parkingData }) => {
  if (!parkingData?.widget_2?.data) return null;
  const streetData = parkingData.widget_2.data[0];

  return (
    <div className="relative w-[25vw] p-4">
      <div className="relative mb-4 flex items-center gap-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <h3 className="text-sm uppercase text-center tracking-[0.2em] font-medium text-cyan-200 relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] flex items-center gap-2">
          <span className="text-cyan-500/50">|</span>
          {parkingData.widget_2.name}
          <span className="text-cyan-500/50">|</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </div>
      <div className="flex flex-col space-y-3">
        <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-cyan-950/30 transition-all duration-300">
          <div className="text-sm text-cyan-500/70 mb-1">Street Parkings</div>
          <div className="text-2xl font-bold text-cyan-200">{streetData.parkings_count}</div>
        </div>
        <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-cyan-950/30 transition-all duration-300">
          <div className="text-sm text-cyan-500/70 mb-1">Total Spaces</div>
          <div className="text-2xl font-bold text-cyan-200">{streetData.space_max_sum}</div>
        </div>
        <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-cyan-950/30 transition-all duration-300">
          <div className="text-sm text-cyan-500/70 mb-1">Occupied</div>
          <div className="text-2xl font-bold text-cyan-200">{streetData.space_busy_sum}</div>
        </div>
        <div className="bg-black/30 border border-cyan-500/20 backdrop-blur-sm rounded-lg p-3 hover:bg-cyan-950/30 transition-all duration-300">
          <div className="text-sm text-cyan-500/70 mb-1">Available</div>
          <div className="text-2xl font-bold text-cyan-200">{streetData.space_free_sum}</div>
        </div>
      </div>
    </div>
  );
};

const RightSidePanelContent = ({ parkingData }) => {
  if (!parkingData?.widget_4?.data) return null;

  return (
    <div className="relative w-[25vw] p-4">
      <div className="relative mb-4 flex items-center gap-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <h3 className="text-sm uppercase text-center tracking-[0.2em] font-medium text-cyan-200 relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] flex items-center gap-2">
          <span className="text-cyan-500/50">|</span>
          {parkingData.widget_4.name}
          <span className="text-cyan-500/50">|</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </div>
      <div className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-hide">
        {parkingData.widget_4.data.map((parking) => (
          <div
            key={parking.id}
            className="flex items-center justify-between gap-3 text-sm p-3 bg-black/30 border border-cyan-500/20 hover:bg-cyan-950/30 transition-colors rounded-lg group backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></div>
              <span className="text-cyan-100">{parking.name}</span>
            </div>
            <div className="flex items-center gap-4 text-cyan-300">
              <div className="flex items-center gap-2">
                <span className="text-cyan-500/70">Occupancy:</span>
                <span className="font-medium">{parking.load_percent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-500/70">Free:</span>
                <span className="font-medium">{parking.space_free}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ParkingModule = () => {
  const conditionMet = useZoomPanel();
  const [parkingData, setParkingData] = useState(null);

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const data = await getParkingWidgets();
        setParkingData(data);
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    };

    fetchParkingData();
    const interval = setInterval(fetchParkingData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <SlidePanel
        side="bottom"
        isOpen={conditionMet}
        content={<BottomPanelContent parkingData={parkingData} />}
      />
      <SlidePanel
        side="left"
        isOpen={conditionMet}
        content={<LeftSidePanelContent parkingData={parkingData} />}
      />
      <SlidePanel
        side="right"
        isOpen={conditionMet}
        content={<RightSidePanelContent parkingData={parkingData} />}
      />
    </div>
  );
};

BottomPanelContent.propTypes = {
  parkingData: PropTypes.object,
};

LeftSidePanelContent.propTypes = {
  parkingData: PropTypes.object,
};

RightSidePanelContent.propTypes = {
  parkingData: PropTypes.object,
};



export default ParkingModule;
