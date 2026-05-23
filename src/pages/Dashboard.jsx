import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabase";
import {
  Settings,
  X,
  Crown,
  Flame,
  ArrowRight,
  GhostIcon,
  Check,
} from "lucide-react";
import Modal from "../components/Modal";
import { motion, stagger } from "motion/react";

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  let count = 0;

  const colors = [
    "bg-mass-pink",
    "bg-mass-blue",
    "bg-mass-lime",
    "bg-mass-orange",
  ];

  const leaderboardContainer = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };
  const leaderboardList = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  };

  const gamesContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };
  const gamesList = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const leaderboard = [
    { id: "01", name: "Felix", wins: 764, losses: 34, ratio: "96% win" },
    { id: "02", name: "Hannah", wins: 721, losses: 41, ratio: "95% win" },
    { id: "03", name: "Jonas", wins: 689, losses: 52, ratio: "93% win" },
    { id: "04", name: "Mara", wins: 642, losses: 61, ratio: "91% win" },
    { id: "05", name: "Luca", wins: 598, losses: 67, ratio: "90% win" },
    { id: "06", name: "Lea", wins: 554, losses: 72, ratio: "89% win" },
    { id: "07", name: "Noah", wins: 511, losses: 79, ratio: "87% win" },
    { id: "08", name: "Emma", wins: 487, losses: 83, ratio: "85% win" },
    { id: "09", name: "Ben", wins: 462, losses: 91, ratio: "84% win" },
    { id: "10", name: "Sofia", wins: 438, losses: 96, ratio: "82% win" },
    { id: "11", name: "Finn", wins: 401, losses: 104, ratio: "79% win" },
    { id: "12", name: "Clara", wins: 376, losses: 111, ratio: "77% win" },
    { id: "13", name: "Elias", wins: 342, losses: 119, ratio: "74% win" },
    { id: "14", name: "Nina", wins: 318, losses: 127, ratio: "71% win" },
    { id: "15", name: "Paul", wins: 291, losses: 134, ratio: "68% win" },
    { id: "16", name: "Mila", wins: 263, losses: 141, ratio: "65% win" },
    { id: "17", name: "Theo", wins: 237, losses: 149, ratio: "61% win" },
    { id: "18", name: "Leni", wins: 211, losses: 156, ratio: "57% win" },
    { id: "19", name: "Tom", wins: 184, losses: 163, ratio: "53% win" },
    { id: "20", name: "Ida", wins: 158, losses: 171, ratio: "48% win" },
  ];

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("game_history").select();
      setGames(data.reverse());
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("user_stats").select();
      setUserStats(data);
    }
    fetchData();
  }, []);

  const userStatsRatio = userStats.map((item) => {
    const games = item.wins + item.losses;
    const winRate = games === 0 ? 0 : item.wins / games;

    return {
      ...item,
      ratio: Math.round(winRate * 100) + "%",
    };
  });

  const displayGames = games.map((item) => {
    count < 3 ? count++ : (count = 0);
    const bgColor = colors[count];
    return (
      <motion.div
        variants={gamesList}
        key={item.id}
        className={`flex justify-between ${bgColor} ${bgColor === "bg-mass-lime" || bgColor === "bg-mass-orange" ? "text-black" : null} rounded-3xl p-8`}
      >
        <span className="text-4xl leading-none trim-text font-semibold">
          {item.word.toUpperCase()}
        </span>
        <div className="flex gap-2 justify-center items-center">
          <span className="text-sm leading-none trim-text">Versuche: </span>
          <span className="font-bold leading-none trim-text">{item.tries}</span>
        </div>
      </motion.div>
    );
  });

  const displayLeaderboard = userStatsRatio.map((item) => {
    return (
      <motion.div
        variants={leaderboardList}
        key={item.id}
        className="border-t-4 border-dark-4 py-4 text-2xl flex flex-col"
      >
        <div className="flex gap-4">
          <span className="font-bold text-mass-blue">01</span>
          <span className="font-bold">{item.username}</span>
        </div>
        <div className="flex gap-2 w-full">
          <div className="flex flex-col text-xl w-full">
            <span className="text-base text-dark-2">wins: </span>
            <span className="font-bold">{item.wins}</span>
          </div>
          <div className="flex flex-col text-xl w-full">
            <span className="text-base text-dark-2">losses: </span>
            <span className="font-bold">{item.losses}</span>
          </div>
          <div className="flex flex-col text-xl w-full">
            <span className="text-base text-dark-2">ratio: </span>
            <span className="font-bold">{item.ratio}</span>
          </div>
        </div>
      </motion.div>
    );
  });

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <>
      <div className="flex justify-between pt-4 px-8 bg-zinc-950">
        {/* <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-white font-bold"></div> */}
        <h1 className="text-white text-2xl font-bold">Wordle</h1>
        <button
          onClick={() => setOpenSettings(!openSettings)}
          className="cursor-pointer"
        >
          <Settings color="#cacaca" />
        </button>
      </div>
      <main className="flex flex-col min-w-screen min-h-screen gap-4 sm:gap-10 bg-zinc-950 text-zinc-50 p-8 gap-8">
        <div className="flex w-full gap-2">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="flex w-full justify-between items-center bg-dark-4 rounded-3xl py-2 px-4 gap-2 text-black font-medium text-sm h-12 cursor-pointer"
          >
            <span className="leading-none trim-text">Leaderboard</span>
            <Crown size={"20px"} className="text-mass-blue" />
          </button>
          <div className="flex w-full justify-between items-center bg-dark-2 rounded-3xl py-2 px-4 gap-2 font-medium text-sm h-12">
            <span className="leading-none trim-text">Daily streak:</span>
            <div className="flex items-center gap-1">
              <span className="leading-none trim-text font-bold">0</span>
              <Flame size={"20px"} className="text-mass-pink" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-3xl font-bold">Latest games</span>

          {displayGames.length === 0 ? (
            <div className="flex flex-col gap-2 justify-center items-center w-full h-100 bg-dark-1 rounded-4xl">
              <GhostIcon className="size-15 text-mass-pink" />
              <span>{"No games yet :-("}</span>
            </div>
          ) : (
            <motion.div
              variants={gamesContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-2"
            >
              {displayGames}
            </motion.div>
          )}
        </div>

        <Link
          to="/wordle"
          className="fixed bottom-0 left-0 right-0 flex px-8 pt-12 pb-8"
        >
          <button className="bg-mass-blue w-full p-4 text-xl rounded-full flex items-center justify-center shadow-xl shadow-black/30 z-20">
            <span className="font-bold text-3xl leading-none trim-text">
              Play
            </span>
          </button>
          <div className="min-h-20 min-w-20 bg-mass-pink rounded-full flex justify-center items-center shadow-xl shadow-black/30 z-20">
            <ArrowRight size={"40px"} />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-black/0 to-black/20 pointer-events-none " />
          <div className="absolute inset-0 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,transparent_10%,black_60%)] pointer-events-none " />
        </Link>
      </main>
      <Modal state={isVisible} setState={setIsVisible}>
        <h2 className="text-4xl text-white font-bold">Leaderboard</h2>
        <motion.div
          initial="closed"
          variants={leaderboardContainer}
          animate="open"
        >
          {displayLeaderboard}
        </motion.div>
      </Modal>
      <Modal variant="lime" state={openSettings} setState={setOpenSettings}>
        <h2 className="text-4xl text-black font-bold">Settings</h2>
        <motion.div
          initial="closed"
          variants={leaderboardContainer}
          animate="open"
          className="flex flex-col h-full justify-between"
        >
          <div className="flex flex-col gap-2 border-t-4 pt-4">
            <label
              className="text-dark-2 tracking-tigh font-medium text-xl text-dark-3"
              htmlFor="username"
            >
              Change Username
            </label>
            <div className="flex">
              <input
                onClick={() => {}}
                type="username"
                name="username"
                id=""
                placeholder="Username"
                className="w-full bg-mass-blue text-white p-4 rounded-full focus:outline-0"
              />
              <button className="bg-mass-pink h-full px-4 rounded-full">
                <Check />
              </button>
            </div>
            <label
              className="text-dark-2 tracking-tigh font-medium text-xl text-dark-3 mt-4"
              htmlFor="email"
            >
              Change E-mail
            </label>
            <div className="flex">
              <input
                onClick={() => {}}
                type="email"
                name="email"
                id=""
                placeholder="E-mail"
                className="w-full bg-mass-blue text-white p-4 rounded-full focus:outline-0"
              />
              <button className="bg-mass-pink h-full px-4 rounded-full">
                <Check />
              </button>
            </div>
            <label
              className="text-dark-2 tracking-tigh font-medium text-xl text-dark-3 mt-4"
              htmlFor="password"
            >
              Change Password
            </label>
            <div className="flex">
              <input
                onClick={() => {}}
                type="password"
                name="password"
                id=""
                placeholder="New Password"
                className="w-full bg-mass-blue text-white p-4 rounded-full focus:outline-0"
              />
              <button className="bg-mass-pink h-full px-4 rounded-full">
                <Check />
              </button>
            </div>
          </div>
          <button
            onClick={signOut}
            className="mt-2 p-4 rounded-full bg-black w-full text-white"
          >
            Logout
          </button>
        </motion.div>
      </Modal>
    </>
  );
}
