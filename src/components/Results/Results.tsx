const Results = ({
  timer,
  onPlayAgain,
}: {
  timer: number;
  onPlayAgain: () => void;
}) => (
  <div className="results-container">
    <h2>Results</h2>
    <p>You finished the quote!</p>
    <p>Time taken: {timer} seconds</p>
    <button onClick={onPlayAgain}>Play Again</button>
  </div>
);

export default Results;
