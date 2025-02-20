import "./styles.trafficMonitoring.css";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { FaCarSide, FaTruck } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import FullscreenControl from "../../controls/FullscreenControl";
import GeolocateControl from "../../controls/GeolocateControl";
import NavigationControl from "../../controls/NavigationControl";
import { PiVanFill } from "react-icons/pi";
import ScaleControl from "../../controls/ScaleControl";
import SlidePanel from "../../../../components/SlidePanel/SlidePanel";
import WeatherCard from "../sidebar/components/weather/weatherCard";
import ZoomControl from "../../controls/ZoomControl";

const TrafficMonitoringPanel = ({ map }) => {
  const [isLeftPanelOpen, setLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setRightPanelOpen] = useState(true);

  const trafficData = [
    { time: "00:00", volume: 10584 },
    { time: "01:00", volume: 8043 },
    { time: "02:00", volume: 8013 },
    { time: "03:00", volume: 7569 },
    { time: "04:00", volume: 8504 },
    { time: "05:00", volume: 12065 },
    { time: "06:00", volume: 23045 },
    { time: "07:00", volume: 35904 },
    { time: "08:00", volume: 120250 },
    { time: "09:00", volume: 135585 },
    { time: "10:00", volume: 150445 },
    { time: "11:00", volume: 110365 },
    { time: "12:00", volume: 115246 },
    { time: "13:00", volume: 116874 },
    { time: "14:00", volume: 114765 },
    { time: "15:00", volume: 110654 },
    { time: "16:00", volume: 108646 },
    { time: "17:00", volume: 108604 },
    { time: "18:00", volume: 114592 },
  ];

  useEffect(() => {
    if (!map) return;

    const handleZoomEnd = () => {
      const zoom = Math.floor(map.getZoom());
      if (zoom === 12) {
        setLeftPanelOpen(true);
        setRightPanelOpen(true);
      } else {
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
      }
    };

    map.on("zoom", handleZoomEnd);

    // Initial check
    handleZoomEnd();

    return () => {
      map.off("zoom", handleZoomEnd);
    };
  }, [map]);

  const leftPanelContent = (
    <div className="p-4 bg-gradient-to-r from-blue-gray-900/70 to-blue-gray-900/1 h-full max-h-full overflow-y-auto min-w-sm scrollbar-hide">
      <h2 className="panel-title">Transportlarni xarakat statistikasi</h2>

      {/* Traffic Congestion Section */}
      <div className="mt-6 space-y-6">
        <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-white/10">
          <h3 className="text-lg font-medium text-teal-200 mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
            10 та ўтказувчанлиги юқори чоррахалар
          </h3>
          <div className="space-y-2">
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
                    className={`bg-gradient-to-l p-3 rounded-lg ${
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
          <h3 className="text-lg font-medium text-teal-200 mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
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
    </div>
  );

  const rightPanelContent = (
    <div className="p-4 flex flex-col justify-evenly items-end bg-gradient-to-l from-blue-gray-900/70 to-blue-gray-900/10 h-full overflow-y-auto relative">
      <div className="absolute inset-0 bg-gradient-to-l from-blue-500/5 to-transparent"></div>
      {/* Weather Card */}

      <div className="mt-8 w-[20vw] bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-blue-400/30 shadow-[0_0_15px_rgba(96,165,250,0.3)] relative z-10 hover:shadow-[0_0_25px_rgba(96,165,250,0.4)] transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-teal-500/5 rounded-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent rounded-xl"></div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-teal-200 drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]">
            Avtomobil turlari
          </h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 rounded-lg border border-teal-400/30 shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all duration-300">
            <span className="text-sm text-teal-200">Jami:</span>
            <span className="text-teal-300 font-semibold drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]">
              10.5M
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3 border border-teal-400/20 shadow-[0_0_10px_rgba(45,212,191,0.2)] relative overflow-hidden group hover:border-teal-400/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="p-2 bg-teal-500/20 rounded-lg text-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.3)] relative z-10">
              <FaCarSide size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-teal-200 group-hover:text-teal-100 transition-colors duration-300">
                  Yengil avtomobil
                </span>
                <span className="text-sm font-medium text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.7)]">
                  9.5M
                </span>
              </div>
              <div className="h-1.5 bg-black/20 rounded-full overflow-hidden shadow-[0_0_10px_rgba(45,212,191,0.2)]">
                <div
                  className="h-full bg-gradient-to-r from-teal-400/80 via-teal-300/90 to-teal-400/80 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3 border border-teal-400/20 shadow-[0_0_10px_rgba(45,212,191,0.2)] relative overflow-hidden group hover:border-teal-400/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="p-2 bg-teal-500/20 rounded-lg text-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.3)] relative z-10">
              <PiVanFill size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-teal-200 group-hover:text-teal-100 transition-colors duration-300">
                  O'rta vaznli
                </span>
                <span className="text-sm font-medium text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.7)]">
                  60.9K
                </span>
              </div>
              <div className="h-1.5 bg-black/20 rounded-full overflow-hidden shadow-[0_0_10px_rgba(45,212,191,0.2)]">
                <div
                  className="h-full bg-gradient-to-r from-teal-400/80 via-teal-300/90 to-teal-400/80 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3 border border-teal-400/20 shadow-[0_0_10px_rgba(45,212,191,0.2)] relative overflow-hidden group hover:border-teal-400/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="p-2 bg-teal-500/20 rounded-lg text-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.3)] relative z-10">
              <FaTruck size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-teal-200 group-hover:text-teal-100 transition-colors duration-300">
                  Og'ir vaznli
                </span>
                <span className="text-sm font-medium text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.7)]">
                  10.5K
                </span>
              </div>
              <div className="h-1.5 bg-black/20 rounded-full overflow-hidden shadow-[0_0_10px_rgba(45,212,191,0.2)]">
                <div
                  className="h-full bg-gradient-to-r from-teal-400/80 via-teal-300/90 to-teal-400/80 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                  style={{ width: "5%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-lg w-[15vw]  overflow-hidden border border-blue-gray-800/50">
        <WeatherCard t={(key) => key} isSidebarOpen={true} />
      </div>

      {/* Traffic Volume Chart */}
      <div className="mt-8 min-w-[30vw] bg-black/30 text-white rounded-xl p-6 backdrop-blur-sm border border-teal-400/30 shadow-[0_0_15px_rgba(45,212,191,0.3)] relative z-10 hover:shadow-[0_0_25px_rgba(45,212,191,0.4)] transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-teal-500/5 rounded-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent rounded-xl"></div>
        <h3 className="text-lg font-medium text-teal-200 mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
          Транспорт воситаларини кун давомида ўтиш статистикаси
        </h3>
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trafficData}
              margin={{ top: 30, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(45,212,191,0.2)"
              />
              <XAxis
                dataKey="time"
                stroke="#2dd4bf"
                tick={{ fill: "#5eead4", fontSize: 12 }}
              />
              <YAxis
                stroke="#2dd4bf"
                tick={{ fill: "#5eead4", fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return (value / 1000000).toFixed(1) + "M";
                  } else if (value >= 1000) {
                    return (value / 1000).toFixed(1) + "K";
                  }
                  return value;
                }}
              />
              <Tooltip
                cursor={{ fill: "rgba(45,212,191,0.15)" }}
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(96,165,250,0.3)",
                  borderRadius: "8px",
                  color: "#bfdbfe",
                  boxShadow: "0 0 15px rgba(96,165,250,0.2)",
                }}
              />
              <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="volume"
                  position="top"
                  fill="#f0fdfa"
                  formatter={(value) => {
                    if (value >= 1000000) {
                      return (value / 1000000).toFixed(1) + "M";
                    } else if (value >= 1000) {
                      return (value / 1000).toFixed(1) + "K";
                    }
                    return value;
                  }}
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    textShadow:
                      "0 0 8px rgba(0,0,0,0.8), 0 0 12px rgba(45,212,191,0.9)",
                  }}
                  offset={10}
                />
                {trafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                ))}
              </Bar>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                  <stop offset="50%" stopColor="#0d9488" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const topPanelContent = (
    <div className="w-full flex justify-between items-center mx-auto bg-blue-gray-900/80 backdrop-blur-md px-4 h-16">
      <div className="flex gap-3">
        <div className="nav-item">
          <span className="nav-text">Tashkent</span>
        </div>
        <div className="nav-item">
          <span className="nav-text">Tashkent</span>
        </div>
        <div className="nav-item">
          <span className="nav-text">Tashkent</span>
        </div>
      </div>
      <div className="nav-item">
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
        isOpen={true}
        onHandleOpen={setRightPanelOpen}
        content={topPanelContent}
      />
    </>
  );
};

export default TrafficMonitoringPanel;
