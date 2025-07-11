import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState(0)
  const [price, setPrice] = useState(0)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    let { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  async function addProduct() {
    const { error } = await supabase.from('products').insert([{ name, sku, qty, price }])
    if (error) alert("Error: " + error.message)
    else {
      setName(''); setSku(''); setQty(0); setPrice(0)
      fetchProducts()
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>Products</h1>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="SKU" value={sku} onChange={e => setSku(e.target.value)} />
        <input type="number" placeholder="Qty" value={qty} onChange={e => setQty(Number(e.target.value))} />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(Number(e.target.value))} />
        <button onClick={addProduct}>Add Product</button>

        <h2>All Products</h2>
        <ul>
          {products.map(p => (
            <li key={p.id}>{p.name} (SKU: {p.sku}) - Qty: {p.qty}, Price: {p.price}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
