import { createContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext();

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return { user, loading };
}
