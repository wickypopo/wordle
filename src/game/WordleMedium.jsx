import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "motion/react";
import { WordData } from "../assets/WordData";
import { nanoid } from "nanoid";
import { Delete, X, ArrowLeft } from "lucide-react";
import { style } from "motion/react-client";
import Confetti from "react-confetti-boom";
import { supabase } from "../utils/supabase";
import { useAuth } from "../utils/useAuth";
import { Link } from "react-router-dom";

function WordleMedium() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
  }, [loading, user]);

  //
  // Tastatur && Spielfeld Data

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
      { key: "Enter", label: "ENTER", type: "action" },
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
  ];

  // States

  const [randomWord, setRandomWord] = useState("");
  const [currentCellIndex, setCurrentCellIndex] = useState(0);
  const [rows, setRows] = useState(playingRows);
  const [keyboardrows, setKeyboardRows] = useState(keyboardRowsData);
  const [win, setWin] = useState(false);
  const [loss, setLoss] = useState(false);

  const [round, setRound] = useState(1);

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
                  " flex justify-center items-center text-white sm:w-20 h-14 bg-mass-pink rounded-xl leading-none trim-text px-2"
                }
                onClick={() => handleKeyboardDelete()}
                key={nanoid()}
              >
                <Delete size="24" />
              </button>
            );
          } else if (key.key === "Enter") {
            return (
              <button
                className={
                  key.key +
                  " text-white sm:w-20 h-14 bg-mass-pink rounded-xl leading-none trim-text font-bold text-xs sm:text-[16px] px-2"
                }
                onClick={() => handleKeyboardSubmit(key.key)}
                key={nanoid()}
              >
                <span className="tracking-widest">{key.key}</span>
              </button>
            );
          } else {
            return (
              <button
                className={
                  key.status +
                  " text-white w-full sm:w-14 h-14 bg-dark-3 rounded-xl leading-none trim-text font-bold"
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
    <div className="flex justify-center gap-2 w-full h-full" key={nanoid()}>
      {row.map((cell) => (
        <div
          className={
            cell.status +
            " flex justify-center items-center text-white text-xl font-bold h-15 w-15 border-2 border-zinc-800 rounded-xl"
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

  function handleKeyboardDelete() {
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

  async function handleKeyboardSubmit() {
    const jointWord = word.join("").toLowerCase();

    if (!WordData.allowedGuesses.includes(jointWord)) {
      return toast.error("Not in Word List");
    }

    const used = [false, false, false, false, false];

    const currentRowIndex = round - 1;

    const newRows = rows.map((row, rowIndex) => {
      if (rowIndex !== currentRowIndex) {
        return row;
      }

      const newRow = row.map((cell) => ({
        ...cell,
        status: null,
      }));

      // 1. Durchgang: correct markieren
      newRow.forEach((cell, cellIndex) => {
        const cellLetter = cell.letter?.toLowerCase();

        if (randomWord[cellIndex] === cellLetter) {
          cell.status = "correct";
          used[cellIndex] = true;
        }
      });

      // 2. Durchgang: exist / false markieren
      newRow.forEach((cell) => {
        const cellLetter = cell.letter?.toLowerCase();

        if (!cellLetter) return;

        if (cell.status === "correct") return;

        const foundIndex = randomWord.split("").findIndex((letter, index) => {
          return letter === cellLetter && used[index] === false;
        });

        if (foundIndex !== -1) {
          cell.status = "exist";
          used[foundIndex] = true;
        } else {
          cell.status = "false";
        }
      });

      return newRow;
    });

    setRows(newRows);

    setKeyboardRows((prevRows) =>
      prevRows.map((row) =>
        row.map((key) => {
          const matchingCells = newRows
            .flat()
            .filter((cell) => cell?.letter?.toLowerCase() === key.key);

          if (matchingCells.some((cell) => cell.status === "correct")) {
            return { ...key, status: "key-correct" };
          }

          if (matchingCells.some((cell) => cell.status === "exist")) {
            return { ...key, status: "key-exist" };
          }

          if (matchingCells.some((cell) => cell.status === "false")) {
            return { ...key, status: "key-false" };
          }

          return key;
        }),
      ),
    );

    setWord([]);

    if (randomWord === jointWord) {
      // Latest games:
      // Word, tries, win/loss

      const { error } = await supabase.from("game_history").insert({
        username: user.user_metadata.username ?? "Unknown",
        word: randomWord,
        tries: round,
        win: true,
        user_id: user.id,
        gamemode: "medium",
      });

      setWin(true);
      await saveGameStats({ win: true });

      if (error) {
        toast.error("something went wrong");
        return;
      }

      return;
    }

    if (round === 4 && randomWord !== jointWord) {
      const { error } = await supabase.from("game_history").insert({
        username: user.user_metadata.username ?? "Unknown",
        word: randomWord,
        tries: round,
        win: false,
        user_id: user.id,
        gamemode: "medium",
      });
      await saveGameStats({ win: false });
      setLoss(true);

      if (error) {
        toast.error("something went wrong");
        return;
      }

      return;
    }

    setRound((prev) => prev + 1);
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

  // DB Functions

  async function saveGameStats({ win }) {
    const { data: stats, error } = await supabase
      .from("user_stats")
      .select()
      .eq("user_id", user.id);

    if (error) {
      console.log(error.message);
      return;
    }

    if (stats.length === 0) {
      const { data, error } = await supabase.from("user_stats").insert({
        username: user.user_metadata.username,
        user_id: user.id,
        total_wins: win ? 1 : 0,
        total_losses: win ? 0 : 1,
        games_played: 1,
        current_streak: win ? 1 : 0,
        max_streak: win ? 1 : 0,
        total_tries: round,
        medium_win: win ? 1 : 0,
        medium_loss: win ? 0 : 1,
      });
    } else {
      const newCurrentStreak = win ? stats[0].current_streak + 1 : 0;
      const newMaxStreak =
        newCurrentStreak > stats[0].max_streak
          ? newCurrentStreak
          : stats[0].max_streak;
      const { data, error } = await supabase
        .from("user_stats")
        .update({
          total_wins: win ? stats[0].total_wins + 1 : stats[0].total_wins,
          total_losses: win ? stats[0].total_losses : stats[0].total_losses + 1,
          games_played: stats[0].games_played + 1,
          current_streak: newCurrentStreak,
          max_streak: newMaxStreak,
          total_tries: stats[0].total_tries + round,
          medium_win: win ? stats[0].medium_win + 1 : stats[0].medium_win,
          medium_loss: win ? stats[0].medium_loss : stats[0].medium_loss + 1,
        })
        .eq("user_id", user.id)
        .select("*");

      if (error) {
        console.log(error.message);
        return;
      }
    }
  }

  return (
    <main className="flex flex-col min-w-screen h-lvh p-8 pt-20 gap-8 sm:gap-10 bg-black">
      <Toaster position="top-center" reverseOrder={false} />
      <Link
        to="/"
        className="flex justify-center items-center size-10 bg-mass-pink absolute left-8 top-4 rounded-full"
      >
        <X className="size-5 text-white" />
      </Link>
      {/* ================================= */}

      {win ? <Confetti /> : null}

      {/* ================================= */}
      <div className="flex flex-col gap-2 justify-center">{playingBoard}</div>
      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        {keyboard}
      </div>
      {win || loss ? (
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center gap-2">
          <span className="text-4xl text-white font-bold">
            You {win ? "Won" : "Lost"}
          </span>
          <span className="text-xl text-white">The word was: {randomWord}</span>
          <button
            className="bg-mass-blue text-white rounded-4xl font-bold py-4 px-6"
            onClick={startNewGame}
          >
            Start new game
          </button>
          <Link to="/">
            <button className="bg-mass-pink text-white rounded-4xl font-bold py-4 px-6">
              Back to Home
            </button>
          </Link>
        </div>
      ) : null}
    </main>
  );
}

export default WordleMedium;
