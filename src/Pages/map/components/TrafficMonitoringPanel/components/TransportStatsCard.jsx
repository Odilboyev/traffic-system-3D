import React from 'react';

const TransportStatsCard = ({ forwardedRef }) => {
  return (
    <div ref={forwardedRef} className="p-3 w-[25vw]">
      <div className="relative mb-4 flex items-center gap-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-center gap-2">
          <span className="text-teal-500/50">|</span>
          Транспорт оқими статистикаси
          <span className="text-teal-500/50">|</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 p-3 hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-md transition-colors rounded-lg bg-black/20">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-green-400 font-bold daily">Kunlik</div>
            </div>
            <div className="text-2xl font-semibold text-green-300">10.5M</div>
          </div>
        </div>
        <div className="flex-1 p-3 hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-md transition-colors rounded-lg bg-black/20">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-yellow-400 font-bold weekly">Haftalik</div>
            </div>
            <div className="text-2xl font-semibold text-yellow-300">80.5M</div>
          </div>
        </div>
        <div className="flex-1 p-3 hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-md transition-colors rounded-lg bg-black/20">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-red-400 font-bold monthly">Oylik</div>
            </div>
            <div className="text-2xl font-semibold text-red-300">100M</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportStatsCard;
