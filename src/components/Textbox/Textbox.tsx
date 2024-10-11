import { useEffect, useState } from "react";
import "./Textbox.css";
import quotesData from "../../data/quotes.json";

const Textbox = () => {
  const [words, setWords] = useState("");

  const getQuote = () => {
    const quotes = quotesData.quotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex].quote;
  };

  useEffect(() => {
    setWords(getQuote());
  }, []);
  return (
    <div>
      <p>{words}</p>
      <button onClick={() => setWords(getQuote())}>Change Quote</button>
    </div>
  );
};

export default Textbox;
