import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "motion/react";
import { WordData } from "./assets/WordData";
import { nanoid } from "nanoid";
import { Delete, X } from "lucide-react";
import { style } from "motion/react-client";
import Confetti from "react-confetti-boom";

function App() {
  //
  // Tastatur && Spielfeld Data

  const gamestate = [{ round: 1 }];
  const letters = [
    [
      { key: "q", type: "letter", status: null },
      { key: "w", type: "letter", status: null },
      { key: "e", type: "letter", status: null },
      { key: "r", type: "letter", status: null },
      { key: "t", type: "letter", status: null },
      { key: "z", type: "letter", status: null },
      { key: "u", type: "letter", status: null },
      { key: "i", type: "letter", status: null },
      { key: "o", type: "letter", status: null },
      { key: "p", type: "letter", status: null },
    ],
    [
      { key: "a", type: "letter", status: null },
      { key: "s", type: "letter", status: null },
      { key: "d", type: "letter", status: null },
      { key: "f", type: "letter", status: null },
      { key: "g", type: "letter", status: null },
      { key: "h", type: "letter", status: null },
      { key: "j", type: "letter", status: null },
      { key: "k", type: "letter", status: null },
      { key: "l", type: "letter", status: null },
    ],
    [
      { key: "enter", label: "ENTER", type: "action" },
      { key: "y", type: "letter", status: null },
      { key: "x", type: "letter", status: null },
      { key: "c", type: "letter", status: null },
      { key: "v", type: "letter", status: null },
      { key: "b", type: "letter", status: null },
      { key: "n", type: "letter", status: null },
      { key: "m", type: "letter", status: null },
      { key: "backspace", label: "⌫", type: "action" },
    ],
  ];

  const keyboardRowsData = [
    [
      { key: "q", type: "letter", status: null },
      { key: "w", type: "letter", status: null },
      { key: "e", type: "letter", status: null },
      { key: "r", type: "letter", status: null },
      { key: "t", type: "letter", status: null },
      { key: "z", type: "letter", status: null },
      { key: "u", type: "letter", status: null },
      { key: "i", type: "letter", status: null },
      { key: "o", type: "letter", status: null },
      { key: "p", type: "letter", status: null },
    ],
    [
      { key: "a", type: "letter", status: null },
      { key: "s", type: "letter", status: null },
      { key: "d", type: "letter", status: null },
      { key: "f", type: "letter", status: null },
      { key: "g", type: "letter", status: null },
      { key: "h", type: "letter", status: null },
      { key: "j", type: "letter", status: null },
      { key: "k", type: "letter", status: null },
      { key: "l", type: "letter", status: null },
    ],
    [
      { key: "enter", label: "ENTER", type: "action" },
      { key: "y", type: "letter", status: null },
      { key: "x", type: "letter", status: null },
      { key: "c", type: "letter", status: null },
      { key: "v", type: "letter", status: null },
      { key: "b", type: "letter", status: null },
      { key: "n", type: "letter", status: null },
      { key: "m", type: "letter", status: null },
      { key: "backspace", label: "⌫", type: "action" },
    ],
  ];

  const playingRows = [
    [
      { id: 1, letter: null, status: null },
      { id: 2, letter: null, status: null },
      { id: 3, letter: null, status: null },
      { id: 4, letter: null, status: null },
      { id: 5, letter: null, status: null },
    ],
    [
      { id: 6, letter: null, status: null },
      { id: 7, letter: null, status: null },
      { id: 8, letter: null, status: null },
      { id: 9, letter: null, status: null },
      { id: 10, letter: null, status: null },
    ],
    [
      { id: 11, letter: null, status: null },
      { id: 12, letter: null, status: null },
      { id: 13, letter: null, status: null },
      { id: 14, letter: null, status: null },
      { id: 15, letter: null, status: null },
    ],
    [
      { id: 16, letter: null, status: null },
      { id: 17, letter: null, status: null },
      { id: 18, letter: null, status: null },
      { id: 19, letter: null, status: null },
      { id: 20, letter: null, status: null },
    ],
    [
      { id: 21, letter: null, status: null },
      { id: 22, letter: null, status: null },
      { id: 23, letter: null, status: null },
      { id: 24, letter: null, status: null },
      { id: 25, letter: null, status: null },
    ],
    [
      { id: 26, letter: null, status: null },
      { id: 27, letter: null, status: null },
      { id: 28, letter: null, status: null },
      { id: 29, letter: null, status: null },
      { id: 30, letter: null, status: null },
    ],
  ];

  // States

  const [randomWord, setRandomWord] = useState("");
  const [currentCellIndex, setCurrentCellIndex] = useState(0);
  const [rows, setRows] = useState(playingRows);
  const [keyboardrows, setKeyboardRows] = useState(keyboardRowsData);
  const [win, setWin] = useState(false);
  const [loss, setLoss] = useState(false);

  const [round, setRound] = useState(1);

  const [lastKey, setLastKey] = useState("");
  const [word, setWord] = useState([]);

  // Maps

  const keyboard = keyboardrows.map((row) => {
    return (
      <div
        className="flex flex-row gap-2 justify-center w-[95vw]"
        key={nanoid()}
      >
        {row.map((key) => {
          if (key.key === "backspace") {
            return (
              <button
                className={
                  key.key +
                  " flex justify-center items-center text-white sm:w-20 h-14 bg-zinc-500 rounded-md px-2"
                }
                onClick={() => handleKeyboardDelete(lastKey)}
                key={nanoid()}
              >
                <Delete />
              </button>
            );
          } else if (key.key === "enter") {
            return (
              <button
                className={
                  key.key +
                  " text-white sm:w-20 h-14 bg-zinc-500 rounded-md font-bold text-xs sm:text-[16px] px-2"
                }
                onClick={() => handleKeyboardSubmit(key.key)}
                key={nanoid()}
              >
                {key.key}
              </button>
            );
          } else {
            return (
              <button
                className={
                  key.status +
                  " text-white w-full sm:w-14 h-14 bg-zinc-500 rounded-md font-bold"
                }
                onClick={() => handleKeyboard(key.key)}
                key={nanoid()}
              >
                {key.key.toLocaleUpperCase()}
              </button>
            );
          }
        })}
      </div>
    );
  });

  const playingBoard = rows.map((row) => (
    <div className="cell-row" key={nanoid()}>
      {row.map((cell) => (
        <div
          className={
            cell.status +
            " flex justify-center items-center text-white text-xl font-bold w-14 h-14 border-2 border-zinc-800 rounded-md"
          }
          key={cell.id}
          id={cell.id}
        >
          {cell.letter}
        </div>
      ))}
    </div>
  ));

  // Keyboard functionality

  function handleKeyboard(key) {
    if (round === 1 && currentCellIndex === 5) {
      return toast.error("You need to submit first");
    }
    if (round === 2 && currentCellIndex === 10) {
      return toast.error("You need to submit first");
    }
    if (round === 3 && currentCellIndex === 15) {
      return toast.error("You need to submit first");
    }
    if (round === 4 && currentCellIndex === 20) {
      return toast.error("You need to submit first");
    }
    if (round === 5 && currentCellIndex === 25) {
      return toast.error("You need to submit first");
    }
    if (round === 6 && currentCellIndex === 30) {
      return toast.error("You need to submit first");
    }

    setWord((prev) => [...prev, key]);

    const upperKey = key.toLocaleUpperCase();
    setRows((prevRows) => {
      const newRows = prevRows.map((row) => row.map((cell) => ({ ...cell })));
      const flatCells = newRows.flat();
      flatCells[currentCellIndex].letter = upperKey;
      // flatCells[currentCellIndex].status = "active";

      return newRows;
    });

    setCurrentCellIndex((prev) => prev + 1);
  }

  function handleKeyboardDelete(key) {
    if (currentCellIndex === 0) {
      return toast.error("Nothing to delete");
    }
    if (round === 2 && currentCellIndex === 5) {
      return toast.error("Nothing to delete");
    }
    if (round === 3 && currentCellIndex === 10) {
      return toast.error("Nothing to delete");
    }
    if (round === 4 && currentCellIndex === 15) {
      return toast.error("Nothing to delete");
    }
    if (round === 5 && currentCellIndex === 20) {
      return toast.error("Nothing to delete");
    }
    if (round === 6 && currentCellIndex === 25) {
      return toast.error("Nothing to delete");
    }

    setWord((prev) => prev.slice(0, -1));
    setRows((prevRows) => {
      const newRows = prevRows.map((row) => row.map((cell) => ({ ...cell })));
      const flatCells = newRows.flat();
      flatCells[currentCellIndex - 1].letter = null;
      flatCells[currentCellIndex - 1].status = "null";
      return newRows;
    });
    setCurrentCellIndex((prev) => prev - 1);
  }

  function handleKeyboardSubmit() {
    const jointWord = word.join("");
    // wort existiert
    if (!WordData.allowedGuesses.includes(jointWord)) {
      return toast.error("Not in Word List");
    }

    // Buchstabe existiert

    const newRows = rows.map((row, rowIndex) => {
      return row.map((cell, cellIndex) => {
        const cellLetter = cell.letter?.toLowerCase();
        if (!cellLetter) {
          return cell;
        }

        let status = null;

        if (randomWord[cellIndex] === cellLetter) {
          status = "correct";
        } else if (randomWord.includes(cellLetter)) {
          status = "exist";
        } else {
          status = "false";
        }
        return {
          ...cell,
          status: status,
        };
      });
    });

    setRows(newRows);

    setKeyboardRows((prevRows) => {
      return prevRows.map((row, rowIndex) =>
        row.map((key, keyIndex) => {
          // wenn letter aus rows key.key matched und die klasse false oder exist besitzt, übertrage diesen status auf key.status
          //
          //

          const matchingCell = newRows
            .flat()
            .find((cell) => cell?.letter?.toLowerCase() === key.key);
          if (!matchingCell?.status) {
            return key;
          } else if (matchingCell?.status === "active") {
            return key;
          } else if (matchingCell?.status === "correct") {
            return {
              ...key,
              status: "key-correct",
            };
          } else if (matchingCell?.status === "exist") {
            return {
              ...key,
              status: "key-exist",
            };
          } else if (matchingCell?.status === "false") {
            return {
              ...key,
              status: "key-false",
            };
          }
        }),
      );
    });

    setWord([]);
    setRound((prev) => prev + 1);
    // Gewinnlogik
    if (randomWord === jointWord) {
      setWin(true);
      return;
    }
    if (round === 6 && randomWord !== jointWord) {
      setLoss(true);
      return;
    }
  }

  function startNewGame() {
    getWords(setRandomWord);
    setRound(1);
    setCurrentCellIndex(0);
    setWin(false);
    setLoss(false);
    setRows((prevRow) =>
      prevRow.map((row) =>
        row.map((cell) => ({ ...cell, letter: null, status: null })),
      ),
    );
    setKeyboardRows((prevRow) =>
      prevRow.map((row) => row.map((cell) => ({ ...cell, status: null }))),
    );
  }

  // random word wird ausgesucht

  function getWords(setRandomWord) {
    const data = WordData.solutions;
    const randomWordNum = Math.floor(Math.random() * data.length);
    setRandomWord(data[randomWordNum]);
  }
  useEffect(() => {
    getWords(setRandomWord);
  }, []);

  return (
    <main className="bg-zinc-950">
      <Toaster position="top-center" reverseOrder={false} />
      {/* ================================= */}
      {win || loss ? null : (
        <h1 className="text-zinc-50 text-4xl text-700">Wordle</h1>
      )}

      {win ? <Confetti /> : null}
      {win ? (
        <h1 className="text-zinc-50 text-4xl text-700">You Won!</h1>
      ) : null}
      {loss ? <Confetti /> : null}
      {loss ? (
        <h1 className="text-zinc-50 text-4xl text-700">
          You Lost, the right word was {randomWord}
        </h1>
      ) : null}
      {/* ================================= */}
      <div className="cells">{playingBoard}</div>
      <div className="flex flex-col gap-2">{keyboard}</div>
      {win || loss ? (
        <button
          className="bg-violet-600 text-white rounded-md font-bold p-4"
          onClick={startNewGame}
        >
          Start new game
        </button>
      ) : null}
      {/* 
      <button
        onClick={() => {
          getWords(setRandomWord);
        }}
      >
        Aktualisieren
      </button>
      <p className="text-white">{randomWord ? randomWord : "Loading..."}</p>
      */}
    </main>
  );
}

export default App;
