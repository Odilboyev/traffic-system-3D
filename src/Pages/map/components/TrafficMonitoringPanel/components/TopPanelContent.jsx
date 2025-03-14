// Import all required Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import { EffectCoverflow, Navigation } from "swiper/modules";
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
    <div className="relative w-full h-14 backdrop-blur-sm">
      {/* Main container with modern glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/60 to-blue-900/40 backdrop-filter backdrop-blur-md">
        {/* Enhanced top glow effect */}
        <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent shadow-[0_0_20px_0_rgba(34,211,238,0.6)]" />

        {/* Content container with improved spacing */}
        <div className="h-full flex items-center justify-between px-8">
          {/* Left Navigation with enhanced hover effects */}
          <div className="flex items-center gap-8">
            {/* {["Dashboard", "Analytics", "Reports"].map((item, index) => (
              <div key={index} className="group relative cursor-pointer">
 
                <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400/0 via-cyan-400/0 to-cyan-400/0 group-hover:via-cyan-400/70 transition-all duration-500 ease-in-out" />
                <div className="flex items-center gap-3 py-1.5 px-2 rounded-md transition-all duration-300 group-hover:bg-cyan-400/10">
                  <div className="h-3 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent group-hover:via-cyan-400/80 transition-all duration-300" />
                  <span className="text-[12px] uppercase tracking-[0.2em] font-medium text-cyan-100/70 group-hover:text-cyan-100 transition-all duration-300">
                    {item}
                  </span>
                </div>
               
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent group-hover:via-cyan-400/30 transition-all duration-500" />
              </div>
            ))} */}
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
                onInit={(swiper) => {
                  // Ensure swiper is properly initialized
                  swiper.update();
                }}
                onSlideChange={(swiper) => {
                  setActiveSlideIndex(swiper.activeIndex);
                }}
              >
                {modules.map((module, index) => (
                  <SwiperSlide key={index}>
                    <div className="group text-center relative py-2 px-6 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent via-cyan-400/15 transition-all duration-500" />
                      <span className="text-[12px] uppercase tracking-[0.2em] font-semibold text-cyan-100/80 group-hover:text-cyan-100 transition-all duration-300">
                        {module.name}
                      </span>
                      {/* Active indicator */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent via-cyan-400/70 transition-all duration-500" />
                    </div>
                  </SwiperSlide>
                ))}
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
};

export default TopPanelContent;
