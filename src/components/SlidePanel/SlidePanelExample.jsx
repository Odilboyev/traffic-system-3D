import "./SlidePanelExample.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import { EffectCoverflow, Navigation } from "swiper/modules";
import { FaCarSide, FaTruck } from "react-icons/fa";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { PiVanFill } from "react-icons/pi";
import SlidePanel from "./SlidePanel";
import WeatherCard from "../../Pages/map/components/sidebar/components/weather/weatherCard";

const TrafficMonitoringPanel = () => {
  const [isLeftPanelOpen, setLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setRightPanelOpen] = useState(true);

  const leftPanelContent = (
    <div className="p-12 bg-gradient-to-r from-blue-900/70 to-blue-gray-900/0 h-full max-w-sm">
      <h2 className="panel-title">Transportlarni xarakat statistikasi</h2>
      <div className="flex flex-wrap gap-1.5 mt-4">
        <div className="stat-card flex-1 min-w-[110px] p-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="time-indicator daily">24h</div>
              <h3 className="text-xs font-medium text-gray-300">Kunlik</h3>
            </div>
            <div className="stat-value text-right">10.5M</div>
          </div>
        </div>
        <div className="stat-card flex-1 min-w-[110px] p-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="time-indicator weekly">7d</div>
              <h3 className="text-xs font-medium text-gray-300">Xaftalik</h3>
            </div>
            <div className="stat-value text-right">80.5M</div>
          </div>
        </div>
        <div className="stat-card flex-1 min-w-[110px] p-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="time-indicator monthly">30d</div>
              <h3 className="text-xs font-medium text-gray-300">Oylik</h3>
            </div>
            <div className="stat-value text-right">100M</div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg overflow-hidden border border-blue-gray-800/50">
        <WeatherCard t={(key) => key} isSidebarOpen={true} />
      </div>
    </div>
  );

  const rightPanelContent = (
    <div className="p-12 bg-gradient-to-l from-blue-900/70 to-blue-gray-900/0 h-full">
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
