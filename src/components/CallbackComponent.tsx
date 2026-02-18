import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
          navigate("/post", { replace: true });
        }
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, [navigate]);

  return <div>Loading...</div>;
}
