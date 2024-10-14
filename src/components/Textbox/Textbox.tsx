import { useEffect, useState } from "react";
import "./Textbox.css";
import quotesData from "../../data/quotes.json";

const Textbox = () => {
  const [words, setWords] = useState("");
  const [userInput, setUserInput] = useState("");

  const getRandomQuote = () => {
    const quotes = quotesData.quotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex].quote;
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key, ctrlKey } = event;

    if (key === " " || key === "Spacebar") {
      event.preventDefault();
      setUserInput((prev) => prev + " ");
    } else if (ctrlKey && key === "Backspace") {
      setUserInput((prev) => {
        const trimmed = prev.trimEnd();
        const updated = trimmed.split(" ").slice(0, -1).join(" ");
        return updated.length > 0 ? updated + " " : updated;
      });
    } else if (key.length === 1) {
      setUserInput((prev) => prev + key);
    } else if (key === "Backspace") {
      setUserInput((prev) => prev.slice(0, -1));
    } else if (key === "Enter") {
      console.log(key);
    }
  };

  useEffect(() => {
    setWords(getRandomQuote());
    setUserInput("");

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    console.log(userInput);
  }, [userInput]);

  return (
    <div className="container">
      <div className="text-container">
        {words.split("").map((char, index) => {
          let style: React.CSSProperties | undefined = undefined;

          switch (userInput[index]) {
            case undefined:
              style = { color: "grey" };
              break;
            case char:
              style = { color: "white" };
              break;
            default:
              style = { color: "red" };
              break;
          }

          return (
            <span key={index} style={style}>
              {char}
            </span>
          );
        })}

        <span className="cursor" />
      </div>
      <div className="button-container">
        <button
          onClick={() => {
            setWords(getRandomQuote());
            setUserInput("");
          }}
        >
          Change Quote
        </button>
        <button onClick={() => setUserInput("")}>Clear</button>
      </div>
    </div>
  );
};

export default Textbox;
