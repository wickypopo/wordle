import { Link } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { useState } from "react";
import { Smile } from "lucide-react";
import { motion } from "motion/react";

export default function Register() {
  const [formSubmit, setFormSubmit] = useState(false);
  //
  async function registerNewUser(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: username,
          username: username,
        },
      },
    });
  }

  return (
    <main className="flex flex-col min-w-screen min-h-screen justify-center items-center gap-8 sm:gap-10 bg-mass-pink text-white p-8">
      <section className="flex flex-col gap-4 w-full md:max-w-[600px]">
        <h1 className="text-4xl font-bold">Register</h1>
        <form
          onSubmit={(e) => {
            setFormSubmit(true);
            return registerNewUser(e);
          }}
          className="flex flex-col gap-2"
        >
          <input
            type="username"
            name="username"
            id=""
            placeholder="Username"
            className="bg-mass-blue text-white p-4 rounded-full focus:outline-4 outline-mass-lime"
          />
          <input
            type="email"
            name="email"
            id=""
            placeholder="E-Mail"
            className="bg-mass-blue text-white p-4 rounded-full focus:outline-4 outline-mass-lime"
          />
          <input
            type="password"
            name="password"
            id=""
            placeholder="Password"
            className="bg-mass-blue text-white p-4 rounded-full focus:outline-4 outline-mass-lime"
          />
          <input
            type="submit"
            className="bg-zinc-50 text-zinc-950 rounded-full p-4 font-medium"
          />
        </form>
        <p>
          Already have a Account?{" "}
          <Link to="/login">
            <span className="text-mass-lime">Login here</span>
          </Link>
        </p>
        {formSubmit ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 absolute inset-0 flex justify-center items-center"
          >
            <div className="size-90 bg-mass-pink rounded-4xl flex flex-col justify-center items-center">
              <div className="flex mb-4">
                <Smile className="-mr-6 text-mass-blue size-20 rotate-45" />
                <Smile className="-mr-6 text-mass-orange size-20 rotate-15" />
                <Smile className="text-mass-lime size-20 -rotate-25" />
              </div>

              <span className="text-4xl font-bold">
                Thanks for <br />
                signing up!
              </span>
              <span className="text-dark-4">Please check your Inbox</span>
              <button
                onClick={() => setFormSubmit(false)}
                className="bg-mass-blue p-5 rounded-full text-semibold leading-none trim-text text-xl mt-4"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        ) : null}
      </section>
    </main>
  );
}
