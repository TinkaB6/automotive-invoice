import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';
import Navbar from '../components/Navbar';

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCustomer, setNewCustomer] = useState('');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    setLoading(true);
    const { data, error } = await supabase.from('invoices').select('*');
    if (error) console.error(error.message);
    else setInvoices(data || []);
    setLoading(false);
  }

  async function addInvoice() {
    const { error } = await supabase.from('invoices').insert([{ customer: newCustomer, amount: parseFloat(newAmount) }]);
    if (!error) {
      setNewCustomer('');
      setNewAmount('');
      fetchInvoices();
    } else {
      alert(error.message);
    }
  }

  async function deleteInvoice(id: number) {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (!error) fetchInvoices();
    else alert(error.message);
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: 40 }}>
        <h2>Invoices</h2>

        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Customer name"
            value={newCustomer}
            onChange={(e) => setNewCustomer(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button onClick={addInvoice}>Add Invoice</button>
        </div>

        {loading ? (
          <p>Loading invoices...</p>
        ) : (
          <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.customer}</td>
                  <td>${invoice.amount.toFixed(2)}</td>
                  <td>
                    <button onClick={() => deleteInvoice(invoice.id)} style={{ color: 'red' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
