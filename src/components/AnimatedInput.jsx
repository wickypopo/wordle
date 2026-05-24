import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

export default function AnimatedInput({
  type,
  text,
  placeholder,
  children,
  upperParentVariants,
  parentVariants,
  childrenVariants,
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(null);

  return (
    <motion.div variants={upperParentVariants} className="flex flex-col">
      <label
        className="text-white tracking-tigh font-medium text-lg"
        htmlFor={text}
      >
        {placeholder}
      </label>
      <motion.div
        variants={parentVariants}
        initial="closed"
        animate={open ? "open" : "closed"}
        className="flex h-14 overflow-hidden"
      >
        <motion.input
          onChange={(event) => {
            const value = event.currentTarget.value;
            setInput(value);
            value.length > 0 ? setOpen(true) : setOpen(false);
            console.log(open);
          }}
          type={type}
          name={text}
          placeholder={"New " + placeholder}
          autoComplete={text}
          className="px-4 flex-1 min-w-0 h-full bg-mass-pink text-white rounded-full focus:outline-0"
        />

        <motion.button
          variants={childrenVariants}
          className="flex-shrink-0 bg-dark-2 h-full w-14 bg-mass-lime rounded-full flex items-center justify-center"
        >
          <Check />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
