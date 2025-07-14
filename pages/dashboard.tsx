import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user)
    }
    getUser()
  }, [])

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>Welcome {user?.email}</h2>
        <p>This is the dashboard.</p>
      </div>
    </>
  )
}
