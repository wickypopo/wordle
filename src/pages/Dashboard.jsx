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
    console.log(item.win);
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

  const sortetLeaderboard = allUserStats.sort((a, b) => b.wins - a.wins);

  const userStatsRatio = sortetLeaderboard.map((item) => {
    const games = item.wins + item.losses;
    const winRate = games === 0 ? 0 : item.wins / games;
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
      <header className="flex justify-between pt-4 px-8 bg-zinc-950">
        {/* <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-white font-bold"></div>*/}
        <h1 className="text-white text-2xl font-bold leading-none text-trim">
          Wordle
        </h1>
        <button
          onClick={() => setOpenSettings(!openSettings)}
          className="cursor-pointer"
        >
          <Settings color="#cacaca" />
        </button>
      </header>
      <main className="flex flex-col min-w-screen min-h-screen gap-4 sm:gap-10 bg-zinc-950 text-zinc-50 p-8 gap-8">
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

        <div className="fixed bottom-0 left-0 right-0 flex px-8 pt-12 pb-8">
          {/*<Link
          to="/wordle"
          className="fixed bottom-0 left-0 right-0 flex px-8 pt-12 pb-8"
        > */}
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

          <div className="absolute inset-0 bg-linear-to-b from-black/0 to-black/50 pointer-events-none " />
          <div className="absolute inset-0 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,transparent_10%,black_60%)] pointer-events-none " />
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
      <Modal variant="orange" state={openProfile} setState={setOpenProfile}>
        <h2 className="text-4xl text-black font-bold">Stats</h2>
        <div className="flex flex-col h-full justify-between">
          <motion.div
            initial="closed"
            variants={staggerContainer}
            animate="open"
            className="flex flex-col gap-2 border-t-2 pt-4 border-dark-2"
          >
            <span className="text-2xl text-black">
              losses: {userStats?.losses}
            </span>
            <span className="text-2xl text-black">wins: {userStats?.wins}</span>
            <span className="text-2xl text-black">
              current streak: {userStats?.current_streak}
            </span>
            <span className="text-2xl text-black">
              games played: {userStats?.games_played}
            </span>
            <span className="text-2xl text-black">
              max streak: {userStats?.max_streak}
            </span>
            <span className="text-2xl text-black">
              total tries: {userStats?.total_tries}
            </span>
          </motion.div>
        </div>
      </Modal>
    </>
  );
}
