import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    const { data, error } = await supabase.from('invoices').select('*').order('id', { ascending: false });
    if (error) console.error('Fetch error:', error);
    else setInvoices(data || []);
  }

  async function addInvoice() {
    if (!customer || !amount) return alert('All fields are required');
    const { error } = await supabase.from('invoices').insert([{ customer, amount: parseFloat(amount) }]);
    if (error) alert('Insert error: ' + error.message);
    setCustomer('');
    setAmount('');
    fetchInvoices();
  }

  async function deleteInvoice(id: number) {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) alert('Delete error: ' + error.message);
    fetchInvoices();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Invoices</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={addInvoice}>Add</button>
      </div>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Amount ($)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.customer}</td>
              <td>{inv.amount}</td>
              <td>
                <button onClick={() => deleteInvoice(inv.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Total: ${invoices.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}</h4>
    </div>
  );
}
