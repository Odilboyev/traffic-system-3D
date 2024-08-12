import React, { useEffect, useRef, useState } from "react";
import roadData from "./sample.json";
const CrossroadCanvas = () => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawRoad = (data) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(
        currentOffset.x + dragOffset.x,
        currentOffset.y + dragOffset.y
      );
      ctx.scale(scale, scale);

      // Draw lanes
      data.lanes.forEach((lane) => {
        ctx.fillStyle = "gray";
        ctx.fillRect(lane.x, lane.y, lane.width, lane.height);

        // Draw arrows
        lane.arrows.forEach((arrow, index) => {
          drawArrow(ctx, lane.x + index * 20, lane.y + lane.height / 2, arrow);
        });

        // Draw traffic light
        ctx.fillStyle = lane.trafficLight;
        ctx.beginPath();
        ctx.arc(
          lane.x + lane.width - 20,
          lane.y + lane.height / 2,
          10,
          0,
          2 * Math.PI
        );
        ctx.fill();
      });

      // Draw signals
      data.signals.forEach((signal) => {
        ctx.fillStyle = signal.color;
        ctx.beginPath();
        ctx.arc(signal.x, signal.y, 10, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Draw crosswalks
      data.crosswalks.forEach((crosswalk) => {
        ctx.lineWidth = 2;
        ctx.strokeStyle = crosswalk.color;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(crosswalk.start.x, crosswalk.start.y);
        ctx.lineTo(crosswalk.end.x, crosswalk.end.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      ctx.restore();
    };

    const drawArrow = (ctx, x, y, type) => {
      ctx.fillStyle = "white";
      ctx.beginPath();
      if (type === "left-turn") {
        ctx.moveTo(x, y);
        ctx.lineTo(x - 10, y - 10);
        ctx.lineTo(x - 10, y + 10);
      } else if (type === "right-turn") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y - 10);
        ctx.lineTo(x + 10, y + 10);
      } else if (type === "straight") {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 15);
      }
      ctx.closePath();
      ctx.fill();
    };

    // Initial draw
    drawRoad(roadData);

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = 1.1;
      const scaleMultiplier = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
      setScale((prevScale) =>
        Math.max(0.5, Math.min(prevScale * scaleMultiplier, 5))
      );
    };

    const handleMouseDown = (e) => {
      setDragStart({
        x: e.clientX - currentOffset.x,
        y: e.clientY - currentOffset.y,
      });
    };

    const handleMouseMove = (e) => {
      if (dragStart) {
        const newOffset = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        };
        setDragOffset(newOffset);
      }
    };

    const handleMouseUp = () => {
      if (dragStart) {
        setCurrentOffset((prevOffset) => ({
          x: prevOffset.x + dragOffset.x,
          y: prevOffset.y + dragOffset.y,
        }));
        setDragStart(null);
        setDragOffset({ x: 0, y: 0 });
      }
    };

    canvas.addEventListener("wheel", handleWheel);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseUp);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseout", handleMouseUp);
    };
  }, [scale, dragOffset, currentOffset, roadData]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      style={{
        border: "1px solid black",
        cursor: dragStart ? "grabbing" : "grab",
      }}
    />
  );
};

export default CrossroadCanvas;
