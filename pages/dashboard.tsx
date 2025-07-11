import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Dashboard() {
  const [sales, setSales] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      let { data: salesData } = await supabase.from('sales').select('*')
      let { data: productData } = await supabase.from('products').select('*')
      setSales(salesData || [])
      setProducts(productData || [])
    }
    fetchData()
  }, [])

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>Dashboard</h1>
        <h2>Sales</h2>
        <ul>
          {sales.map(s => (
            <li key={s.id}>{s.date}: {s.total} USD</li>
          ))}
        </ul>
        <h2>Inventory</h2>
        <ul>
          {products.map(p => (
            <li key={p.id}>{p.name} - Qty: {p.qty}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
