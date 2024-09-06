import React, { useEffect, useRef } from "react";

const RoadDrawing = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const roadData = {
      roads: [
        {
          name: "North Road",
          direction: "vertical",
          lanesPerDirection: 2,
          laneWidth: 12,
          start: { x: 300, y: 0 },
          end: { x: 300, y: 300 },
        },
        {
          name: "South Road",
          direction: "vertical",
          lanesPerDirection: 4,
          laneWidth: 12,
          start: { x: 300, y: 600 },
          end: { x: 300, y: 300 },
        },
        {
          name: "East Road",
          direction: "horizontal",
          lanesPerDirection: 4,
          laneWidth: 12,
          start: { x: 600, y: 300 },
          end: { x: 300, y: 300 },
        },
        {
          name: "West Road",
          direction: "horizontal",
          lanesPerDirection: 3,
          laneWidth: 12,
          start: { x: 0, y: 300 },
          end: { x: 300, y: 300 },
        },
      ],
      crosswalks: [
        { start: { x: 275, y: 275 }, end: { x: 275, y: 325 } },
        { start: { x: 325, y: 275 }, end: { x: 325, y: 325 } },
        { start: { x: 275, y: 275 }, end: { x: 325, y: 275 } },
        { start: { x: 275, y: 325 }, end: { x: 325, y: 325 } },
      ],
      trafficLights: [
        { x: 290, y: 270 }, // North
        { x: 290, y: 330 }, // South
        { x: 330, y: 290 }, // East
        { x: 270, y: 290 }, // West
      ],
    };

    const drawRoad = (data) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      data.roads.forEach((road) => {
        const laneWidth = road.laneWidth;
        const lanesPerDirection = road.lanesPerDirection;
        const roadWidth = lanesPerDirection * laneWidth * 2;
        const halfRoadWidth = roadWidth / 2;

        // Draw road texture (asphalt look)
        ctx.fillStyle = "#333"; // Asphalt color
        if (road.direction === "vertical") {
          ctx.fillRect(
            road.start.x - halfRoadWidth,
            road.start.y,
            roadWidth,
            road.end.y - road.start.y
          );
        } else {
          ctx.fillRect(
            road.start.x,
            road.start.y - halfRoadWidth,
            road.end.x - road.start.x,
            roadWidth
          );
        }

        // Draw road lanes
        for (let i = 0; i < lanesPerDirection; i++) {
          const offset = i * laneWidth * 2 + laneWidth;

          // Lane dividers (dashed lines)
          ctx.setLineDash([15, 10]);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#fff"; // White for dashed lane dividers
          if (road.direction === "vertical") {
            ctx.beginPath();
            ctx.moveTo(road.start.x - halfRoadWidth + offset, road.start.y);
            ctx.lineTo(road.end.x - halfRoadWidth + offset, road.end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(road.start.x + halfRoadWidth - offset, road.start.y);
            ctx.lineTo(road.end.x + halfRoadWidth - offset, road.end.y);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(road.start.x, road.start.y - halfRoadWidth + offset);
            ctx.lineTo(road.end.x, road.end.y - halfRoadWidth + offset);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(road.start.x, road.start.y + halfRoadWidth - offset);
            ctx.lineTo(road.end.x, road.end.y + halfRoadWidth - offset);
            ctx.stroke();
          }
        }

        // Draw stop lines (at the intersection)
        ctx.setLineDash([]);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#f00"; // Red stop line

        if (road.direction === "vertical") {
          ctx.beginPath();
          ctx.moveTo(road.end.x - halfRoadWidth, road.end.y - 10);
          ctx.lineTo(road.end.x + halfRoadWidth, road.end.y - 10);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(road.end.x - 10, road.end.y - halfRoadWidth);
          ctx.lineTo(road.end.x - 10, road.end.y + halfRoadWidth);
          ctx.stroke();
        }
      });

      // Draw crosswalks (realistic zebra)
      data.crosswalks.forEach((crosswalk) => {
        ctx.fillStyle = "#fff"; // White for crosswalk stripes
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(
            crosswalk.start.x - i * 10,
            crosswalk.start.y,
            5,
            crosswalk.end.y - crosswalk.start.y
          );
        }
      });

      // Draw traffic lights
      data.trafficLights.forEach((light) => {
        drawTrafficLight(ctx, light.x, light.y);
      });
    };

    const drawTrafficLight = (ctx, x, y) => {
      ctx.fillStyle = "#000"; // Black for traffic light frame
      ctx.fillRect(x - 10, y - 20, 20, 60);

      // Draw light circles
      ctx.beginPath();
      ctx.arc(x, y - 10, 7, 0, 2 * Math.PI);
      ctx.fillStyle = "red"; // Red light
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y + 10, 7, 0, 2 * Math.PI);
      ctx.fillStyle = "green"; // Green light
      ctx.fill();
    };

    drawRoad(roadData);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200 p-4">
      <div className="border-2 border-gray-400 p-4 bg-white shadow-lg">
        <canvas ref={canvasRef} width={600} height={600} />
      </div>
    </div>
  );
};

export default RoadDrawing;
