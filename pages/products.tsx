import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState(0)
  const [price, setPrice] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [])

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
    <div style=
