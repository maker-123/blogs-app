import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

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

  return (
    <div className="p-4">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
