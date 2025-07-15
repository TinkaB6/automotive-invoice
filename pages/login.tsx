// pages/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
