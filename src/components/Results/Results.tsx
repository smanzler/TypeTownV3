import { useEffect, useState } from "react";

import "./Results.css";
import LineChart from "../LineChart/LineChart";

const Results = ({
  errors,
  charCount,
  onPlayAgain,
}: {
  errors: number;
  charCount: number[];
  onPlayAgain: () => void;
}) => {
  const [wpm, setWpm] = useState<number[]>([]);

  const wordsLen = charCount[charCount.length - 1];

  const acc = Math.round(((wordsLen - errors) * 100) / wordsLen);

  useEffect(() => {
    console.log(charCount);
    setWpm(
      charCount.map((value, index) => {
        return Math.round((value * 12) / (index + 1));
      })
    );
  }, [charCount]);

  return (
    <div className="results-container">
      <div className="chart-container">
        <div className="stats-container">
          <p>wpm</p>
          <h1>{wpm[wpm.length - 1]}</h1>
          <p>acc</p>
          <h1>{acc}%</h1>
        </div>
        <LineChart wpm={wpm} />
      </div>
      <h1></h1>
      <button onClick={onPlayAgain}>Play Again</button>
    </div>
  );
};
export default Results;
