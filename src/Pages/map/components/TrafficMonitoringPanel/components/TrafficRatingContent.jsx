import React from 'react';

const TrafficRatingContent = ({ forwardedRef }) => {
  const ratings = [9.1, 9, 8.2, 8, 7, 5.4];
  
  return (
    <div ref={forwardedRef} className="w-[15vw] p-3">
      <div className="relative mb-4 flex items-center gap-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-center gap-2">
          <span className="text-teal-500/50">|</span>5 та тирбантлиги юқори
          чоррахалар
          <span className="text-teal-500/50">|</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-y-4 gap-x-0">
        {ratings.map((rating, idx) => (
          <div className="flex flex-col items-center" key={idx}>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={
                    rating > 8.5
                      ? "#ef444422"
                      : rating > 7.5
                      ? "#f9731622"
                      : "#aeea0821"
                  }
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={
                    rating > 8.5
                      ? "#ef4444"
                      : rating > 7.5
                      ? "#f97316"
                      : "#b2ea08"
                  }
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${rating * 10}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`text-xl font-bold ${
                    rating > 8.5
                      ? "text-red-400"
                      : rating > 7.5
                      ? "text-orange-400"
                      : "text-yellow-400"
                  }`}
                >
                  {rating}
                </div>
              </div>
            </div>
            <div className="text-sm text-blue-gray-300 mt-1 font-medium">
              01-123
            </div>
            <div className="text-xs text-blue-gray-400">Чилонзор</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrafficRatingContent;
