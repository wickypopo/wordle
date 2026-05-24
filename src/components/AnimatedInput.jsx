import { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

export default function AnimatedInput({
  text,
  placeholder,
  upperParentVariants,
  submitFunction,
}) {
  const [input, setInput] = useState(null);
  const [animation, setAnimation] = useState("input");

  const inputAnimation = {
    input: {
      width: "100%",
      x: 0,
      opacity: 1,
      paddingLeft: 20,
    },
    inputbutton: {
      width: "calc(100% - 56px)",
      x: 0,
      opacity: 1,
      paddingLeft: 20,
    },
    button: {
      width: "calc(100% - 56px)",
      x: "-100%",
      opacity: 0,
      paddingLeft: 0,
    },
  };

  const buttonAnimation = {
    input: { width: 0, opacity: 0 },
    inputbutton: { width: "56px", opacity: 1 },
    button: { width: "100%", opacity: 1 },
  };

  return (
    <motion.div variants={upperParentVariants} className="flex flex-col">
      <label
        className="text-white tracking-tigh font-medium text-lg"
        htmlFor={text}
      >
        {placeholder}
      </label>
      <motion.form className="relative flex h-14 w-full overflow-hidden rounded-full">
        <motion.input
          variants={inputAnimation}
          initial="input"
          animate={animation}
          onChange={(event) => {
            const value = event.currentTarget.value;
            setInput(value);
            value.length > 0
              ? setAnimation("inputbutton")
              : setAnimation("input");
          }}
          type={text}
          name={text}
          placeholder={"New " + placeholder}
          autoComplete={text}
          className="h-full min-w-0 rounded-full bg-mass-pink text-white focus:outline-0"
        />

        <motion.button
          variants={buttonAnimation}
          initial="input"
          animate={animation}
          onClick={() => {
            submitFunction(input);
            setAnimation("button");
          }}
          className="h-full flex-shrink-0 rounded-full overflow-hidden bg-mass-lime flex justify-center items-center"
        >
          <Check />
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
