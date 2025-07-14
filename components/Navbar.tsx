import Link from 'next/link';
import { useRouter } from 'next/router';
import supabase from '../utils/supabaseClient';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>🚗 AutoInvoice</div>
      <ul style={styles.navLinks}>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/invoices">Invoices</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/settings">Settings</Link></li>
        <li><button onClick={handleLogout} style={styles.logout}>Logout</button></li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#222',
    color: '#fff',
  },
  brand: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  logout: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
