import { FaGaugeHigh } from "react-icons/fa6";
import React from "react";

const SpeedStatsWidget = ({ minSpeed = 0, avgSpeed = 0, maxSpeed = 0 }) => {
  return (
    <div className="bg-black/30 rounded-xl p-4 px-10 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <FaGaugeHigh className="text-teal-400" size={20} />
        <h3 className="text-lg font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
          Тезлик статистикаси
        </h3>
      </div>

      <div className="relative flex items-center justify-center p-5">
        {/* Min Speed Circle */}
        <div className="absolute left-0 -translate-x-1/4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/50 flex flex-col items-center justify-center">
              <span className="text-lg font-semibold text-blue-200">
                {minSpeed}
              </span>
              <span className="text-sm font-semibold text-blue-200">km/s</span>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-blue-200 font-medium">
              Мин
            </div>
          </div>
        </div>

        {/* Average Speed Circle (Larger) */}
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-teal-500/20 border-2 border-teal-500/50 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            <span className="text-2xl font-bold text-teal-200">{avgSpeed}</span>
            <span className="text-base font-semibold text-teal-200">km/s</span>
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-teal-200 font-medium">
            Ўрта
          </div>
        </div>

        {/* Max Speed Circle */}
        <div className="absolute right-0 translate-x-1/4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 flex flex-col items-center justify-center">
              <span className="text-lg font-semibold text-red-200">
                {maxSpeed}
              </span>
              <span className="text-sm font-semibold text-red-200">km/s</span>
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-red-200 font-medium">
              Макс
            </div>
          </div>
        </div>

        {/* Connecting lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-blue-500/50 via-teal-500/50 to-red-500/50" />
      </div>

      {/* Add spacing for the labels */}
      <div className="h-5" />
    </div>
  );
};

export default SpeedStatsWidget;
