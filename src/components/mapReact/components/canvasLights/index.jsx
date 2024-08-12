import React, { useEffect, useRef, useState } from "react";

const RoadCanvas = () => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const roadData = {
      lanes: [
        // Example lane data
        {
          x: 50,
          y: 100,
          width: 600,
          height: 50,
          direction: "right",
          arrows: [
            "straight",
            "straight",
            "straight",
            "straight",
            "straight",
            "left-turn",
          ],
        },
        {
          x: 650,
          y: 100,
          width: 600,
          height: 50,
          direction: "left",
          arrows: [
            "straight",
            "straight",
            "straight",
            "straight",
            "straight",
            "right-turn",
          ],
        },
        {
          x: 250,
          y: 650,
          width: 50,
          height: 600,
          direction: "up",
          arrows: ["straight", "left-turn", "right-turn"],
        },
        {
          x: 300,
          y: 650,
          width: 50,
          height: 600,
          direction: "down",
          arrows: ["straight", "left-turn", "right-turn"],
        },
      ],
      arrows: [
        { x: 100, y: 110, type: "straight" },
        { x: 200, y: 110, type: "straight" },
        { x: 300, y: 110, type: "straight" },
        { x: 400, y: 110, type: "straight" },
        { x: 500, y: 110, type: "left-turn" },
        { x: 700, y: 110, type: "right-turn" },
      ],
      laneNumbers: [
        { x: 150, y: 75, number: 8 },
        { x: 250, y: 75, number: 9 },
        { x: 350, y: 75, number: 10 },
        { x: 450, y: 75, number: 11 },
        { x: 550, y: 75, number: 12 },
      ],
      signals: [
        { x: 600, y: 100, color: "red" },
        { x: 650, y: 100, color: "green" },
        { x: 500, y: 650, color: "red" },
        { x: 550, y: 650, color: "green" },
      ],
      crosswalks: [
        { start: { x: 225, y: 275 }, end: { x: 275, y: 275 }, color: "white" },
        { start: { x: 325, y: 275 }, end: { x: 375, y: 275 }, color: "white" },
        { start: { x: 425, y: 275 }, end: { x: 475, y: 275 }, color: "white" },
        { start: { x: 525, y: 275 }, end: { x: 575, y: 275 }, color: "white" },
      ],
      laneDividers: [
        { start: { x: 100, y: 100 }, end: { x: 600, y: 150 }, dashed: true },
        { start: { x: 100, y: 150 }, end: { x: 600, y: 150 }, dashed: true },
        { start: { x: 100, y: 200 }, end: { x: 600, y: 150 }, dashed: true },
      ],
    };

    const drawRoad = (data) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(
        currentOffset.x + dragOffset.x,
        currentOffset.y + dragOffset.y
      );
      ctx.scale(scale, scale);

      // Draw roads and lanes
      data.lanes.forEach((lane) => {
        ctx.fillStyle = "gray";
        ctx.fillRect(lane.x, lane.y, lane.width, lane.height);

        // Draw lane dividers and lane markings
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        if (lane.direction === "right" || lane.direction === "left") {
          ctx.moveTo(lane.x, lane.y + lane.height / 2);
          ctx.lineTo(lane.x + lane.width, lane.y + lane.height / 2);
        } else {
          ctx.moveTo(lane.x + lane.width / 2, lane.y);
          ctx.lineTo(lane.x + lane.width / 2, lane.y + lane.height);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw arrows
      data.arrows.forEach((arrow) => {
        drawArrow(ctx, arrow.x, arrow.y, arrow.type);
      });

      // Draw lane numbers
      data.laneNumbers.forEach((laneNumber) => {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(laneNumber.number, laneNumber.x, laneNumber.y);
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

      // Draw lane dividers
      data.laneDividers.forEach((divider) => {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.setLineDash(divider.dashed ? [5, 5] : []);
        ctx.beginPath();
        ctx.moveTo(divider.start.x, divider.start.y);
        ctx.lineTo(divider.end.x, divider.end.y);
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
  }, [scale, dragOffset, currentOffset]);
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

export default RoadCanvas;
