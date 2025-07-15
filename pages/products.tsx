// pages/products.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

type Product = { id: number; name: string; price: number }

export default function Products() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (error) alert(error.message)
    else setProducts(data ?? [])

    setLoading(false)
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault()
    const priceNum = parseFloat(price)
    if (!name || isNaN(priceNum)) return alert('Name + valid price required')

    const { error } = await supabase
      .from('products')
      .insert({ name, price: priceNum })

    if (error) alert(error.message)
    else {
      setName(''); setPrice('')
      fetchProducts()
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: 'auto' }}>
      <h2>Products</h2>
      <form onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br />
        <input
          type="number"
          placeholder="Price"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        /><br />
        <button type="submit">Add Product</button>
      </form>

      <h3>All Products:</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {products.map(p => (
            <li key={p.id}>
              {p.name} – ${p.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
