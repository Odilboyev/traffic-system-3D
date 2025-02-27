import "./styles.trafficMonitoring.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { FaCarSide, FaTruck } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import DevicesStatusPanel from "../DevicesStatusPanel";
import FullscreenControl from "../../controls/FullscreenControl";
import GeolocateControl from "../../controls/GeolocateControl";
import NavigationControl from "../../controls/NavigationControl";
import { PiVanFill } from "react-icons/pi";
import ScaleControl from "../../controls/ScaleControl";
import SlidePanel from "../../../../components/SlidePanel/SlidePanel";
import SpeedStatsWidget from "../SpeedStatsWidget";
import WeatherCard from "../sidebar/components/weather/weatherCard";
import ZoomControl from "../../controls/ZoomControl";
import { getInfoForCards } from "../../../../api/api.handlers";
import { useZoomPanel } from "../../context/ZoomPanelContext";

const TrafficMonitoringPanel = ({ map }) => {
  const [cardsInfoData, setCardsInfoData] = useState([]);
  const [speedStats, setSpeedStats] = useState({
    min: 25,
    avg: 45,
    max: 65,
  });
  const conditionMet = useZoomPanel();

  const [panelHeights, setPanelHeights] = useState({
    speed: 0,
    devices: 0,
    hourlyTraffic: 0,
    crossroads: 0,
    trafficRating: 0,
    trafficVolumeStats: 0,
    transportStats: 0,
  });

  const speedRef = useRef(null);
  const devicesRef = useRef(null);
  const hourlyTrafficRef = useRef(null);
  const crossroadsRef = useRef(null);
  const trafficRatingRef = useRef(null);
  const trafficVolumeStatsRef = useRef(null);
  const transportStatsRef = useRef(null);
  useEffect(() => {
    const updateHeights = () => {
      if (speedRef.current) {
        setPanelHeights((prev) => ({
          ...prev,
          speed: speedRef.current.offsetHeight,
        }));
      }
      if (devicesRef.current) {
        setPanelHeights((prev) => ({
          ...prev,
          devices: devicesRef.current.offsetHeight,
        }));
      }
      if (hourlyTrafficRef.current) {
        setPanelHeights((prev) => ({
          ...prev,
          hourlyTraffic: hourlyTrafficRef.current.offsetHeight,
        }));
      }
      if (crossroadsRef.current) {
        setPanelHeights((prev) => ({
          ...prev,
          crossroads: crossroadsRef.current.offsetHeight,
        }));
      }
      if (trafficRatingRef.current) {
        setPanelHeights((prev) => ({
          ...prev,
          trafficRating: trafficRatingRef.current.offsetHeight,
        }));
      }
      if (trafficVolumeStatsRef.current) {
        setPanelHeights((prev) => ({
          ...prev,
          trafficVolumeStats: trafficVolumeStatsRef.current.offsetHeight,
        }));
      }
      if (transportStatsRef.current) {
        setPanelHeights((prev) => ({
          ...prev,
          transportStats: transportStatsRef.current.offsetHeight,
        }));
      }
    };

    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, [conditionMet]);

  // device stats
  useEffect(() => {
    const fetchCardsInfoData = async () => {
      try {
        const data = await getInfoForCards();
        setCardsInfoData(data);
      } catch (error) {
        console.error("Error fetching cards info data:", error);
      }
    };
    fetchCardsInfoData();
  }, []);

  const gradientClass =
    "from-blue-gray-900/90 via-blue-gray-900/80 via-blue-gray-900/80 via-blue-gray-900/80 via-blue-gray-900/70 via-blue-gray-900/60 via-blue-gray-900/50 via-blue-gray-900/40 via-blue-gray-900/30 via-blue-gray-900/30 via-blue-gray-900/40 to-blue-gray-900/10 to-blue-gray-900/0";
  const TransportStatsCard = (
    <div ref={transportStatsRef} className={`p-3 `}>
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
        <div className=" flex-1 min-w-[4vw] p-3  hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-mdtransition-colors">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-green-400 font-bold daily">Kunlik</div>
            </div>
            <div className="text-2xl font-semibold text-green-300">10.5M</div>
          </div>
        </div>
        <div className=" flex-1 min-w-[4vw] p-3  hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-mdtransition-colors">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-yellow-400 font-bold weekly">Haftalik</div>
            </div>
            <div className="text-2xl font-semibold text-yellow-300">80.5M</div>
          </div>
        </div>
        <div className=" flex-1 min-w-[4vw] p-3  hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-mdtransition-colors">
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
  const TrafficVolumeStatsCard = (
    <div ref={trafficVolumeStatsRef} className={` p-3 `}>
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
        <div className=" flex-1 min-w-[4vw] p-3  hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-mdtransition-colors">
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
        <div className=" flex-1 min-w-[4vw] p-3  hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-mdtransition-colors">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex text-yellow-400 items-center gap-1.5">
              <PiVanFill
                className="drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                size={24}
              />
              <div className="font-bold">O'rta</div>
            </div>
            <div className="text-2xl font-semibold text-yellow-300">60.9K</div>
          </div>
        </div>
        <div className=" flex-1 min-w-[4vw] p-3  hover:border-teal-500/30 hover:bg-teal-500/30 backdrop-blur-mdtransition-colors">
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
  const leftPanelContent = (
    <div className="p-4 bg-gradient-to-r from-blue-gray-900 to-blue-gray-900/50 to-blue-gray-900/20  h-full max-h-full overflow-y-auto max-w-[40vw] scrollbar-hide space-y-4">
      {/* Traffic Congestion Section */}
      <div className="space-y-4">
        <div className=" w-[25vw] rounded-xl p-3 ">
          <h3 className="text-md font-medium text-teal-200 mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
            10 та ўтказувчанлиги юқори чоррахалар
          </h3>
          <div className="space-y-2 max-h-[25vh] overflow-y-scroll scrollbar-hide">
            {data.crossroadsRanking.map((item, idx) => (
              <div
                className="flex items-center justify-between gap-3 text-sm"
                key={idx}
              >
                <div className="flex mr-5 items-center gap-3">
                  <span className="text-sm font-semibold text-blue-400">
                    {idx + 1}.
                  </span>
                  <span className="text-sm text-white/90">{item.name}</span>
                </div>
                <div className="flex  items-center text-right  justify-end gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/70 text-red-200 text-sm font-medium">
                      <span>{item.volume.lastWeek}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/70 text-green-200 text-sm font-medium">
                      <span>{item.volume.today}</span>
                    </div>
                  </div>
                  <div
                    className={`bg-gradient-to-l p-3 rounded-lg ${
                      item.volume.today - item.volume.lastWeek > 0
                        ? "from-green-500/70 to-green-500/50 text-green-400"
                        : "from-red-500/70 to-red-500/50 text-red-400"
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
        <div className="bg-black/30 w-[15vw] rounded-xl p-3 backdrop-blur-sm border border-white/10">
          <h3 className="text-md font-medium text-teal-200 mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
            5 та тирбантлиги юқори чоррахалар
          </h3>
          <div className="grid grid-cols-3 grid-rows-2  gap-y-4 gap-x-0">
            {[9.1, 9, 8.2, 8, 7, 5.4].map((rating, idx) => (
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
                          : "#eab308"
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
      </div>

      {/* Transport Stats */}
      <div className="flex gap-1.5 mt-4">
        <div className=" flex-1 min-w-[4vw] p-3">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-green-600 font-bold daily">Kunlik</div>
            </div>
            <div className="text-xl font-semibold">10.5M</div>
          </div>
        </div>
        <div className=" flex-1 min-w-[4vw] p-3">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-yellow-600 font-bold weekly">Haftalik</div>
            </div>
            <div className="text-xl font-semibold">80.5M</div>
          </div>
        </div>
        <div className=" flex-1 min-w-[4vw] p-3">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="text-red-600 font-bold monthly">Oylik</div>
            </div>
            <div className="text-xl font-semibold">100M</div>
          </div>
        </div>
      </div>

      {/* Traffic Volume Chart */}
      <div className="flex gap-1.5 mt-4">
        <div className=" flex-1 min-w-[4vw] p-3">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex text-green-600 items-center gap-1.5">
              <FaCarSide className="" size={20} />
              <div className=" font-bold">Yengil</div>
            </div>
            <div className="text-xl font-semibold">9.5M</div>
          </div>
        </div>
        <div className=" flex-1 min-w-[4vw] p-3">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex text-yellow-600 items-center gap-1.5">
              <PiVanFill className="" size={20} />
              <div className=" font-bold">O'rta</div>
            </div>
            <div className="text-xl font-semibold">60.9K</div>
          </div>
        </div>
        <div className=" flex-1 min-w-[4vw] p-3">
          <div className="flex items-center flex-col justify-between gap-2">
            <div className="flex text-red-600 items-center gap-1.5">
              <FaTruck className="" size={20} />
              <div className=" font-bold">Og'ir</div>
            </div>
            <div className="text-xl font-semibold">10.5K</div>
          </div>
        </div>
      </div>
    </div>
  );

  const topPanelContent = (
    <div className="relative w-full h-14 backdrop-blur-sm">
      {/* Main container with modern glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/60 to-blue-900/40 backdrop-filter backdrop-blur-md">
        {/* Enhanced top glow effect */}
        <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent shadow-[0_0_20px_0_rgba(34,211,238,0.6)]" />

        {/* Content container with improved spacing */}
        <div className="h-full flex items-center justify-between px-8">
          {/* Left Navigation with enhanced hover effects */}
          <div className="flex items-center gap-8">
            {["Dashboard", "Analytics", "Reports"].map((item, index) => (
              <div key={index} className="group relative cursor-pointer">
                {/* Modernized hover indicator */}
                <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400/0 via-cyan-400/0 to-cyan-400/0 group-hover:via-cyan-400/70 transition-all duration-500 ease-in-out" />
                <div className="flex items-center gap-3 py-1.5 px-2 rounded-md transition-all duration-300 group-hover:bg-cyan-400/10">
                  <div className="h-3 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent group-hover:via-cyan-400/80 transition-all duration-300" />
                  <span className="text-[12px] uppercase tracking-[0.2em] font-medium text-cyan-100/70 group-hover:text-cyan-100 transition-all duration-300">
                    {item}
                  </span>
                </div>
                {/* Bottom glow on hover */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent group-hover:via-cyan-400/30 transition-all duration-500" />
              </div>
            ))}
          </div>

          {/* Center Navigation with enhanced decorative elements */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-0.5 flex flex-col items-center">
            {/* Modernized top decorative elements */}
            <div className="flex gap-2 mb-1">
              <div className="w-[70px] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
              <div className="w-[2px] h-[3px] bg-cyan-400/70 rounded-full shadow-[0_0_8px_0_rgba(34,211,238,0.6)]" />
              <div className="w-[70px] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
            </div>

            {/* Enhanced Swiper container */}
            <div className="relative w-[50vw] bg-gradient-to-r from-transparent via-blue-900/80 to-transparent rounded-md overflow-hidden">
              <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={3}
                coverflowEffect={{
                  rotate: 15,
                  stretch: 0,
                  depth: 100,
                  modifier: 1.5,
                  slideShadows: true,
                }}
                speed={600}
                initialSlide={1}
                navigation={true}
                modules={[EffectCoverflow, Navigation]}
                className="nav-swiper"
              >
                {["Transport Tizimi", "Monitoring", "Ob-havo"].map(
                  (item, index) => (
                    <SwiperSlide key={index}>
                      <div className="group text-center relative py-2 px-6 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent via-cyan-400/15 transition-all duration-500" />
                        <span className="text-[12px] uppercase tracking-[0.2em] font-semibold text-cyan-100/80 group-hover:text-cyan-100 transition-all duration-300">
                          {item}
                        </span>
                        {/* Active indicator */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent via-cyan-400/70 transition-all duration-500" />
                      </div>
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            </div>
          </div>

          {/* Enhanced City Selector */}
          <div className="group relative py-2 px-6 cursor-pointer">
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-400/5 to-transparent group-hover:from-cyan-400/15 transition-all duration-300" />
            <div className="flex items-center gap-3">
              <span className="text-[12px] uppercase tracking-[0.2em] font-medium text-cyan-100/80 group-hover:text-cyan-100 transition-all duration-300">
                Tashkent
              </span>
              <div className="h-3 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent group-hover:via-cyan-400/80 transition-all duration-300" />
            </div>
            {/* Hover glow effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent group-hover:via-cyan-400/30 transition-all duration-500" />
          </div>
        </div>

        {/* Enhanced bottom line with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </div>
    </div>
  );
  // const rightPanelContent = (
  //   <div className="p-4 bg-gradient-to-l from-blue-gray-900/70 to-blue-gray-900/1 h-screen max-h-screen overflow-y-auto max-w-[40vw] scrollbar-hide space-y-4">
  //     <div className=" ml-auto">
  //       <DevicesStatusPanel cardsInfoData={cardsInfoData} />
  //     </div>

  //     {/* Hourly Traffic Volume Chart */}
  //     <div className="max-w-[20vw] mt-auto ml-auto bg-black/50 backdrop-blur-sm text-white p-3 rounded-xl ">
  //       <h3 className="text-lg font-medium text-teal-200 mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
  //         Trafik hajmi
  //       </h3>
  //       <div className=" h-[30vh] ">
  //         <ResponsiveContainer width="100%" height="100%">
  //           <BarChart
  //             data={data.trafficData}
  //             margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
  //             layout="vertical"
  //           >
  //             <CartesianGrid
  //               strokeDasharray="3 3"
  //               stroke="rgba(45,212,191,0.2)"
  //             />
  //             <YAxis
  //               dataKey="time"
  //               type="category"
  //               stroke="#2dd4bf"
  //               tick={{ fill: "#5eead4", fontSize: 12 }}
  //             />
  //             <XAxis
  //               type="number"
  //               stroke="#2dd4bf"
  //               reversed={true}
  //               tick={{ fill: "#5eead4", fontSize: 12 }}
  //               tickFormatter={(value) => {
  //                 if (value >= 1000000) {
  //                   return (value / 1000000).toFixed(1) + "M";
  //                 } else if (value >= 1000) {
  //                   return (value / 1000).toFixed(1) + "K";
  //                 }
  //                 return value;
  //               }}
  //             />
  //             <Tooltip
  //               cursor={{ fill: "rgba(45,212,191,0.15)" }}
  //               contentStyle={{
  //                 backgroundColor: "rgba(0,0,0,0.8)",
  //                 border: "1px solid rgba(96,165,250,0.3)",
  //                 borderRadius: "8px",
  //                 color: "#bfdbfe",
  //                 boxShadow: "0 0 15px rgba(96,165,250,0.2)",
  //               }}
  //             />
  //             <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
  //               <LabelList
  //                 dataKey="volume"
  //                 position="insideLeft"
  //                 fill="#f0fdfa"
  //                 offset={0}
  //                 formatter={(value) => {
  //                   if (value >= 1000000) {
  //                     return (value / 1000000).toFixed(1) + "M";
  //                   } else if (value >= 1000) {
  //                     return (value / 1000).toFixed(1) + "K";
  //                   }
  //                   return value;
  //                 }}
  //                 style={{
  //                   fontSize: "12px",
  //                   paddingLeft: 0,
  //                   marginLeft: 0,
  //                   fontWeight: "600",
  //                   textShadow: "0 0 8px rgba(0,0,0,0.8)",
  //                 }}
  //               />
  //               {(() => {
  //                 const maxVolume = Math.max(
  //                   ...data.trafficData.map((d) => d.volume)
  //                 );
  //                 return data.trafficData.map((entry, index) => {
  //                   const volume = entry.volume;
  //                   const percentage = (volume / maxVolume) * 100;
  //                   let gradientId;

  //                   if (percentage >= 80) {
  //                     gradientId = "highTrafficGradient";
  //                   } else if (percentage >= 75) {
  //                     gradientId = "mediumTrafficGradient";
  //                   } else {
  //                     gradientId = "lowTrafficGradient";
  //                   }

  //                   return (
  //                     <Cell
  //                       key={`cell-${index}`}
  //                       fill={`url(#${gradientId})`}
  //                     />
  //                   );
  //                 });
  //               })()}
  //             </Bar>
  //             <defs>
  //               <linearGradient
  //                 id="highTrafficGradient"
  //                 x1="0"
  //                 y1="0"
  //                 x2="1"
  //                 y2="0"
  //               >
  //                 <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
  //                 <stop offset="50%" stopColor="#dc2626" stopOpacity={0.9} />
  //                 <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.8} />
  //               </linearGradient>
  //               <linearGradient
  //                 id="mediumTrafficGradient"
  //                 x1="0"
  //                 y1="0"
  //                 x2="1"
  //                 y2="0"
  //               >
  //                 <stop offset="0%" stopColor="#ffbf00" stopOpacity={1} />
  //                 <stop offset="50%" stopColor="#ce9a00" stopOpacity={0.9} />
  //                 <stop offset="100%" stopColor="#b87700" stopOpacity={0.8} />
  //               </linearGradient>
  //               <linearGradient
  //                 id="lowTrafficGradient"
  //                 x1="0"
  //                 y1="0"
  //                 x2="1"
  //                 y2="0"
  //               >
  //                 <stop offset="0%" stopColor="#00ff5e" stopOpacity={1} />
  //                 <stop offset="50%" stopColor="#16a34a" stopOpacity={0.9} />
  //                 <stop offset="100%" stopColor="#15803d" stopOpacity={0.8} />
  //               </linearGradient>
  //             </defs>
  //           </BarChart>
  //         </ResponsiveContainer>
  //       </div>
  //     </div>
  //     {/* Speed Stats */}
  //     <div className="flex-1 max-w-[15vw] ml-auto bg-black/30 rounded-xl  backdrop-blur-sm border border-white/10">
  //       <SpeedStatsWidget
  //         minSpeed={speedStats.min}
  //         avgSpeed={speedStats.avg}
  //         maxSpeed={speedStats.max}
  //       />
  //     </div>
  //   </div>
  // );
  const HourlyTrafficChartContent = (
    <div
      ref={hourlyTrafficRef}
      className={`w-[23vw] mt-auto pl-16 ml-auto  text-white p-3`}
    >
      <div className="relative mb-4 flex items-center gap-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-center gap-2">
          <span className="text-teal-500/50">|</span>
          Trafik hajmi
          <span className="text-teal-500/50">|</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      </div>
      <div className=" h-[30vh] ">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.trafficData}
            margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
            layout="vertical"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(45,212,191,0.2)"
            />
            <YAxis
              dataKey="time"
              type="category"
              stroke="#2dd4bf"
              tick={{ fill: "#5eead4", fontSize: 12 }}
            />
            <XAxis
              type="number"
              stroke="#2dd4bf"
              reversed={true}
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
            <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
              <LabelList
                dataKey="volume"
                position="insideLeft"
                fill="#f0fdfa"
                offset={0}
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
                  paddingLeft: 0,
                  marginLeft: 0,
                  fontWeight: "600",
                  textShadow: "0 0 8px rgba(0,0,0,0.8)",
                }}
              />
              {(() => {
                const maxVolume = Math.max(
                  ...data.trafficData.map((d) => d.volume)
                );
                return data.trafficData.map((entry, index) => {
                  const volume = entry.volume;
                  const percentage = (volume / maxVolume) * 100;
                  let gradientId;

                  if (percentage >= 80) {
                    gradientId = "highTrafficGradient";
                  } else if (percentage >= 75) {
                    gradientId = "mediumTrafficGradient";
                  } else {
                    gradientId = "lowTrafficGradient";
                  }

                  return (
                    <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />
                  );
                });
              })()}
            </Bar>
            <defs>
              <linearGradient
                id="highTrafficGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                <stop offset="50%" stopColor="#dc2626" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient
                id="mediumTrafficGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#ffbf00" stopOpacity={1} />
                <stop offset="50%" stopColor="#ce9a00" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#b87700" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient
                id="lowTrafficGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#00ff5e" stopOpacity={1} />
                <stop offset="50%" stopColor="#16a34a" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#15803d" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  const SpeedChartContent = (
    <div ref={speedRef} className={`flex-1 overflow-hidden max-w-[15vw] `}>
      <SpeedStatsWidget
        minSpeed={speedStats.min}
        avgSpeed={speedStats.avg}
        maxSpeed={speedStats.max}
      />
    </div>
  );
  const DevicesStatusPanelWrapper = (
    <div ref={devicesRef} className="max-w-[40vw] mx-auto">
      <DevicesStatusPanel cardsInfoData={cardsInfoData} />
    </div>
  );
  // left side
  const TopCrossroadsContent = (
    <div className={`relative `} ref={crossroadsRef}>
      <div className="w-[25vw] p-4">
        <div className="relative mb-4 flex items-center gap-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
          <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-center gap-2">
            <span className="text-teal-500/50">|</span>
            10 та ўтказувчанлиги юқори чоррахалар
            <span className="text-teal-500/50">|</span>
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        </div>
        <div className="relative">
          <div className="space-y-2 max-h-[25vh] overflow-y-scroll scrollbar-hide">
            {data.crossroadsRanking.map((item, idx) => (
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
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500/20 to-red-500/40 text-red-200 text-sm font-medium border border-red-500/20 group-hover:from-red-500/30 group-hover:to-red-500/50 transition-all">
                      <span>{item.volume.lastWeek}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500/20 to-green-500/40 text-green-200 text-sm font-medium border border-green-500/20 group-hover:from-green-500/30 group-hover:to-green-500/50 transition-all">
                      <span>{item.volume.today}</span>
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
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-gray-900/80 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
  const TrafficRatingContent = (
    <div ref={trafficRatingRef} className={`w-[15vw]  p-3 `}>
      <div className="relative mb-4 flex items-center gap-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-teal-200 relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-center gap-2">
          <span className="text-teal-500/50">|</span>5 та тирбантлиги юқори
          чоррахалар
          <span className="text-teal-500/50">|</span>
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
      </div>
      <div className="grid grid-cols-3 grid-rows-2  gap-y-4 gap-x-0">
        {[9.1, 9, 8.2, 8, 7, 5.4].map((rating, idx) => (
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

  return (
    <>
      {/* <SlidePanel
      
        side="left"
        isOpen={conditionMet}
        
        content={leftPanelContent}
      /> */}

      <SlidePanel
        side="left"
        isOpen={conditionMet}
        positionGap={{
          from: "top",
          value: `calc(64px + 16px)`,
        }}
        content={TopCrossroadsContent}
      />
      <SlidePanel
        side="left"
        isOpen={conditionMet}
        positionGap={{
          from: "top",
          value: `calc(64px + ${panelHeights.crossroads}px + 16px + 16px)`,
        }}
        content={TrafficRatingContent}
      />
      <div className="flex gap-4">
        <SlidePanel
          side="left"
          isOpen={conditionMet}
          positionGap={{
            from: "top",
            value: `calc(64px + ${
              panelHeights.crossroads + panelHeights.trafficRating + 16 + 16
            }px)`,
          }}
          content={TrafficVolumeStatsCard}
        />

        <SlidePanel
          side="left"
          isOpen={conditionMet}
          positionGap={{
            from: "top",
            value: `calc(64px + ${
              panelHeights.crossroads +
              panelHeights.trafficRating +
              panelHeights.trafficVolumeStats +
              16 +
              16 +
              16
            }px)`,
          }}
          content={TransportStatsCard}
        />
      </div>

      {/* <SlidePanel
        side="right"
        isOpen={conditionMet}
        
        content={rightPanelContent}
      /> */}
      <SlidePanel side="top" isOpen={true} content={topPanelContent} />
      {/* right side widgets */}

      <SlidePanel
        side="bottom"
        isOpen={conditionMet}
        content={DevicesStatusPanelWrapper}
      />
      <SlidePanel
        side="right"
        isOpen={conditionMet}
        positionGap={{
          from: "top",
          value: `calc(64px + ${panelHeights.devices + 16 + 16}px)`,
        }}
        content={SpeedChartContent}
      />
      <SlidePanel
        side="right"
        isOpen={conditionMet}
        positionGap={{
          from: "top",
          value: `calc(64px + ${
            panelHeights.speed + panelHeights.devices + 16
          }px)`,
        }}
        content={HourlyTrafficChartContent}
      />
    </>
  );
};

export default TrafficMonitoringPanel;

const data = {
  crossroadsRanking: [
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
  ],
  trafficData: [
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
    { time: "19:00", volume: 11455 },
    { time: "20:00", volume: 1154 },
    { time: "21:00", volume: 253 },
    { time: "22:00", volume: 23 },
    { time: "23:00", volume: 45 },
  ],
};
