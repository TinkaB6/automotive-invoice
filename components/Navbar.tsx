import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{ padding: 10, background: '#ddd' }}>
      <Link href="/dashboard" style={{ marginRight: 10 }}>Dashboard</Link>
      <Link href="/products" style={{ marginRight: 10 }}>Products</Link>
      <Link href="/invoices" style={{ marginRight: 10 }}>Invoices</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  )
}
