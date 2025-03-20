// Import all required Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

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
      second: "2-digit",
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
    <div className="relative mx-auto h-14 w-[90%]">
      {/* Main container with modern glassmorphism */}
      <div className="h-full flex items-center justify-between relative">
        {/* BLOCK 1: Location, Date, Time with neon green style */}
        <div className="h-full flex items-center gap-5 bg-gradient-to-b from-black/90 via-black/80 to-black/70 backdrop-blur-sm relative border-t border-b border-l border-green-400/30 pl-3 pr-12">
          {/* Triangle shape for left edge */}
          <div className="absolute left-0 top-0 h-full w-8 ">
            <div className="absolute top-0 -left-full border-t border-green-400/30 border-b border-green-400/30 w-16 h-full bg-gradient-to-b from-black/90 via-black/80 to-black/70 origin-top-left skew-x-20 translate-x-8"></div>
          </div>
          {/* Location */}
          <div className="group relative cursor-pointer flex items-center gap-2">
            <div className="text-green-400 text-sm">
              <FaMap size={14} className="inline mr-1" />
              <span className="font-medium uppercase tracking-wider">
                ТАШКЕНТ
              </span>
            </div>
          </div>

          {/* Date */}
          <div className="group relative cursor-pointer flex items-center gap-2">
            <div className="text-green-400 text-sm">
              <FaCalendarAlt size={14} className="inline mr-1" />
              <span className="font-medium uppercase tracking-wider">
                {formatDate()}
              </span>
            </div>
          </div>

          {/* Time */}
          <div className="group relative cursor-pointer flex items-center gap-2">
            <div className="text-green-400 text-sm">
              <FaClock size={14} className="inline mr-1" />
              <span className="font-medium uppercase tracking-wider">
                {formatTime()}
              </span>
            </div>
          </div>

          {/* Triangle shape for right edge */}
          <div className="absolute right-0 top-0 h-full w-8 ">
            <div className="absolute top-0 -right-full border-t border-green-400/30 border-b border-green-400/30 w-16 h-full bg-gradient-to-b from-black/90 via-black/80 to-black/70 origin-top-left skew-x-20  translate-x-8"></div>
          </div>
        </div>

        {/* BLOCK 2: Center Navigation Swiper */}
        <div className="h-full w-[40%] absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-black/90 via-black/80 to-black/70 backdrop-blur-sm border-t border-b border-green-400/30 relative">
          {/* Left triangle */}
          <div className="absolute left-0 top-0 h-full w-8 ">
            <div className="absolute top-0 -left-full border-t border-green-400/30 border-b border-green-400/30 w-16 h-full bg-gradient-to-b from-black/90 via-black/80 to-black/70 origin-top-right skew-x-20 -translate-x-8"></div>
          </div>

          {/* Enhanced Swiper container */}
          <div className="relative w-full px-8">
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={3}
              coverflowEffect={{
                rotate: 10,
                stretch: 0,
                depth: 100,
                modifier: 1.5,
                slideShadows: true,
              }}
              speed={600}
              initialSlide={initialSlideIndex}
              navigation={true}
              modules={[EffectCoverflow, Navigation]}
              className={`nav-swiper ${
                swiperLoaded ? "swiper-loaded" : "swiper-loading"
              }`}
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
                      className={`text-sm uppercase tracking-wider font-medium ${
                        index === activeSlideIndex
                          ? "text-green-400"
                          : "text-green-400/70 group-hover:text-green-400"
                      } transition-all duration-300`}
                    >
                      {module.name}
                    </span>
                    {/* Active indicator */}
                    {index === activeSlideIndex && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-green-400/70 to-transparent" />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right triangle */}
          <div className="absolute right-0 top-0 h-full w-8 ">
            <div className="absolute top-0 -right-full border-t border-green-400/30 border-b border-green-400/30 w-16 h-full bg-gradient-to-b from-black/90 via-black/80 to-black/70 origin-top-left -skew-x-20 translate-x-8"></div>
          </div>
        </div>

        {/* BLOCK 3: Control buttons */}
        <div className="h-full flex items-center gap-4 bg-gradient-to-b from-black/90 via-black/80 to-black/70 backdrop-blur-sm border-t border-b border-r border-green-400/30 pl-12 pr-3 ml-auto relative">
          {/* Left triangle shape */}
          <div className="absolute left-0 top-0 h-full w-8 ">
            <div className="absolute top-0 -left-full border-t border-green-400/30 border-b border-green-400/30 w-16 h-full bg-gradient-to-b from-black/90 via-black/80 to-black/70 origin-top-right -skew-x-20 -translate-x-8"></div>
          </div>

          {/* Search button */}
          <div className="group relative cursor-pointer py-1 px-2 bg-black/40 rounded border border-green-400/20 hover:border-green-400/50 transition-all duration-300">
            <div className="flex items-center gap-2">
              <FaSearch size={16} className="text-green-400" />
              <span className="text-xs uppercase tracking-wider text-green-400/80 group-hover:text-green-400 transition-all duration-300">
                Поиск
              </span>
            </div>
          </div>

          {/* Filter button */}
          <div className="group relative cursor-pointer py-1 px-2 bg-black/40 rounded border border-green-400/20 hover:border-green-400/50 transition-all duration-300">
            <div className="flex items-center gap-2">
              <FaFilter size={16} className="text-green-400" />
              <span className="text-xs uppercase tracking-wider text-green-400/80 group-hover:text-green-400 transition-all duration-300">
                Фильтр
              </span>
            </div>
          </div>
          {/* Left triangle shape */}
          <div className="absolute right-0 top-0 h-full w-8 -z-10">
            <div className="absolute top-0 -right-full border-t border-green-400/30 border-b border-green-400/30 w-16 h-full bg-gradient-to-b from-black/90 via-black/80 to-black/70 origin-top-right -skew-x-20 -translate-x-8"></div>
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
  );
};

export default TopPanelContent;
