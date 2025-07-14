import Link from 'next/link'
export default function Navbar() {
  return (
    <nav style={{ padding: 10, background: '#eee' }}>
      <Link href="/login">Login</Link>{' | '}
      <Link href="/dashboard">Dashboard</Link>{' | '}
      <Link href="/products">Products</Link>{' | '}
      <Link href="/invoices">Invoices</Link>{' | '}
      <Link href="/settings">Settings</Link>
    </nav>
  )
}
