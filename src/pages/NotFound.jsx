import { Smile } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex flex-col min-w-screen min-h-screen justify-center items-center gap-8 sm:gap-10 bg-mass-pink text-zinc-50 p-8">
      <section className="flex flex-col justify-center items-center gap-4 w-full md:max-w-[600px] text-center">
        <div className="flex">
          <motion.div
            initial={{ y: -500 }}
            animate={{ y: 0 }}
            transition={{ delay: 0 }}
          >
            <span className="text-9xl font-bold leading-none text-trim">4</span>
          </motion.div>
          <motion.div
            initial={{ y: -500 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Smile className="text-mass-lime size-26 -rotate-25" />
          </motion.div>
          <motion.div
            initial={{ y: -500 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-9xl font-bold leading-none text-trim">4</span>
          </motion.div>
        </div>
        <span className="text-xl text-dark-4 font-medium">
          Whoopsie.. This site doesn't exist.
        </span>
        <Link
          to="/"
          className="bg-mass-blue text-white rounded-full py-4 px-6 font-medium"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
