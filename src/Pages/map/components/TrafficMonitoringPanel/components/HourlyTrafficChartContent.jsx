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

import React from "react";
import { trafficData } from "../data";

const HourlyTrafficChartContent = ({ forwardedRef }) => {
  return (
    <div
      ref={forwardedRef}
      className="w-[23vw] mt-auto pl-16 ml-auto text-white p-3"
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
      <div className="h-[30vh]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trafficData}
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
                const maxVolume = Math.max(...trafficData.map((d) => d.volume));
                return trafficData.map((entry, index) => {
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
};

export default HourlyTrafficChartContent;
