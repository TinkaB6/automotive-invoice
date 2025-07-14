// components/Navbar.tsx

import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // redirect to login after logout
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
      <Link href="/dashboard">Dashboard</Link> |{' '}
      <Link href="/products">Products</Link> |{' '}
      <Link href="/invoices">Invoices</Link> |{' '}
      <Link href="/settings">Settings</Link> |{' '}
      <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
        Logout
      </button>
    </nav>
  );
}
