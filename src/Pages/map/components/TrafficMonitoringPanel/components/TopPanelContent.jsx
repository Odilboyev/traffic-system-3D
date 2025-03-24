// Import all required Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "../styles.trafficMonitoring.css";

import { EffectCoverflow, Navigation } from "swiper/modules";
// Import React Icons
import {
  FaCalendarAlt,
  FaClock,
  FaFilter,
  FaMap,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";

// Import the module context
import { useModuleContext } from "../../../context/ModuleContext";

const TopPanelContent = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [swiperLoaded, setSwiperLoaded] = useState(false);
  const { activeModule, setActiveModule, modules } = useModuleContext();

  // Find the index of the active module from localStorage or default to monitoring
  const findInitialSlideIndex = () => {
    const monitoringIndex = modules.findIndex(
      (module) => module.id === activeModule.id
    );
    return monitoringIndex >= 0 ? monitoringIndex : 0;
  };

  const initialSlideIndex = findInitialSlideIndex();
  const [activeSlideIndex, setActiveSlideIndex] = useState(initialSlideIndex);

  // Current date and time state
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formatDate = () => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return currentDateTime.toLocaleDateString("ru-RU", options).toUpperCase();
  };

  const formatTime = () => {
    return currentDateTime.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Ensure swiper is updated when component is fully mounted
  useEffect(() => {
    if (swiperInstance) {
      // Force update after a short delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        swiperInstance.update();
        setSwiperLoaded(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [swiperInstance]);

  // Update active module when slide changes
  useEffect(() => {
    setActiveModule(modules[activeSlideIndex]);
  }, [activeSlideIndex, setActiveModule]);

  return (
    <div className="bg-gradient-to-b from-black/60 via-black/40 to-black/5 pt-5">
      <div className="relative mx-auto h-16 px-6 transition-all duration-300">
        {/* Main container with modern glassmorphism */}
        <div className="h-full flex items-center justify-between gap-4">
          {/* BLOCK 1: Location, Date, Time with modern style */}
          <div className="flex items-center gap-6 backdrop-blur-lg relative p-4 shadow-[0_2px_15px_-3px_rgba(2,132,199,0.1)] transition-all duration-300 hover:shadow-[0_4px_20px_-3px_rgba(2,132,199,0.15)] rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 ">
            {/* Location with hover effect */}
            <div className="group relative cursor-pointer flex items-center gap-2 transition-transform duration-200 hover:scale-102">
              <div className="text-sky-500 text-sm flex items-center gap-2.5 transition-colors duration-300 hover:text-sky-400">
                <div className="relative">
                  <FaMap
                    size={16}
                    className="transition-transform duration-300 group-hover:rotate-12 relative z-10"
                  />
                </div>
                <span className="font-medium uppercase tracking-wider text-slate-100 group-hover:text-white ">
                  ТАШКЕНТ
                </span>
              </div>
            </div>

            {/* Date with hover effect */}
            <div className="group relative cursor-pointer flex items-center gap-2 transition-transform duration-200 hover:scale-102">
              <div className="text-sky-500 text-sm flex items-center gap-2.5 transition-colors duration-300 hover:text-sky-400">
                <div className="relative">
                  <FaCalendarAlt
                    size={16}
                    className="transition-transform duration-300 group-hover:rotate-12 relative z-10"
                  />
                </div>
                <span className="font-medium text-slate-100 transition-colors duration-300 hover:text-white ">
                  {formatDate()}
                </span>
              </div>
            </div>

            {/* Time display */}
            <div className="flex items-center gap-2.5">
              <FaClock size={16} className="text-sky-500" />
              <span className="font-medium text-slate-100 font-mono">
                {formatTime()}
              </span>
            </div>
          </div>

          {/* BLOCK 2: Center Navigation Swiper with modern style */}
          <div className="h-full nav-swiper w-[42%] flex items-center backdrop-blur-md relative transition-all duration-300 rounded-full overflow-hidden  bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90">
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-[35%] bg-gradient-to-r from-black via-slate-900/95 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-[35%] bg-gradient-to-l from-black via-slate-900/95 to-transparent pointer-events-none z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
            <div className="relative w-full px-8 flex items-center justify-center min-h-[3rem]">
              <button className="swiper-button-prev ">
                <FaMapMarkerAlt className="text-sky-400/70 text-sm group-hover:text-sky-400 -rotate-90 transition-all duration-300 relative z-10 translate-y-px" />
              </button>
              <button className="swiper-button-next ">
                <FaMapMarkerAlt className="text-sky-400/70 text-sm group-hover:text-sky-400 rotate-90 transition-all duration-300 relative z-10 translate-y-px" />
              </button>
              <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={3}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 0,
                  modifier: 1,
                  slideShadows: false,
                }}
                navigation={{
                  prevEl: ".swiper-button-prev",
                  nextEl: ".swiper-button-next",
                }}
                speed={600}
                initialSlide={initialSlideIndex}
                modules={[EffectCoverflow, Navigation]}
                className={`nav-swiper `}
                onSwiper={(swiper) => {
                  setSwiperInstance(swiper);
                  // Force update after mounting
                  setTimeout(() => {
                    swiper.update();
                    setSwiperLoaded(true);
                  }, 100);
                }}
                onSlideChange={(swiper) => {
                  setActiveSlideIndex(swiper.activeIndex);
                }}
              >
                {modules.map((module, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`group text-center flex flex-col justify-center items-center relative py-2 px-6 cursor-pointer ${
                        index === activeSlideIndex ? "active-slide" : ""
                      }`}
                    >
                      <span
                        className={`text-sm uppercase tracking-wider font-medium tracking-[0.075em] ${
                          index === activeSlideIndex
                            ? "text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.3)]"
                            : "text-slate-500/50 group-hover:text-sky-400/70"
                        } transition-all duration-300`}
                      >
                        {module.name}
                      </span>
                      {/* Active indicator with modern glow */}
                      {index === activeSlideIndex && (
                        <>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                          <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-12 h-1.5 bg-sky-400/20 blur-[10px] rounded-full" />
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-3 bg-sky-400/5 blur-[15px] rounded-full" />
                        </>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* BLOCK 3: Control buttons with modern style */}
          <div className="h-full flex items-center justify-center rounded-2xl gap-4 backdrop-blur-md px-4 relative transition-all duration-300 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80">
            {/* Search button with modern style */}
            <div className="group relative cursor-pointer py-2 px-4 bg-slate-800/90 rounded-xl border border-sky-500/20 hover:border-sky-500/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(2,132,199,0.15)] hover:bg-slate-800/95 hover:-translate-y-0.5">
              <div className="flex items-center gap-2">
                <FaSearch
                  size={16}
                  className="text-sky-400 transition-transform duration-300 group-hover:rotate-12"
                />
                <span className="text-xs uppercase tracking-[0.1em] text-slate-300 group-hover:text-white transition-all duration-300 font-medium">
                  Поиск
                </span>
              </div>
            </div>

            {/* Filter button with modern style */}
            <div className="group relative cursor-pointer py-2 px-4 bg-slate-800/90 rounded-xl border border-sky-500/20 hover:border-sky-500/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(2,132,199,0.15)] hover:bg-slate-800/95 hover:-translate-y-0.5">
              <div className="flex items-center gap-2">
                <FaFilter
                  size={16}
                  className="text-sky-400 transition-transform duration-300 group-hover:rotate-12"
                />
                <span className="text-xs uppercase tracking-[0.1em] text-slate-300 group-hover:text-white transition-all duration-300 font-medium">
                  Фильтр
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Add any additional styles needed for the Swiper */}
        <style jsx>{`
          /* You can add any custom styles here if needed */
          .skew-x-20 {
            transform: skewX(20deg);
          }
          .-skew-x-20 {
            transform: skewX(-20deg);
          }
        `}</style>
      </div>
    </div>
  );
};

export default TopPanelContent;
