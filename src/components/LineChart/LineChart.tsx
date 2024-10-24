import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  wpm: number[];
}

const LineChart = ({ wpm }: Props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const width = 900;
  const height = 250;

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      const xScale = d3
        .scaleLinear()
        .domain([0, wpm.length - 1])
        .range([margin.left, width - margin.right]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(wpm) || 0])
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line<number>()
        .x((_, i) => xScale(i))
        .y((d) => yScale(d))
        .curve(d3.curveMonotoneX);

      const xAxisGrid = d3
        .axisBottom(xScale)
        .ticks(wpm.length)
        .tickSize(-height + margin.top + margin.bottom)
        .tickFormat(() => "");

      const yAxisGrid = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat(() => "");

      svg
        .append("g")
        .attr("class", "x grid")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxisGrid)
        .selectAll(".tick:last-of-type line")
        .remove();

      svg
        .append("g")
        .attr("class", "y grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxisGrid);

      const xAxis = d3.axisBottom(xScale).ticks(wpm.length);
      const yAxis = d3.axisLeft(yScale).ticks(5);

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .selectAll("path")
        .attr("stroke", "gray");

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .selectAll("path")
        .attr("stroke", "gray");

      svg
        .append("path")
        .datum(wpm)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

      svg
        .selectAll("circle")
        .data(wpm)
        .enter()
        .append("circle")
        .attr("cx", (_, i) => xScale(i))
        .attr("cy", (d) => yScale(d))
        .attr("r", 3)
        .attr("fill", "steelblue");
    }
  }, [wpm]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default LineChart;
