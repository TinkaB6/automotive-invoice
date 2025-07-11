import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Invoices() {
  const [sales, setSales] = useState<any[]>([])
  const [customer, setCustomer] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchSales()
  }, [])

  async function fetchSales() {
    let { data } = await supabase.from('sales').select('*')
    setSales(data || [])
  }

  async function createInvoice() {
    const { error } = await supabase.from('sales').insert([{ customer_name: customer, date: new Date().toISOString(), total }])
    if (error) alert("Error: " + error.message)
    else {
      setCustomer(''); setTotal(0)
      fetchSales()
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Invoices</h1>
      <input placeholder="Customer Name" value={customer} onChange={e => setCustomer(e.target.value)} />
      <input type="number" placeholder="Total" value={total} onChange={e => setTotal(Number(e.target.value))} />
      <button onClick={createInvoice}>Create Invoice</button>

      <h2>All Invoices</h2>
      <ul>
        {sales.map(s => (
          <li key={s.id}>{s
