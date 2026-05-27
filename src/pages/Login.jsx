import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  //
  async function loginUser(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast.error(error.message);
    }

    if (data.session) {
      navigate("/");
    }
  }

  return (
    <main className="flex flex-col min-w-screen min-h-screen justify-center items-center gap-8 sm:gap-10 bg-mass-pink text-zinc-50 p-8">
      <section className="flex flex-col gap-4 w-full md:max-w-[600px]">
        <h1 className="text-4xl font-bold">Login</h1>
        <form onSubmit={(e) => loginUser(e)} className="flex flex-col gap-2">
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
          Don't have a Account?{" "}
          <Link to="/register">
            <span className="text-mass-lime">Register here</span>
          </Link>
        </p>
      </section>
    </main>
  );
}
