import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

const SignUp = () => {
  const showpassword = () => {
    const passwordInput = document.getElementById(
      "checkbox",
    ) as HTMLInputElement;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  };
  const [email, setEmail] = useState("tesadoalvin8@gmail.com");
  const [password, setPassword] = useState("admin");
  const navigate = useNavigate();
  const handleSignUp = async (e: any) => {
    e.preventDefault();

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
    <div className="p-4">
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          id="checkbox"
        />
        <input type="checkbox" onClick={showpassword} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
