import { Link } from "react-router-dom";
import { supabase } from "../utils/supabase";

export default function Register() {
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
    <main className="flex flex-col min-w-screen min-h-screen justify-center items-center gap-8 sm:gap-10 bg-zinc-950 text-zinc-50 p-12">
      <section className="flex flex-col gap-4 w-full">
        <h1 className="text-4xl">Register</h1>
        <form
          onSubmit={(e) => registerNewUser(e)}
          className="flex flex-col gap-2"
        >
          <input
            type="username"
            name="username"
            id=""
            placeholder="Benutzername"
            className="bg-zinc-900 p-2 rounded"
          />
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
          Already have a Account?{" "}
          <Link to="/login">
            <span className="text-green-500">Login here</span>
          </Link>
        </p>
      </section>
    </main>
  );
}
