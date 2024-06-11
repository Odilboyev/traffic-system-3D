const SIDEBAR_WIDTH_KEY = "sidebarWidth";
const SIDEBAR_OPEN_KEY = "sidebarOpen";

const [sidebarOpen, setSidebarOpen] = useState(
localStorage.getItem(SIDEBAR_OPEN_KEY)
? JSON.parse(localStorage.getItem(SIDEBAR_OPEN_KEY))
: false
);
const [isResizing, setIsResizing] = useState(false);
const [initialX, setInitialX] = useState(0);
const [initialWidth, setInitialWidth] = useState(
localStorage.getItem(SIDEBAR_WIDTH_KEY)
? JSON.parse(localStorage.getItem(SIDEBAR_WIDTH_KEY))
: 0
);
const sidebarRef = useRef(null);

useEffect(() => {
const handleMouseMove = (e) => {
if (!isResizing) return;
const dx = e.clientX - initialX;
const newWidth = initialWidth + dx;
sidebarRef.current.style.width = `${newWidth}px`;
setSidebarOpen(newWidth > 0);
localStorage.setItem(SIDEBAR_WIDTH_KEY, JSON.stringify(newWidth));
};

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

}, [isResizing, initialX, initialWidth]);

const handleMouseDown = (e) => {
if (e.target.classList.contains("resize-handle")) {
setIsResizing(true);
setInitialX(e.clientX);
setInitialWidth(sidebarRef.current.offsetWidth);
}
};

useEffect(() => {
sidebarRef.current.style.width = `${initialWidth}px`;
}, [initialWidth]);
const handleSidebar = () => {
setSidebarOpen((prevstate) => {
localStorage.setItem(SIDEBAR_OPEN_KEY, JSON.stringify(prevstate));

      if (prevstate) {
        sidebarRef.current.style.width = `${initialWidth}px`;
      } else sidebarRef.current.style.width = `0`;
      return !prevstate;
    });

};
return (
<div>
<div className="flex">
<ToastContainer />
<div
ref={sidebarRef}
onMouseDown={handleMouseDown}
className={`${
            sidebarOpen ? `w-[${initialWidth}px] py-2 pr-2` : "w-0"
          } bg-gray-100 max-h-screen overflow-auto  relative`} >
<div className="w-full h-full">
<CurrentAlarms isSidebar={sidebarOpen} data={data} />
</div>
<div className="resize-handle absolute top-0 right-0 h-full w-1 cursor-ew-resize bg-gray-300 hover:bg-gray-400" />
</div>
<div className={`${sidebarOpen ? "w-[70vw]" : "w-[100vw]"}`}>
<MonitoringMapReact
            isSidebarOpen={sidebarOpen}
            alarmCount={data?.length}
            handleSidebar={handleSidebar}
            changedMarker={changedMarker}
          />
</div>
</div>
</div>
);
};
