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
    console.log(email, password);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (data.session) {
      navigate("/");
    }
    if (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className="flex flex-col min-w-screen min-h-screen justify-center items-center gap-8 sm:gap-10 bg-zinc-950 text-zinc-50 p-12">
      <section className="flex flex-col gap-4 w-full">
        <h1 className="text-4xl">Login</h1>
        <form onSubmit={(e) => loginUser(e)} className="flex flex-col gap-2">
          <input
            type="email"
            name="email"
            id=""
            placeholder="E-Mail"
            className="bg-zinc-900 p-2 rounded"
          />
          <input
            type="password"
            name="password"
            id=""
            placeholder="Password"
            className="bg-zinc-900 p-2 rounded"
          />
          <input
            type="submit"
            className="bg-zinc-50 text-zinc-950 rounded p-2 font-medium"
          />
        </form>
        <p>
          Don't have a Account?{" "}
          <Link to="/register">
            <span className="text-green-500">Register here</span>
          </Link>
        </p>
      </section>
    </main>
  );
}
