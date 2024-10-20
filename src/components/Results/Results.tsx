import { useEffect, useState } from "react";

import "./Results.css";
import LineChart from "../LineChart/LineChart";

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
        return Math.round((value * 12) / (index + 1));
      })
    );
  }, [charCount]);

  return (
    <div className="results-container">
      <LineChart wpm={wpm} />
      <p>Time taken: {timer} seconds</p>
      <button onClick={onPlayAgain}>Play Again</button>
    </div>
  );
};
export default Results;
