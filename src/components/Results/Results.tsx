import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

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
        xAxis={[{ data: wpm.map((_, index) => index) }]}
        yAxis={[{ min: 0 }]}
        series={[
          {
            curve: "natural",
            data: wpm,
          },
        ]}
        width={600}
        height={400}
      />
      <p>Time taken: {timer} seconds</p>
      <button onClick={onPlayAgain}>Play Again</button>
    </div>
  );
};
export default Results;
