import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { useEffect, useState } from "react";

import CountUp from "react-countup";
import PropTypes from "prop-types";
import { crossroadsRanking } from "../data";

const TopCrossroadsContent = ({ forwardedRef, isOpen }) => {
  const [triggerCount, setTriggerCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTriggerCount((prev) => prev + 1);
    }
  }, [isOpen]);
  return (
    <div className="relative" ref={forwardedRef}>
      <div className="w-[25vw] p-4 ">
        <div className="relative mb-4 flex items-center gap-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
          <h3 className="text-sm uppercase text-center tracking-[0.2em] font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-center gap-2">
            <span className="text-teal-500/50">|</span>
            10 та ўтказувчанлиги юқори чоррахалар
            <span className="text-teal-500/50">|</span>
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        </div>
        <div className="relative">
          <div className="space-y-2 max-h-[25vh] overflow-y-scroll scrollbar-hide">
            {crossroadsRanking.map((item, idx) => (
              <div
                className="flex items-center justify-between gap-3 text-sm p-2 hover:bg-white/5 transition-colors rounded-lg group"
                key={idx}
              >
                <div className="flex mr-5 items-center gap-3">
                  <span className="text-sm font-semibold text-teal-300 group-hover:text-teal-200 transition-colors">
                    {idx + 1}.
                  </span>
                  <span className="text-sm text-white/80 group-hover:text-white/100 transition-colors">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center text-right justify-end gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-gray-500/20 to-blue-gray-500/40 text-blue-gray-200 text-sm font-medium border border-blue-gray-500/20 group-hover:from-blue-gray-500/30 group-hover:to-blue-gray-500/50 transition-all">
                      <span className="inline-block min-w-[4rem] text-center">
                        <CountUp
                          key={`lastWeek-${triggerCount}-${idx}`}
                          end={item.volume.lastWeek}
                          duration={2}
                          separator=","
                          start={0}
                        />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-500/40 text-blue-200 text-sm font-medium border border-blue-500/20 group-hover:from-blue-500/30 group-hover:to-blue-500/50 transition-all">
                      <span className="inline-block min-w-[4rem] text-center">
                        <CountUp
                          key={`today-${triggerCount}-${idx}`}
                          end={item.volume.today}
                          duration={2}
                          separator=","
                          start={0}
                        />
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-2.5 rounded-lg transition-all ${
                      item.volume.today - item.volume.lastWeek > 0
                        ? "bg-gradient-to-r from-green-500/20 to-green-500/40 text-green-300 border border-green-500/20 group-hover:from-green-500/30 group-hover:to-green-500/50"
                        : "bg-gradient-to-r from-red-500/20 to-red-500/40 text-red-300 border border-red-500/20 group-hover:from-red-500/30 group-hover:to-red-500/50"
                    }`}
                  >
                    {item.volume.today - item.volume.lastWeek > 0 ? (
                      <FaArrowTrendUp size={14} />
                    ) : (
                      <FaArrowTrendDown size={14} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

TopCrossroadsContent.propTypes = {
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  isOpen: PropTypes.bool,
};

TopCrossroadsContent.defaultProps = {
  isOpen: false,
};

export default TopCrossroadsContent;
