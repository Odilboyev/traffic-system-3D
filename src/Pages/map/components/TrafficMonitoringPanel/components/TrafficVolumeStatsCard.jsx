import { FaCarSide, FaTruck } from "react-icons/fa";

import { PiVanFill } from "react-icons/pi";
import PropTypes from "prop-types";

const TrafficVolumeStatsCard = ({ forwardedRef }) => {
  return (
    <div ref={forwardedRef} className="p-3 w-[25vw]">
      <div className="relative mb-4 flex items-center gap-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-center gap-2">
          <span className="text-teal-500/50">|</span>
          Транспорт турлари бўйича тақсимот
          <span className="text-teal-500/50">|</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 p-3 hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-md transition-colors rounded-lg bg-black/20">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex text-green-400 items-center gap-1.5">
              <FaCarSide
                className="drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                size={24}
              />
              <div className="font-bold">Yengil</div>
            </div>
            <div className="text-2xl font-semibold text-green-300">9.5M</div>
          </div>
        </div>
        <div className="flex-1 p-3 hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-md transition-colors rounded-lg bg-black/20">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex text-yellow-400 items-center gap-1.5">
              <PiVanFill
                className="drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                size={24}
              />
              <div className="font-bold">O&apos;rta</div>
            </div>
            <div className="text-2xl font-semibold text-yellow-300">60.9K</div>
          </div>
        </div>
        <div className="flex-1 p-3 hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-md transition-colors rounded-lg bg-black/20">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex text-red-400 items-center gap-1.5">
              <FaTruck
                className="drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]"
                size={24}
              />
              <div className="font-bold">Og'ir</div>
            </div>
            <div className="text-2xl font-semibold text-red-300">10.5K</div>
          </div>
        </div>
      </div>
    </div>
  );
};

TrafficVolumeStatsCard.propTypes = {
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

export default TrafficVolumeStatsCard;
