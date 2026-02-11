import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("tesadoalvin8@gmail.com");
  const [password, setPassword] = useState("admin");
  const navigate = useNavigate();
  const handleLogin = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      console.log("User logged in:", data.user);
      navigate("/post");
    }
  };
  const handleGoogleLogin = async () => {
    const siteUrl = process.env.localhost || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/post`,
      },
    });

    if (error) alert(error.message);
  };
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="  w-96  justify-center px-6 py-12 lg:px-8 bg-white rounded-lg shadow-md bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex flex-col items-center">
          <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-white">
            blog
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="block w-full rounded-md bg-[#ffffff26] px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className=" text-sm/6 font-medium text-white "
                >
                  Password
                </label>
                <div className="text-sm"></div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="block w-full rounded-md bg-[#ffffff26] px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="mb-3 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>

              {/* NEW GOOGLE BUTTON */}
              <button
                type="button" // Important: type="button" so it doesn't trigger handleLogin
                onClick={handleGoogleLogin}
                className="flex w-full justify-center items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faGoogle}></FontAwesomeIcon>
                Sign in with Google
              </button>
            </div>
            <div>
              <p className="text-sm text-white/70 text-center">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
