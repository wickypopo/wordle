import { motion } from "motion/react";

export default function Test() {
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

  const render = playingRows.map((row) => {
    return (
      <div className="w-full flex gap-2 justify-center">
        {row.map((cell) => {
          return (
            <motion.div
              onClick={() => {
                cell.status = "pink";
                console.log(cell);
              }}
              initial={{ backgroundColor: "var(--color-mass-pink)" }}
              animate={{ backgroundColor: "var(--color-mass-blue)" }}
              transition={{ duration: 6 }}
              className="w-16 h-16 text-white rounded-2xl"
            ></motion.div>
          );
        })}
      </div>
    );
  });
  return (
    <main className="w-screen h-screen bg-black flex flex-col gap-2 justify-center">
      {render}
    </main>
  );
}
