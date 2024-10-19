import { LineChart } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useEffect, useState } from "react";

import "./Results.css";

const Results = ({
  timer,
  charCount,
  onPlayAgain,
}: {
  timer: number;
  charCount: number[];
  onPlayAgain: () => void;
}) => {
  const [wpm, setWpm] = useState<number[]>([]);

  useEffect(() => {
    setWpm(
      charCount.map((value, index) => {
        return (value * 12) / (index + 1);
      })
    );
  }, [charCount]);

  return (
    <div className="results-container">
      <LineChart
        sx={{
          [`.${axisClasses.root}`]: {
            [`.${axisClasses.tick}, .${axisClasses.line}`]: {
              stroke: "#686c70",
              strokeWidth: 3,
            },
            [`.${axisClasses.tickLabel}`]: {
              fill: "#686c70",
              fontWeight: 800,
            },
          },
        }}
        xAxis={[
          {
            data: wpm.map((_, index) => index),
          },
        ]}
        yAxis={[{ min: 0 }]}
        series={[
          {
            curve: "natural",
            label: "WPM",
            data: wpm,
            color: "#2f90e6",
          },
        ]}
        slotProps={{
          legend: {
            labelStyle: {
              fontSize: 14,
              fill: "white",
            },
          },
        }}
        width={600}
        height={400}
      />
      <p>Time taken: {timer} seconds</p>
      <button onClick={onPlayAgain}>Play Again</button>
    </div>
  );
};
export default Results;
