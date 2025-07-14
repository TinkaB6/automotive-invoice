import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'

export default function Navbar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav style={{ padding: 10, background: '#eee' }}>
      <Link href="/dashboard">Dashboard</Link> |{' '}
      <Link href="/products">Products</Link> |{' '}
      <Link href="/invoices">Invoices</Link> |{' '}
      <Link href="/settings">Settings</Link> |{' '}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}
