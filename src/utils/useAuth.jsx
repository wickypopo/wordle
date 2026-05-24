import { useContext, createContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        // handle initial session
      } else if (event === "SIGNED_IN") {
        navigate("/");
        setLoading(false);
        setUser(session.user ?? null);
      } else if (event === "SIGNED_OUT") {
        navigate("/login");
        setUser(null);
        setLoading(false);
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
      } else if (event === "USER_UPDATED") {
        // handle user updated event
      }
    });

    // call unsubscribe to remove the callback
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setLoading(false);
        setUser(data.session.user);
      } else {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
