export const handleProvinceChange = (province, map) => {
  if (province && map.current) {
    map.current.flyTo(province.coords, 10, {
      duration: 1,
    });
  }
};

export const toggleFullScreen = (setFullscreen) => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    setFullscreen(true);
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }
};

export const getUserRole = () => {
  const role = atob(localStorage.getItem("its_user_role"));
  return {
    role,
    isPermitted: role === "admin" || role === "boss",
  };
};
