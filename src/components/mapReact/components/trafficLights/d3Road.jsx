import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CrossroadVisualization = ({ trafficData }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 600;

    // Clear previous SVG elements
    svg.selectAll("*").remove();

    // Set up the SVG canvas dimensions
    svg.attr("width", width).attr("height", height);

    // Draw the crossroad background
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#404040");

    // Draw lanes and arrows based on the traffic data
    trafficData.lanes.forEach((lane) => {
      // Draw lane lines
      svg
        .append("line")
        .attr("x1", lane.x1)
        .attr("y1", lane.y1)
        .attr("x2", lane.x2)
        .attr("y2", lane.y2)
        .attr("stroke", lane.status === "open" ? "green" : "red")
        .attr("stroke-width", lane.width);

      // Draw arrows indicating direction (example)
      if (lane.direction === "straight") {
        svg
          .append("path")
          .attr(
            "d",
            `M${lane.arrowX},${lane.arrowY} L${lane.arrowX + 10},${
              lane.arrowY - 20
            } L${lane.arrowX - 10},${lane.arrowY - 20} Z`
          )
          .attr("fill", lane.status === "open" ? "green" : "red");
      }
      // More drawing logic for other directions (left, right) can be added here
    });

    // Draw pedestrian crossings
    trafficData.pedestrianCrossings.forEach((crossing) => {
      svg
        .append("line")
        .attr("x1", crossing.x1)
        .attr("y1", crossing.y1)
        .attr("x2", crossing.x2)
        .attr("y2", crossing.y2)
        .attr("stroke", crossing.status === "open" ? "green" : "red")
        .attr("stroke-width", 4)
        .attr("stroke-dasharray", "5, 5");
    });

    // Optional: Add more elements like labels, traffic lights, etc.
  }, [trafficData]);

  return <svg ref={svgRef}></svg>;
};

export default CrossroadVisualization;
