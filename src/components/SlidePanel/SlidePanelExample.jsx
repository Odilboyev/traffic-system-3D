import "./SlidePanelExample.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import { EffectCoverflow, Navigation } from "swiper/modules";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaCarSide,
  FaLongArrowAltDown,
  FaLongArrowAltUp,
  FaTruck,
} from "react-icons/fa";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { PiVanFill } from "react-icons/pi";
import SlidePanel from "./SlidePanel";
import WeatherCard from "../../Pages/map/components/sidebar/components/weather/weatherCard";

const TrafficMonitoringPanel = () => {
  const [isLeftPanelOpen, setLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setRightPanelOpen] = useState(true);

  const leftPanelContent = (
    <div className="p-12 bg-gradient-to-r from-blue-gray-900/70 to-blue-gray-900/1 h-full max-h-full overflow-y-scroll min-w-sm scrollbar-hide">
      <h2 className="panel-title">Transportlarni xarakat statistikasi</h2>

      {/* Traffic Congestion Section */}
      <div className="mt-6 space-y-6">
        <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-white/10">
          <h3 className="text-lg font-medium text-blue-gray-300 mb-4">
            10 та ўтказувчанлиги юқори чоррахалар
          </h3>
          <div className="space-y-4">
            {[
              {
                name: "01-223 (Навоий ва Абай)",
                volume: { today: 253350, lastWeek: 55350 },
              },
              {
                name: "02-778 (Мирзо-Улуғбек)",
                volume: { today: 32120, lastWeek: 43890 },
              },
              {
                name: "02-334 (Юнусобод)",
                volume: { today: 4780, lastWeek: 4120 },
              },
              {
                name: "02-115 (Фарғона йўли)",
                volume: { today: 4250, lastWeek: 3890 },
              },
              {
                name: "01-445 (Яккасарой)",
                volume: { today: 3890, lastWeek: 3670 },
              },
              {
                name: "01-556 (Шайхонтохур)",
                volume: { today: 3670, lastWeek: 3890 },
              },
              {
                name: "01-222 (Навоий ва Абай)",
                volume: { today: 3431, lastWeek: 2940 },
              },
              {
                name: "03-445 (Чилонзор)",
                volume: { today: 2980, lastWeek: 3150 },
              },
              {
                name: "03-112 (Сергели)",
                volume: { today: 2340, lastWeek: 2560 },
              },
              {
                name: "01-229 (Навоий ва Абай)",
                volume: { today: 120, lastWeek: 590 },
              },
            ].map((item, idx) => (
              <div
                className="flex items-center justify-between gap-3 text-base"
                key={idx}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold text-blue-400">
                    #{idx + 1}
                  </span>
                  <span className="text-lg text-white/90">{item.name}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-lg font-medium">
                      <span>{item.volume.lastWeek}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-lg font-medium">
                      <span>{item.volume.today}</span>
                    </div>
                  </div>
                  <div
                    className={`bg-gradient-to-r p-3 rounded-lg ${
                      item.volume.today - item.volume.lastWeek > 0
                        ? "from-green-500/20 to-green-500/0 text-green-400"
                        : "from-red-500/20 to-red-500/0 text-red-400"
                    }`}
                  >
                    {item.volume.today - item.volume.lastWeek > 0 ? (
                      <FaArrowTrendUp />
                    ) : (
                      <FaArrowTrendDown />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Rating Section */}
        <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-white/10">
          <h3 className="text-lg font-medium text-blue-gray-300 mb-4">
            5 та тирбантлиги юқори чоррахалар
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {[9.1, 9, 8.2, 8, 7].map((rating, idx) => (
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
                          : "#eab30822"
                      }
                      strokeWidth="3"
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
                          : "#eab308"
                      }
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${rating * 10}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`text-3xl font-bold ${
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
      </div>

      {/* Transport Stats */}
      <div className="flex gap-1.5 mt-4">
        <div className="stat-card flex-1 min-w-[110px] p-3">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-green-600 font-bold daily">Kunlik</div>
            </div>
            <div className="text-3xl font-semibold">10.5M</div>
          </div>
        </div>
        <div className="stat-card flex-1 min-w-[110px] p-3">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-yellow-600 font-bold weekly">Haftalik</div>
            </div>
            <div className="text-3xl font-semibold">80.5M</div>
          </div>
        </div>
        <div className="stat-card flex-1 min-w-[110px] p-3">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-brown-600 font-bold monthly">Oylik</div>
            </div>
            <div className="text-3xl font-semibold">100M</div>
          </div>
        </div>
      </div>

      {/* Weather Card */}
      <div className="mt-4 rounded-lg w-full overflow-hidden border border-blue-gray-800/50">
        <WeatherCard t={(key) => key} isSidebarOpen={true} />
      </div>
    </div>
  );

  const rightPanelContent = (
    <div className="p-12 bg-gradient-to-l from-blue-gray-900/70 to-blue-gray-900/10 h-full">
      <h2 className="panel-title">Avtomobil turlari</h2>
      <div className="chart-container">
        <div className="total-vehicles">
          <h3>Jami</h3>
          <div className="count">10 512 654</div>
          <div className="vehicle-icons">
            <FaCarSide />
            <PiVanFill />
            <FaTruck />
          </div>
        </div>

        <div className="vehicle-type-list">
          <div className="vehicle-type-item">
            <div className="type-info">
              <span>Yengil avtomobil</span>
              <span className="count">9 515 210</span>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: "90%" }}></div>
            </div>
            <FaCarSide />
          </div>

          <div className="vehicle-type-item">
            <div className="type-info">
              <span>O'rta vaznli</span>
              <span className="count">60 958</span>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: "15%" }}></div>
            </div>
            <PiVanFill />
          </div>

          <div className="vehicle-type-item">
            <div className="type-info">
              <span>Og'ir vaznli</span>
              <span className="count">10 564</span>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: "5%" }}></div>
            </div>
            <FaTruck />
          </div>
        </div>
      </div>
    </div>
  );

  const topPanelContent = (
    <div className="w-1/2 mx-auto bg-blue-gray-900/80 backdrop-blur-md px-4 py-2 rounded-lg">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        navigation={true}
        modules={[EffectCoverflow, Navigation]}
        className="nav-swiper"
      >
        <SwiperSlide>
          <div className="nav-item">
            <span className="nav-text">Transport Tizimi</span>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="nav-item">
            <span className="nav-text">Monitoring</span>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="nav-item">
            <span className="nav-text">Ob-havo</span>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );

  return (
    <>
      <SlidePanel
        side="left"
        isOpen={isLeftPanelOpen}
        onHandleOpen={setLeftPanelOpen}
        content={leftPanelContent}
      />
      <SlidePanel
        side="right"
        isOpen={isRightPanelOpen}
        onHandleOpen={setRightPanelOpen}
        content={rightPanelContent}
      />
      <SlidePanel
        side="top"
        isOpen={isRightPanelOpen}
        onHandleOpen={setRightPanelOpen}
        content={topPanelContent}
      />
    </>
  );
};

export default TrafficMonitoringPanel;
