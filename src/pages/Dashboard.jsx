import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabase";
import {
  Settings,
  X,
  Crown,
  Star,
  ArrowRight,
  GhostIcon,
  Check,
} from "lucide-react";
import Modal from "../components/Modal";
import { motion, stagger } from "motion/react";
import { FluentEmoji } from "emoted-fluent-emoji";
import AnimatedInput from "../components/AnimatedInput";
import { useAuth } from "../utils/useAuth";

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [allUserStats, setAllUserStats] = useState([]);
  const [userStats, setUserStats] = useState([]);

  // Modal States
  const [openLeaderboard, setOpenLeaderboard] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openPlay, setOpenPlay] = useState(false);

  const anyModalOpen =
    openLeaderboard || openSettings || openProfile || openPlay;

  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModalOpen]);

  // -----------------------

  const { user } = useAuth();
  let count = 0;

  const colors = [
    "bg-mass-pink",
    "bg-mass-blue",
    "bg-mass-lime",
    "bg-mass-orange",
  ];

  const staggerContainer = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };
  const staggerChildren = {
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

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("game_history").select();
      setGames(data.reverse());
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setUserStats(data);
      console.log(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("user_stats").select();
      setAllUserStats(data);
    }
    fetchData();
  }, []);

  const displayGames = games.map((item) => {
    count < 3 ? count++ : (count = 0);
    const bgColor = colors[count];
    return (
      <motion.div
        variants={gamesList}
        key={item.id}
        className={`flex justify-between ${bgColor} ${bgColor === "bg-mass-lime" || bgColor === "bg-mass-orange" ? "text-black" : null} rounded-3xl p-8`}
        style={
          item.win
            ? null
            : {
                backgroundColor: "#141414",
                color: "#353535",
              }
        }
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

  const sortetLeaderboard = allUserStats.sort(
    (a, b) => b.total_wins - a.total_wins,
  );

  function getWinRate(win, loss) {
    if (win === undefined || win === null) {
      win = 0;
    }
    if (loss === undefined || loss === null) {
      loss = 0;
    }
    const games = win + loss;
    const winrate = games === 0 ? 0 : (win / games) * 100;
    const beautify = winrate.toFixed(0) + "%";
    return beautify;
  }

  const userStatsRatio = sortetLeaderboard.map((item) => {
    const winRate = games === 0 ? 0 : item.total_wins / item.games_played;
    const position = allUserStats.indexOf(item) + 1;

    return {
      ...item,
      ratio: Math.round(winRate * 100) + "%",
      position: position,
    };
  });

  const displayLeaderboard = userStatsRatio.map((item) => {
    return (
      <motion.div
        variants={staggerChildren}
        key={item.id}
        className="border-t-2 border-dark-4 py-4 text-2xl flex flex-col"
      >
        <div className="flex gap-4">
          <span
            className="font-bold text-mass-blue"
            style={
              item.position <= 3 ? { color: "var(--color-mass-lime)" } : null
            }
          >
            {item.position}
          </span>
          <span className="font-bold">{item.username}</span>
        </div>
        <div className="flex gap-2 w-full">
          <div className="flex flex-col text-xl w-full">
            <span className="text-base text-dark-2">wins: </span>
            <span className="font-bold">{item.total_wins}</span>
          </div>
          <div className="flex flex-col text-xl w-full">
            <span className="text-base text-dark-2">losses: </span>
            <span className="font-bold">{item.total_losses}</span>
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
  async function changeUserName(username) {
    console.log(username);
    const { error } = await supabase
      .from("user_stats")
      .update({ username: username })
      .eq("user_id", user.id);

    const { data } = await supabase.auth.updateUser({
      data: {
        display_name: username,
        username: username,
      },
    });
    console.log(data);
  }

  async function changeEmail(email) {
    console.log(email);
    const { data, error } = await supabase.auth.updateUser({
      email: email,
    });
    console.log(data, error);
  }
  async function changePassword(password) {
    const { error } = await supabase.auth.signOut();
  }
  return (
    <>
      <header className="flex justify-center items-center pt-4 px-8 bg-zinc-950">
        {/* <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-white font-bold"></div>*/}
        <div className="flex justify-between w-full md:max-w-[600px]">
          <h1 className="text-white text-xl font-medium leading-none text-trim">
            Hello {user.user_metadata.username}!
          </h1>
          <button
            onClick={() => setOpenSettings(!openSettings)}
            className="cursor-pointer"
          >
            <Settings color="#cacaca" />
          </button>
        </div>
      </header>
      <main className="flex flex-col items-center min-w-screen min-h-screen bg-zinc-950 text-zinc-50 p-8 gap-8">
        <div className="w-full md:max-w-[600px] flex flex-col gap-8 sm:gap-10">
          <div className="flex w-full gap-2">
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setOpenLeaderboard(!openLeaderboard)}
              className="flex w-full justify-between items-center bg-dark-4 rounded-3xl py-2 px-4 gap-2 text-black font-medium text-sm h-12 cursor-pointer"
            >
              <span className="leading-none trim-text">Leaderboard</span>
              <Crown size={"20px"} className="text-mass-blue" />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setOpenProfile(!openProfile)}
              className="flex w-full justify-between items-center bg-dark-2 rounded-3xl py-2 px-4 gap-2 font-medium text-sm h-12 cursor-pointer"
            >
              <span className="leading-none trim-text">Stats</span>
              <Star size={"20px"} className="text-mass-pink" />
            </motion.div>
          </div>
          <div className="flex flex-col gap-2">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold"
            >
              Latest games
            </motion.span>

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
          <div className="flex justify-center fixed bottom-0 left-0 right-0 flex px-8 pt-12 pb-8">
            {/*<Link
          to="/wordle"
          className="fixed bottom-0 left-0 right-0 flex px-8 pt-12 pb-8"
        > */}
            <div className="flex w-full md:max-w-[600px]">
              <motion.button
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setOpenPlay(true)}
                className="bg-mass-blue w-full p-4 text-xl rounded-full flex items-center justify-center shadow-xl shadow-black/30 z-20"
              >
                <span className="font-bold text-3xl leading-none trim-text">
                  Play
                </span>
              </motion.button>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setOpenPlay(true)}
                className="min-h-20 min-w-20 bg-mass-pink rounded-full flex justify-center items-center shadow-xl shadow-black/30 z-20"
              >
                <ArrowRight size={"40px"} />
              </motion.div>
            </div>
            <div className="absolute inset-0 bg-linear-to-b from-black/0 to-black/50 pointer-events-none " />
            <div className="absolute inset-0 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,transparent_10%,black_60%)] pointer-events-none max-w-screen" />
          </div>
        </div>
      </main>
      {openPlay ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpenPlay(false)}
          className="absolute inset-0 bg-black/60 flex p-8 overflow-hidden flex justify-center items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex bg-mass-pink rounded-4xl gap-2 p-12 flex flex-col justify-center items-center"
          >
            <span className="text-4xl text-white font-bold text-center">
              Choose a <br /> Gamemode
            </span>
            <Link to="/wordle">
              <div className="flex w-60 text-white">
                <motion.button
                  className="font-bold text-2xl leading-none trim-text bg-mass-blue w-full 
              p-4 text-xl rounded-full flex items-center justify-center shadow-xl
               shadow-black/30 z-20"
                >
                  Easy
                </motion.button>
                <div
                  className="min-w-15 min-h-15 bg-mass-lime rounded-full flex 
              justify-center items-center shadow-xl shadow-black/30 z-20 text-black"
                >
                  <ArrowRight size={"30px"} />
                </div>
              </div>
            </Link>
            <Link to="/wordle-medium">
              <div className="flex w-60 text-white">
                <motion.button
                  className="font-bold text-2xl leading-none trim-text bg-mass-blue w-full 
              p-4 text-xl rounded-full flex items-center justify-center shadow-xl
               shadow-black/30 z-20"
                >
                  Medium
                </motion.button>
                <div
                  className="min-w-15 min-h-15 bg-mass-lime rounded-full flex 
              justify-center items-center shadow-xl shadow-black/30 z-20 text-black"
                >
                  <ArrowRight size={"30px"} />
                </div>
              </div>
            </Link>
            <Link to="/wordle-hard">
              {" "}
              <div className="flex w-60 text-white">
                <motion.button
                  className="font-bold text-2xl leading-none trim-text bg-mass-blue w-full 
              p-4 text-xl rounded-full flex items-center justify-center shadow-xl
               shadow-black/30 z-20"
                >
                  Hard
                </motion.button>
                <div
                  className="min-w-15 min-h-15 bg-mass-lime rounded-full flex 
              justify-center items-center shadow-xl shadow-black/30 z-20 text-black"
                >
                  <ArrowRight size={"30px"} />
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      ) : null}
      <Modal
        variant="pink"
        state={openLeaderboard}
        setState={setOpenLeaderboard}
      >
        <h2 className="text-4xl text-white font-bold">Leaderboard</h2>
        <motion.div initial="closed" variants={staggerContainer} animate="open">
          {displayLeaderboard}
        </motion.div>
      </Modal>
      <Modal variant="blue" state={openSettings} setState={setOpenSettings}>
        <h2 className="text-4xl text-white font-bold">Settings</h2>
        <div className="flex flex-col h-full justify-between">
          <motion.div
            initial="closed"
            variants={staggerContainer}
            animate="open"
            className="flex flex-col gap-2 border-t-2 pt-4 border-dark-4"
          >
            <AnimatedInput
              text="username"
              placeholder="Username"
              submitFunction={changeUserName}
              upperParentVariants={staggerChildren}
            />
            <AnimatedInput
              text="email"
              placeholder="E-Mail"
              submitFunction={changeEmail}
              upperParentVariants={staggerChildren}
            />
            <AnimatedInput
              text="password"
              placeholder="Password"
              submitFunction={changePassword}
              upperParentVariants={staggerChildren}
            />
          </motion.div>
          <button
            onClick={signOut}
            className="mt-2 p-4 rounded-full bg-black w-full text-white"
          >
            Logout
          </button>
        </div>
      </Modal>
      <Modal variant="blue" state={openProfile} setState={setOpenProfile}>
        <h2 className="text-4xl text-black font-bold">Stats</h2>
        <div className="flex flex-col h-full justify-between">
          <motion.div
            initial="closed"
            variants={staggerContainer}
            animate="open"
            className="flex flex-col gap-2 border-t-2 pt-4 border-dark-2"
          >
            <div className="flex w-full justify-between">
              <div className="flex flex-col w-1/3">
                <span className="text-dark-4">Wins</span>
                <span className="text-5xl font-bold text-white">
                  {" "}
                  {userStats.total_wins ? userStats.total_wins : 0}
                </span>
                <span className="text-dark-4">Games</span>
                <span className="text-xl font-bold text-white">
                  {userStats.games_played ? userStats.games_played : 0}
                </span>
              </div>
              <div className="flex flex-col w-1/3">
                <span className="text-dark-4">Losses</span>
                <span className="text-5xl font-bold text-white">
                  {userStats.total_losses ? userStats.total_losses : 0}
                </span>
                <span className="text-dark-4">Streak</span>
                <span className="text-xl font-bold text-white">
                  {" "}
                  {userStats.current_streak ? userStats.current_streak : 0}
                </span>
              </div>
              <div className="flex flex-col w-1/3">
                <span className="text-dark-4">Win-Ratio</span>
                <span className="text-5xl font-bold text-white">
                  {getWinRate(userStats.total_wins, userStats.total_losses)}
                </span>
                <span className="text-dark-4">Total tries</span>
                <span className="text-xl font-bold text-white">
                  {userStats.total_tries ? userStats.total_tries : 0}
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full py-4 px-8 bg-mass-pink rounded-4xl gap-2">
              <span className="font-medium">Easy Mode</span>
              <div className="flex w-full justify-between">
                <div className="flex flex-col">
                  <span>Wins</span>
                  <span className="text-4xl font-bold text-mass-blue">
                    {userStats.easy_win ? userStats.easy_win : 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>Losses</span>
                  <span className="text-4xl font-bold text-mass-blue">
                    {userStats.easy_loss ? userStats.easy_loss : 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>Win-Ratio</span>
                  <span className="text-4xl font-bold text-mass-blue">
                    {getWinRate(userStats.easy_win, userStats.easy_loss)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full py-4 px-8 bg-mass-pink rounded-4xl gap-2">
              <span className="font-medium">Medium Mode</span>
              <div className="flex w-full justify-between">
                <div className="flex flex-col">
                  <span>Wins</span>
                  <span className="text-4xl font-bold text-mass-blue">
                    {userStats.medium_win ? userStats.medium_win : 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>Losses</span>
                  <span className="text-4xl font-bold text-mass-blue">
                    {userStats.medium_loss ? userStats.medium_loss : 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>Win-Ratio</span>
                  <span className="text-4xl font-bold text-mass-blue">
                    {getWinRate(userStats.medium_win, userStats.medium_loss)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full py-4 px-8 bg-mass-pink rounded-4xl gap-2">
              <span className="font-medium">Hard Mode</span>
              <div className="flex w-full justify-between">
                <div className="flex flex-col">
                  <span>Wins</span>
                  <span className="text-4xl font-bold text-mass-blue">
                    {userStats.hard_win ? userStats.hard_win : 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>Losses</span>
                  <span className="text-4xl font-bold text-mass-blue">
                    {userStats.hard_loss ? userStats.hard_loss : 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>Win-Ratio</span>
                  <span className="text-4xl font-bold text-mass-blue">
                    {getWinRate(userStats.hard_win, userStats.hard_loss)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Modal>
    </>
  );
}
