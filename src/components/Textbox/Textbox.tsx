import { useEffect, useRef, useState } from "react";
import "./Textbox.css";
import quotesData from "../../data/quotes.json";

const Textbox = () => {
  const [words, setWords] = useState("");
  const [userInput, setUserInput] = useState("");

  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

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
    const currentIndex = userInput.length;

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

  return (
    <div className="container">
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
