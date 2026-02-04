import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

const SignUp = () => {
  const showpassword = () => {
    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;
    const confirmPasswordInput = document.getElementById(
      "confirm-password",
    ) as HTMLInputElement;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      confirmPasswordInput.type = "text";
    } else {
      passwordInput.type = "password";
      confirmPasswordInput.type = "password";
    }
  };
  const [email, setEmail] = useState("tesadoalvin8@gmail.com");
  const [password, setPassword] = useState("admin1");
  const [confirmPassword, setConfirmPassword] = useState("admin1");
  const navigate = useNavigate();
  const handleSignUp = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
    } else {
      console.log("User signed up:", data.user);
      navigate("/post");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="  w-96  justify-center px-6 py-12 lg:px-8 bg-white rounded-lg shadow-md bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex flex-col items-center">
          <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-white">
            Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSignUp}>
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
                  Password{" "}
                  <input
                    type="checkbox"
                    className="ml-1"
                    onClick={showpassword}
                  />
                </label>
              </div>

              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-[#ffffff26] px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md bg-[#ffffff26] px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    //<div className="p-4">
    //  <form onSubmit={handleSignUp}>
    //    <input
    //      type="email"
    //      placeholder="Email"
    //      onChange={(e) => setEmail(e.target.value)}
    //    />
    //    <input
    //      type="password"
    //      placeholder="Password"
    //      onChange={(e) => setPassword(e.target.value)}
    //      id="checkbox"
    //    />
    //    <input type="checkbox" onClick={showpassword} />
    //    <button type="submit">Sign Up</button>
    //  </form>
    //</div>
  );
};

export default SignUp;
