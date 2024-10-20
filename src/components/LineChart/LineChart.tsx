import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  wpm: number[];
}

const LineChart = ({ wpm }: Props) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();

      const width = 500;
      const height = 300;
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
        .attr("r", 4)
        .attr("fill", "steelblue");

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(wpm.length));

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));
    }
  }, [wpm]);

  return <svg ref={ref} width={500} height={300} />;
};

export default LineChart;
