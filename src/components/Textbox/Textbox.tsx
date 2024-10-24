/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import "./Textbox.css";
import quotesData from "../../data/quotes.json";
import Results from "../Results/Results";

import { TbRefresh } from "react-icons/tb";

const Textbox = () => {
  const [words, setWords] = useState("");
  const [userInput, setUserInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);
  const [finished, setFinished] = useState(false);
  const [errors, setErrors] = useState(0);

  const [charCount, setCharCount] = useState<number[]>([]);

  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const userInputRef = useRef<string>("");
  const wordsRef = useRef<string>("");

  const prevCharCount = useRef<number>(0);

  const getRandomQuote = () => {
    const quotes = quotesData.quotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex].quote;
  };

  const checkError = (key: string, expected: string) => {
    if (key !== expected) {
      setErrors((prev) => prev + 1);
    }
  };

  const addKey = (key: string) => {
    checkError(key, wordsRef.current[userInputRef.current.length]);
    setUserInput((prev) => prev + key);
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
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    if (isTyping && !finished) {
      timerRef.current = setInterval(() => {
        setCharCount((prev) => [...prev, userInputRef.current.length]);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTyping]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTyping(false);
  };

  useEffect(() => {
    const currentIndex = userInput.length;

    userInputRef.current = userInput;

    if (!isTyping && userInput.length !== 0 && !finished) {
      setIsTyping(true);
    }

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
    setErrors(0);
    setIsTyping(false);
    setFinished(false);
    setCharCount([]);
    userInputRef.current = "";
    prevCharCount.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <div className="container">
      {finished ? (
        <Results
          errors={errors}
          charCount={charCount}
          onPlayAgain={resetGame}
        />
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
                  {char === " " && userInput[index] !== undefined
                    ? userInput[index]
                    : char}
                </span>
              );
            })}

            <span
              ref={cursorRef}
              className="cursor"
              id={isTyping ? "none" : "blinking"}
            />
          </div>
          <button onClick={resetGame}>
            <TbRefresh size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default Textbox;
