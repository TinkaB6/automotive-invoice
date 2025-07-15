// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      else setUser(user);
    };
    getUser();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.email}</p>}
    </div>
  );
}
