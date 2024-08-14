import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import trafficData from "./s.json";
const CrossroadVisualization = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 600;

    // Clear previous SVG elements
    svg.selectAll("*").remove();

    // Set up the SVG canvas dimensions
    svg.attr("width", width).attr("height", height);

    // Draw lanes
    trafficData.lanes.forEach((lane) => {
      svg
        .append("line")
        .attr("x1", lane.coordinates.x1)
        .attr("y1", lane.coordinates.y1)
        .attr("x2", lane.coordinates.x2)
        .attr("y2", lane.coordinates.y2)
        .attr("stroke", lane.status === "open" ? "green" : "red")
        .attr("stroke-width", lane.width);
    });

    // Draw arrows
    trafficData.arrows.forEach((arrow) => {
      const arrowColor = arrow.status === "open" ? "green" : "red";
      if (arrow.direction === "straight") {
        svg
          .append("path")
          .attr(
            "d",
            `M${arrow.coordinates.x},${arrow.coordinates.y} L${
              arrow.coordinates.x + 10
            },${arrow.coordinates.y - 20} L${arrow.coordinates.x - 10},${
              arrow.coordinates.y - 20
            } Z`
          )
          .attr("fill", arrowColor);
      } else if (arrow.direction === "right") {
        svg
          .append("path")
          .attr(
            "d",
            `M${arrow.coordinates.x},${arrow.coordinates.y} L${
              arrow.coordinates.x + 10
            },${arrow.coordinates.y} L${arrow.coordinates.x + 5},${
              arrow.coordinates.y - 10
            } Z`
          )
          .attr("fill", arrowColor);
      }
      // More direction cases (left, U-turn) can be added here
    });

    // Draw traffic lights
    trafficData.trafficLights.forEach((light) => {
      svg
        .append("circle")
        .attr("cx", light.coordinates.x)
        .attr("cy", light.coordinates.y)
        .attr("r", 10)
        .attr("fill", light.status === "green" ? "green" : "red");
    });

    // Draw pedestrian crossings
    trafficData.pedestrianCrossings.forEach((crossing) => {
      svg
        .append("line")
        .attr("x1", crossing.coordinates.x1)
        .attr("y1", crossing.coordinates.y1)
        .attr("x2", crossing.coordinates.x2)
        .attr("y2", crossing.coordinates.y2)
        .attr("stroke", crossing.status === "open" ? "green" : "red")
        .attr("stroke-width", 4)
        .attr("stroke-dasharray", "5, 5");
    });

    // Optional: Add more elements like labels, lane numbers, etc.
  }, [trafficData]);

  return <svg ref={svgRef}></svg>;
};

export default CrossroadVisualization;
