import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Settings() {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    async function fetchLogs() {
      let { data } = await supabase.from('audit_logs').select('*')
      setLogs(data || [])
    }
    fetchLogs()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Settings & Audit Logs</h1>
      <h2>Audit Logs</h2>
      <ul>
        {logs.map(l => (
          <li key={l.id}>{l.user_id} did {l.action} on {l.timestamp}</li>
        ))}
      </ul>
    </div>
  )
}
