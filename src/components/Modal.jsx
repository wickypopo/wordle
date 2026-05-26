import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export default function Modal({ children, state, setState, variant = "pink" }) {
  const variants = {
    pink: "bg-mass-pink",
    blue: "bg-mass-blue",
    orange: "bg-mass-orange",
    lime: "bg-mass-lime",
  };

  return (
    <AnimatePresence>
      {state ? (
        <div>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`${variants[variant]} fixed top-15 left-0 right-0 md:left-1/2 md:-translate-x-1/2 -bottom-20 z-20 rounded-t-4xl flex flex-col gap-2 p-8 pb-25 overflow-y-auto w-full md:max-w-[600px]`}
          >
            <X
              onClick={() => setState(!state)}
              size={"20px"}
              className="absolute right-8 top-4 text-white cursor-pointer"
            />
            {/*<div className="absolute left-1/2 -translate-x-1/2 top-2 h-2 w-35 bg-black rounded-full"></div>*/}
            {children}
          </motion.div>
          <motion.div
            onClick={() => setState(!state)}
            className="absolute top-0 left-0 right-0 bottom-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
