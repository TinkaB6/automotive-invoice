import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../utils/supabaseClient';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push('/login');
      } else {
        setUser(data.user);
        setLoading(false);
      }
    };
    getUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '40px' }}>
      <h1>Welcome, {user?.email}</h1>
      <p>This is your secure dashboard.</p>
    </div>
  );
}
