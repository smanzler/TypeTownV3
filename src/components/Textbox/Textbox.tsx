/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import "./Textbox.css";
import quotesData from "../../data/quotes.json";

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

const Textbox = () => {
  const [words, setWords] = useState("");
  const [userInput, setUserInput] = useState("");

  const [timer, setTimer] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [finished, setFinished] = useState(false);

  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomQuote = () => {
    const quotes = quotesData.quotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex].quote;
  };

  const addKey = (key: string) => {
    setUserInput((prev) => {
      if (!isTyping) {
        setIsTyping(true);
      }
      return prev + key;
    });
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key, ctrlKey } = event;

    if (key === " " || key === "Spacebar") {
      event.preventDefault();
      addKey(key);
    } else if (ctrlKey && key === "Backspace") {
      setUserInput((prev) => {
        const trimmed = prev.trimEnd();
        const updated = trimmed.split(" ").slice(0, -1).join(" ");
        return updated.length > 0 ? updated + " " : updated;
      });
    } else if (key.length === 1) {
      addKey(key);
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
    if (isTyping) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTyping]);

  const stopTimer = () => {
    console.log("stop");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTyping(false);
  };

  useEffect(() => {
    const currentIndex = userInput.length;

    if (userInput.length === words.length && words.length !== 0) {
      setFinished(true);
      stopTimer();
      return;
    }

    if (!cursorRef.current || !textContainerRef.current) return;

    const containerRect = textContainerRef.current.getBoundingClientRect();

    const updateCursorPosition = (left: number, top: number) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${left - 1}px`;
        cursorRef.current.style.top = `${top + 4}px`;
      }
    };

    const targetSpan =
      textRefs.current[currentIndex] || textRefs.current[currentIndex - 1];

    if (targetSpan) {
      const rect = targetSpan.getBoundingClientRect();

      const cursorLeft = rect.left - containerRect.left;
      const cursorTop = rect.top - containerRect.top;

      if (
        currentIndex > 0 &&
        targetSpan === textRefs.current[currentIndex - 1]
      ) {
        updateCursorPosition(cursorLeft + rect.width, cursorTop);
      } else {
        updateCursorPosition(cursorLeft, cursorTop);
      }
    }
  }, [userInput]);

  const resetGame = () => {
    setWords(getRandomQuote());
    setUserInput("");
    setTimer(0);
    setIsTyping(false);
    setFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="container">
      {finished ? (
        <Results timer={timer} onPlayAgain={resetGame} />
      ) : (
        <>
          <div className="text-container" ref={textContainerRef}>
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
                <span
                  key={index}
                  style={style}
                  ref={(el) => (textRefs.current[index] = el)}
                >
                  {char}
                </span>
              );
            })}

            <span ref={cursorRef} className="cursor" />
          </div>
          <div className="button-container">
            <button
              onClick={() => {
                setWords(getRandomQuote());
                setUserInput("");
                setTimer(0);
                setIsTyping(false);
              }}
            >
              Change Quote
            </button>
            <button onClick={() => setUserInput("")}>Clear</button>
          </div>
          <div>Time Elapsed: {timer} seconds</div>
        </>
      )}
    </div>
  );
};

export default Textbox;
