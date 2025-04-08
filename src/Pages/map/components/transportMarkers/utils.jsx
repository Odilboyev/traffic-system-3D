import { FaBus, FaSubway, FaTram } from "react-icons/fa";

import React from "react";

export const transportTypes = [
  { id: "bus", label: "Bus", Icon: FaBus },
  { id: "metro", label: "Metro", Icon: FaSubway },
  { id: "tram", label: "Tram", Icon: FaTram },
];

export const getTransportIcon = (type, size = "1.5em") => {
  let Icon;
  switch (type?.toLowerCase()) {
    case "bus":
      Icon = FaBus;
      break;
    case "metro":
      Icon = FaSubway;
      break;
    case "tram":
      Icon = FaTram;
      break;
    default:
      Icon = FaBus;
  }
  return <Icon size={size} />;
};
